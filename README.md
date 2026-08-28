# Dead Drop

An anonymous, mood-based messaging app modeled on the Dark Souls/Elden Ring message system: brief, templated notes left for strangers. No profiles, no feeds, no replies — you open the app because you feel something, and either read or drop.

## How it works

- **Buckets** — five moods to choose from: Disgrace, Ruin, Vigil, Resolve, Grace. Each bucket has its own fixed message template.
- **Templates, not free text** — every drop is built by filling in blanks from a bucket-specific template, forcing specificity over generic positivity.
- **Scarcity** — each bucket has a fixed number of slots. Dropping a message fills a slot; the bucket goes read-only when full. Slots free up when a message is marked "this helped" — retirement as a form of success, not moderation.
- **The bonfire** — the home screen: a fire whose embers represent live messages, colored per bucket, with successfully "spent" messages rising to become stars.

## Stack

React + Vite, frontend-only (all state is local/in-memory — no backend yet).

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

Deployed to GitHub Pages. `vite.config.js` sets `base: '/little-bonfire/'` for the project-pages path — update it if the deploy target changes.
