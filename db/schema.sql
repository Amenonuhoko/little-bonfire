-- Little Bonfire / Dead Drop — Supabase schema
--
-- Run this once, in full, in the Supabase SQL editor (Dashboard → SQL
-- Editor → New query) on a fresh project. See README.md for the two
-- keys to copy afterwards. Safe to re-run: every statement is
-- idempotent (create-if-not-exists / drop-if-exists first).

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------
create table if not exists messages (
  id           uuid primary key default gen_random_uuid(),
  kindling_id  text not null check (kindling_id in ('disgrace', 'ruin', 'vigil', 'resolve', 'grace')),
  text         text not null check (char_length(text) between 10 and 500),
  client_token text not null check (char_length(client_token) between 8 and 100),
  -- sha256 of the dropper's IP, computed server-side in app/api/drop.js —
  -- never the raw IP. Nullable because it only exists on rows inserted
  -- through that endpoint (seed rows, and anything inserted before this
  -- column existed, have none).
  ip_hash      text,
  created_at   timestamptz not null default now(),
  helped_at    timestamptz
);

create index if not exists messages_live_idx on messages (kindling_id, created_at) where helped_at is null;
create index if not exists messages_rate_limit_token_idx on messages (client_token, created_at);
create index if not exists messages_rate_limit_ip_idx on messages (ip_hash, created_at) where ip_hash is not null;

-- created_at / helped_at / id are never trusted from the client — this
-- forces every insert back to server-assigned values regardless of what
-- a request tries to set, so a crafted payload can't backdate a message
-- or insert one that's already "helped".
create or replace function reset_server_columns()
returns trigger
language plpgsql
as $$
begin
  new.id := gen_random_uuid();
  new.created_at := now();
  new.helped_at := null;
  return new;
end;
$$;

drop trigger if exists messages_reset_server_columns on messages;
create trigger messages_reset_server_columns
  before insert on messages
  for each row execute function reset_server_columns();

-- Two independent speed bumps, checked together: client_token (a random
-- value the browser persists in localStorage — trivially reset by
-- clearing storage) and ip_hash (set server-side in app/api/drop.js,
-- not client-controlled at all). Neither is real abuse protection on
-- its own — IPs are shared behind NAT/offices, and a determined spammer
-- can rotate both — but together they stop accidental double-taps and
-- naive scripts. See README.md for real anti-abuse follow-ups.
create or replace function enforce_rate_limit()
returns trigger
language plpgsql
as $$
begin
  if exists (
    select 1 from messages
    where created_at > now() - interval '20 seconds'
      and (
        client_token = new.client_token
        or (new.ip_hash is not null and ip_hash = new.ip_hash)
      )
  ) then
    raise exception 'Slow down — try again in a moment.';
  end if;
  return new;
end;
$$;

drop trigger if exists messages_enforce_rate_limit on messages;
create trigger messages_enforce_rate_limit
  before insert on messages
  for each row execute function enforce_rate_limit();

-- ---------------------------------------------------------------------
-- Reads: a message is "live" (still floating on the fire) while it
-- hasn't been marked helped and hasn't aged out past 9 days, matching
-- the "day N of 9" flavor text in the compose templates.
-- ---------------------------------------------------------------------
create or replace view live_messages
with (security_invoker = on) as
  select id, kindling_id, text, created_at
  from messages
  where helped_at is null
    and created_at > now() - interval '9 days';

-- ---------------------------------------------------------------------
-- Row Level Security
--
-- Reads stay public (nothing here is sensitive — no accounts, no PII,
-- just anonymous text). Writes do NOT: there is deliberately no insert
-- or update policy for anon/authenticated. Every drop and every "this
-- helped" goes through the app/api/drop.js and app/api/help.js
-- serverless functions, which use the service-role key — a key that
-- bypasses RLS entirely and must never reach the browser (it's read
-- from process.env.SUPABASE_SERVICE_ROLE_KEY server-side only, never
-- the VITE_-prefixed vars Vite bundles into client code).
--
-- The payoff: even someone who reads the anon key out of the deployed
-- JS bundle and calls Supabase's REST API directly can only ever SELECT
-- — not insert a message or mark one helped. Both of those triggers
-- above (reset_server_columns, enforce_rate_limit) still run for the
-- service-role path too, since triggers apply regardless of who's
-- writing — RLS and triggers are independent, so this isn't "trust the
-- server instead," it's "trust the server AND keep the same guardrails."
-- ---------------------------------------------------------------------
alter table messages enable row level security;

drop policy if exists "public can drop a message" on messages;

drop policy if exists "public can read messages" on messages;
create policy "public can read messages" on messages
  for select using (true);

-- No insert, update, or delete policy for anon/authenticated at all.

-- ---------------------------------------------------------------------
-- Marking a message "helped" goes through this function rather than a
-- raw UPDATE, even from the service role: it can only ever flip
-- helped_at from null to now() on one row named by id — never touch
-- kindling_id or text, never un-help a message — a second guardrail in
-- case app/api/help.js itself ever has a bug.
-- ---------------------------------------------------------------------
create or replace function mark_helped(target_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update messages
  set helped_at = now()
  where id = target_id
    and helped_at is null;
end;
$$;

revoke all on function mark_helped(uuid) from public;
grant execute on function mark_helped(uuid) to service_role;

-- ---------------------------------------------------------------------
-- Seed rows — one real example per kindling, the same text the app
-- already ships as its local fallback, so the fire opens looking
-- exactly as it does today instead of empty.
-- ---------------------------------------------------------------------
insert into messages (kindling_id, text, client_token, created_at)
select * from (values
  ('disgrace', 'I said I wouldn''t, and then I did it before noon. Told no one for a week. Nothing burned down.', 'seed-disgrace', now()),
  ('ruin', 'It broke while I was holding the rest of it together. I thought someone would come. No one came.', 'seed-ruin', now()),
  ('vigil', 'Sixth week of waiting on someone else''s decision. I cleaned things that were already clean. The waiting was the whole thing.', 'seed-vigil', now()),
  ('resolve', 'I decided in a car park. It held for about an hour. Then I decided again.', 'seed-resolve', now()),
  ('grace', 'The smell of rain on the worst week. I stopped walking. I’d have missed it a year ago.', 'seed-grace', now())
) as seed(kindling_id, text, client_token, created_at)
where not exists (select 1 from messages);
