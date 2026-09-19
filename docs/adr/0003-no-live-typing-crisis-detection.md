---
status: accepted
---

# No live/typing-time crisis detection — save-time gate + pattern detection cover it

Context: after real-device verification of #70/#71/#74, the question came up of whether
`detectConcern` (currently only checked once, at Save, in `JournalComposer.tsx`) should also
run continuously while the user types, so a crisis/trauma signal could surface before they even
tap Save. Resolved via `/grill-with-docs`.

Decision: **no continuous/live keystroke scanning is added.** Researched real-world precedent
(Google Search's crisis-hotline prompt, Meta/Instagram's suicide-and-self-harm detection) shows
neither intervenes on raw live keystrokes in a private compose box — both trigger at a
*submission* boundary (a search query submitted, a post/message sent), which for this app is
already the existing save-time gate. The one genuinely "live" signal either precedent uses is a
**frequency-over-time** trigger (Meta alerts parents when a teen repeatedly searches crisis
terms in a short window) — which this app already ships as `detectPattern` (#73/#74), not a gap
to fill.

Continuous mid-sentence scanning was also rejected on its own terms: it risks the modal
interrupting someone before they've finished expressing a hard thought, in tension with the
crisis copy's own "that takes courage to write down" framing, with no found precedent showing
it's worth that cost (Google's own static banner approach is limited by documented "banner
blindness").

## Considered options

- **(a) No live detection** (chosen) — save-time gate + `detectPattern` already match how
  Google/Meta actually do this.
- **(b) Debounced, every-keystroke detection** — rejected: no real-world precedent found, and a
  real interruption risk mid-composition.
- **(c) Pause/blur-triggered detection** — a middle ground that was on the table, but dropped
  once precedent showed even "live-ish" signals in the wild are submission- or frequency-based,
  not continuous-while-composing.
