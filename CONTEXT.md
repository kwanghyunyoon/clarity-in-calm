# Context

## Glossary

### Shared visual identity (trio)

The umbrella goal (tracked as issue #28, part of the trio brand/identity map #25) of making
Clarity-in-Calm, Dreami, and ClarityAI read as sibling apps. Decomposed into five independent
sub-decisions, each resolved separately rather than as one verdict:

1. **Color/theme** — light (cream/sage, currently Clarity-in-Calm + ClarityAI) vs. dark
   (navy/indigo, currently Dreami) vs. per-app base color with a shared structural language.
2. **Iconography** — the icon set and language switcher pattern (currently fragmented: emoji +
   Ionicons + custom logos mixed within single screens across all three apps).
3. **Typography** — display/heading typeface (currently: system default sans in all three, no
   distinct face anywhere).
4. **Surface/elevation treatment** — how depth and hierarchy are communicated (flat outlined
   cards in Clarity-in-Calm/ClarityAI vs. Dreami's glow/tinted-icon-chip/elevation cues).
5. **Component shape language** — the rendering mechanism itself (flat cards vs. ClarityAI's
   glassmorphism/frosted-glass surfaces) — a different concern from elevation, since two apps
   could share an elevation *philosophy* while still rendering it through different surface
   mechanics.

Source: trio visual audit, issue #26 (closed 2026-07-24), comments from all three apps.
All five sub-decisions resolved via `/grilling` on issue #28 — see
[ADR-0001](docs/adr/0001-trio-shared-visual-identity.md).

### Backup vs. Export vs. Restore

Three distinct data-movement concepts that must not be conflated (resolved via `/grilling`,
2026-09-15, in the design session for issue-tracked "encrypted backup + restore"):

- **Backup** — a passphrase-encrypted, portable file containing the *entire* `ALL_DATA_KEYS`
  registry (journal/check-ins, emotion/coping logs, custom tags, settings, onboarding flags).
  Replaces the old plaintext "Export all data (JSON)" Settings action as the one true full-data
  export. Decryptable only with the passphrase chosen at backup time — there is no recovery
  path if it's forgotten.
- **Restore** — importing a Backup file. Always a *full replace*: existing on-device data is
  deleted and overwritten with the backup's contents, never merged. The backup is decrypted and
  structurally validated *before* any existing on-device data is touched or a destructive
  confirmation is shown. Reachable both from Settings (existing install) and from first launch
  (new/reset device), offered before language selection since settings are themselves restored.
- **ClarityAI export** ("Share data with ClarityAI") — a separate, unrelated curated
  analytics-only summary (mood values, streak, counts). Not a backup candidate; untouched by the
  above.

### Trio app connections

Distinct from "shared visual identity" above — this covers whether the three apps share any
backend/account system or data, versus just looking related. Resolved via `/grilling` on issue
#29: the trio stays three fully independent apps/backends (no SSO, no cross-app data access),
connected only by lightweight cross-promotion (store-listing links), no deep-linking. See
[ADR-0002](docs/adr/0002-trio-app-connections.md).

### Exercise, Quick Launch, Launch point

Vocabulary for reaching calming exercises fast (resolved via `/grilling`, 2026-09-23):

- **Exercise** — a guided calming activity: Breathe (box breathing) or Grounding (5-4-3-2-1).
  Exercises live inside Clarity-in-Calm. Splitting them out as standalone apps was considered
  and rejected: a separate app doesn't reduce the taps needed in a panic moment, and
  [ADR-0002](docs/adr/0002-trio-app-connections.md) already rules out deep-linking between
  apps.
- **Quick Launch** — opening the app directly into an Exercise that is *already running*,
  bypassing Today, the splash, and Onboarding. A first-ever Quick Launch defers Onboarding to the
  next normal launch rather than interrupting the Exercise. A Quick-Launched Breathe opens with a
  short "get ready" lead-in before the first inhale (a normal in-app Start does not). A Quick
  Launch into an Exercise already in progress *resumes* it; it only restarts one that was
  finished or never begun. Leaving the Exercise lands on Today.
  A Quick Launch into an already-open app must not discard an unsaved journal entry. Sessions
  count toward stats exactly like normal ones. Only Breathe and Grounding are Quick-Launchable;
  crisis resources are deliberately not a Quick Launch target.
- **Launch point** — any system surface outside the app that triggers a Quick Launch: app
  shortcut (long-press icon), pinned home-screen shortcut, Quick Settings tile, home-screen
  widget. Launch point labels follow the *device* language, not the in-app language picker.
- **Quick access page** — the permanent in-app explainer for Launch points, reached from
  Settings ("Quick access"). Offers a one-tap system "Add" for each Launch point the device
  supports, and manual steps where it doesn't.
- **Feature announcement** — a one-time, dismissible card on Today ("Calm in one tap") pointing
  existing users to the Quick access page. Shown once, ever; Launch points added later join the
  Quick access page silently rather than re-announcing. Distinct from **Onboarding** (new users
  get a dedicated Onboarding slide instead) and from a **Screen tour** (none on Exercise screens —
  it would interrupt the Exercise itself).

### Screen tour vs. Onboarding

Two distinct first-run explainer concepts that must not be folded into one flag or flow
(resolved via `/grilling`, 2026-09-19):

- **Onboarding** — the app-level, full-screen, blocking first-launch flow (`useOnboardingFlow`,
  `@cic:hasSeenOnboarding`). Covers the whole app once, ever (until replayed from Settings).
- **Screen tour** — a narrower, per-screen coach-mark/spotlight walkthrough (`useScreenTour`,
  one `@cic:hasSeen*Tour` flag per screen) for a screen's own content — e.g. Journal, Emotions,
  Insights. Auto-shows once per screen, independently of onboarding and of each other; each has
  its own Settings replay row. Fires immediately the first time its screen is unseen, with no
  gate on onboarding having just closed. A step whose anchor doesn't exist yet at tour-start
  (content that only appears after a user action) renders as a centered dialogue with no
  spotlight rather than being skipped — but if *most* of a screen's steps would be anchorless,
  the tour is collapsed to fewer, denser steps instead of a run of empty-state cards (this is
  why the Emotions tour is 2 steps, not one step per section).
