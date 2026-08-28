# Mobile app design brief

_Started 2026-08-28 05:38 UTC_

---

## User

Design a mobile app for

## Assistant



## Assistant

_[tool: update_todos]_

_[tool: github_get_tree]_

_[tool: github_list_repos]_

_[tool: github_get_tree]_

`little-bonfire` has no commits yet — nothing to read — and your message got cut off after "Design a mobile app for". So a few questions before I build.

_[tool: ask_user]_

Waiting on your answers — mainly what the app does and the design system pick.

## User

<system-info comment="Only acknowledge these if relevant">
Project title is now "Mobile app design project"
</system-info>

<pasted_text name="Pasted text (75 lines)">
# Dead Drop — Concept Doc

## One-line pitch
A messaging app modeled on the Dark Souls/Elden Ring message system: brief, templated, anonymous notes left for strangers. Instead of gameplay tips, the messages are wisdom and reassurance. No location or task context — it's purely moment-based: you open the app because you feel something, and either read or drop.

## Core loop
1. Open the app.
2. Pick the bucket that matches how you feel right now.
3. Either **read** a message someone left in that bucket, or **drop** one of your own using that bucket's template.
4. That's it. No profiles, no feeds, no replies.

## The two mechanics that carry the whole app

### 1. The counter (scarcity)
Each bucket has a fixed number of slots (e.g. 50 messages live at once). Dropping a message fills a slot; the counter ticks down. When a bucket hits zero, it's read-only until slots free up.

Slots free up three ways:
- **Decay** — a message ages out after a set number of days.
- **Downvote-off** — enough "not this" signals retire it.
- **Spent** — enough people mark "this helped," and it retires *because it succeeded*, not because it was removed. This reframes retirement as a form of completion rather than deletion, and is the mechanic worth protecting — it's what makes leaving a message feel like it mattered.

This does real design work: no infinite scroll, no firehose, and a near-full bucket is itself information ("a lot of people are here right now").

### 2. The template (the actual product)
No free text. Every drop is built from a fixed, bucket-specific template — same spirit as Souls' word-wheel, but tuned to force *specificity* instead of sentiment. Generic positivity ("you can do this!") is the failure mode to design against.

Template shapes that work for this:
- **Situational / earned** — locked to the moment implied by the bucket, so the line has to be about *this*, not wisdom-in-general.
- **Confession-shaped, not command-shaped** — "I almost quit here too" over "you can do it." Admission reads as earned; imperatives read as posters.
- **Understatement** — short, dry, occasionally funny. Restraint is what keeps "wisdom app" from curdling into "motivational poster app."

## The buckets
Five, forming a loose (non-linear) arc: fall → damage → waiting → turn → landing.

| Bucket | What it's for |
|---|---|
| **Disgrace** | You did the thing you said you wouldn't. |
| **Ruin** | Something broke and you don't know if it's fixable. |
| **Vigil** | Waiting on something you can't control. |
| **Resolve** | Decided something, need it to hold. |
| **Grace** | A good moment you don't want to lose. |

Design notes on the set:
- Deliberately not therapy-app vocabulary ("anxious," "restless"). Words with weight self-select for better writing — "disgrace" won't tolerate a platitude the way "restless" will.
- No real overlap: Disgrace is self-inflicted, Ruin is external, Vigil is powerlessness, Resolve is forward motion, Grace is the only non-struggle bucket.
- **Open question**: "Poise" (staying composed while still mid-pressure, as distinct from Resolve's moment of deciding) was considered as a possible swap for Resolve — sharper and less prone to New Year's-resolution cheese, but not yet decided.
- **Open question**: whether Grace should use the same scarcity/counter mechanic as the other four, or work differently since it isn't a struggle bucket (rationing joy might feel wrong).

## Tone guardrails
- No advice-giving voice. Messages sound like a stranger who's been there, not a coach.
- Specificity over sentiment, always — bucket names and templates should make platitudes structurally hard to write.
- Humor is allowed and useful as a release valve against cringe.
- Retirement (spent) is a success state, not a moderation action — protect this framing in any UI copy.

## Home screen concept: the bonfire
The app opens on a bonfire at a campground, not a menu.

- **Embers** float up from the fire, each one a live message, colored by its bucket. This is the visual form of the "ember field" — the whole pool of currently-live messages, drifting rather than listed.
- **Stars** are spent messages — embers that rose, were marked "this helped" enough times, and retired upward into the sky. The sky itself becomes a record of everything that succeeded, without displaying any content.
- **Touch the screen** to enter the create flow: select a bucket, fill its template, drop.
- **After dropping**, the bonfire visibly grows (a small flare/response to the act of contributing) and spits out a new ember, which joins the field in its bucket's color.
- **Scroll up** from the bonfire to move from the fire itself up into the ember field and toward the sky, surfacing the most-liked spent messages (stars) the further up you go. Scrolling up is literally scrolling toward what's already succeeded.

This gives the counter mechanic a physical home: a bucket's ember density in the field shows how full it is, and a star is the visible proof that "spent" means success, not deletion.

## Mockup direction (for reference)
- **Palette**: deep slate background, bone/parchment text, an aged-bronze glow for live message text (a deliberately un-Souls-orange accent), one muted color per bucket.
- **Type**: Fraunces (carved, characterful serif) for bucket names and message text; Inter for UI chrome; IBM Plex Mono for the slot counter, styled like HUD/inventory data.
- **Signature element**: the slot counter rendered as a row of ticks that burn out one by one — the visual embodiment of the scarcity mechanic.
- Four core screens: bonfire (home), bucket/template select, read view (ember field), drop confirmation.

## Open questions to resolve next
1. Poise vs. Resolve (or both, if the bucket count can flex past 5).
2. Whether Grace shares the scarcity mechanic.
3. Draft an actual template for one bucket to pressure-test whether the vocabulary produces good output or just sounds good as a label.
</pasted_text>

## User



## Assistant

Empty repo, rich brief — building from the concept doc.

_[tool: update_todos]_

_[tool: copy_starter_component]_

_[tool: grep]_

_[tool: read_file]_

_[tool: dc_write]_

_[tool: write_file]_

_[tool: ready_for_verification]_

## User

Found issues — fixing…

## Assistant

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

## User

Found issues — fixing…

## Assistant

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

## User

lets work on this

i need a clear indication of nature
the bonfire should be higher so that its the main thing you see
no button should be visible on the home
once a user taps the screen then you can see the call to action

## Assistant

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

Now the home overlay markup.

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: show_html]_

_[tool: show_html]_

_[tool: dc_js_str_replace]_

_[tool: multi_screenshot]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: multi_screenshot]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: multi_screenshot]_

_[tool: multi_screenshot]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

Now the template: drop the top text, add a sky legend.

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_js_str_replace]_

Now strip the dead `drawOld` body.

_[tool: run_script]_

_[tool: multi_screenshot]_

_[tool: show_html]_

_[tool: get_webview_logs]_

_[tool: grep]_

_[tool: multi_screenshot]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: multi_screenshot]_

_[tool: show_html]_

_[tool: multi_screenshot]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: show_html]_

_[tool: multi_screenshot]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: run_script]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: run_script]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: run_script]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: run_script]_

_[tool: ready_for_verification]_

