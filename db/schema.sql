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
  created_at   timestamptz not null default now(),
  helped_at    timestamptz
);

create index if not exists messages_live_idx on messages (kindling_id, created_at) where helped_at is null;
create index if not exists messages_rate_limit_idx on messages (client_token, created_at);

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

-- A soft per-device speed bump, not real abuse protection: the client
-- generates a random token once (see app/src/lib/clientToken.js) and
-- persists it in localStorage. Anyone can clear storage and bypass
-- this, so it stops accidental double-taps and naive scripts, not a
-- determined spammer — see README.md for real anti-abuse follow-ups.
create or replace function enforce_rate_limit()
returns trigger
language plpgsql
as $$
begin
  if exists (
    select 1 from messages
    where client_token = new.client_token
      and created_at > now() - interval '20 seconds'
  ) then
    raise exception 'Slow down — try again in a moment.' using errcode = '23505';
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
-- ---------------------------------------------------------------------
alter table messages enable row level security;

drop policy if exists "public can read messages" on messages;
create policy "public can read messages" on messages
  for select using (true);

drop policy if exists "public can drop a message" on messages;
create policy "public can drop a message" on messages
  for insert with check (true);

-- No update or delete policy: nobody can edit a message's text, and
-- "helped" can only happen through mark_helped() below, never a raw
-- UPDATE — see that function for why.

-- ---------------------------------------------------------------------
-- Marking a message "helped" goes through this function instead of an
-- UPDATE grant, so a client can only ever flip helped_at from null to
-- now() on one row it names by id — never touch kindling_id or text,
-- never un-help a message, never touch a row that isn't null already.
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
grant execute on function mark_helped(uuid) to anon, authenticated;

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
