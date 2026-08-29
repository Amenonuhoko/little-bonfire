# Dead Drop

An anonymous, mood-based messaging app modeled on the Dark Souls/Elden Ring message system: brief, templated notes left for strangers. No profiles, no feeds, no replies — you open the app because you feel something, and either read or drop.

## How it works

- **Kindling** — five moods to choose from: Disgrace, Ruin, Vigil, Resolve, Grace. Each has several template "flavors" to fill in.
- **Templates, not free text** — every drop is built by filling in blanks from a flavor-specific template, forcing specificity over generic positivity.
- **Scarcity** — each kindling has a fixed number of slots (Grace is unbounded). Dropping a message fills a slot; a kindling goes read-only when full. Slots free up when a message is marked "this helped" — retirement as a form of success, not moderation.
- **The bonfire** — the home screen: a fire whose embers represent live messages, colored per kindling, with successfully "spent" messages rising to become stars.

## Stack

React + Vite. Persistence is Supabase (Postgres) when configured — see **Database setup** below — with an in-memory local fallback so the app runs and deploys fine before that's done.

## Development

```bash
cd app
npm install
npm run dev
```

## Build

```bash
cd app
npm run build
```

## Deploy

Pushes to `main` build the app and publish it to GitHub Pages via `.github/workflows/deploy.yml`.

## Database setup

Without the two keys below, the app runs in **local-only mode**: a handful of seed messages, nothing persisted across reloads, nothing shared between visitors — it still works and deploys fine, just like before this was added. Doing the setup below makes drops real: they persist, and everyone who opens the site sees the same fire.

1. Create a free project at [supabase.com](https://supabase.com).
2. In the project's SQL Editor, paste in the full contents of [`db/schema.sql`](db/schema.sql) and run it. It creates the `messages` table, the read-only-after-9-days view, row-level security policies, a rate-limited insert, and a safe `mark_helped` function — see the comments in that file for what each piece does and why.
3. In the project's **Settings → API**, copy the **Project URL** and the **anon public** key.
4. Add both as GitHub repo secrets, named exactly `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (Settings → Secrets and variables → Actions → New repository secret). The next push to `main` will build with them baked in.
5. For local dev, copy `app/.env.example` to `app/.env` and fill in the same two values.

That's the whole setup — no other code changes needed. `app/src/lib/store.js` picks the Supabase-backed implementation automatically as soon as those two values are present (`app/src/lib/supabase.js` is what checks).

**Known limits, honestly stated:**
- The anti-spam protection is a soft per-browser rate limit (one drop per ~20 seconds, via a token in localStorage) plus a length check on the text — not real abuse protection. Someone determined to spam this can still do it. A CAPTCHA or IP-based limit (e.g. a Supabase Edge Function in front of inserts) would be the next step if that becomes a problem.
- Stars ("this helped" count) and the ember on the fire aren't synced live across open tabs/visitors — each session fetches once on load. Supabase Realtime could be added later for that; it wasn't included here to keep the first pass simple and testable.
- This was built and tested against the **local fallback** path only (no live Supabase project was available to test against while writing it). The SQL and client code were written carefully and the interface between them is small, but treat the first real deploy against a live database as the actual first test of that path — check the browser console for errors after a drop.
