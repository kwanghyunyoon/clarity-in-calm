# RESOLVED 2026-09-19 — see bottom of file

# Handoff: Journal tour spotlight misalignment — Modal fix done, 'save' step still broken

**Repo:** `clarity-in-calm`
**Date:** 2026-09-19

## Background

The per-screen coach-mark tours (Journal/Emotions/Insights, shipped at f4b8cf9) had
a real-device bug on a Moto G: the spotlight box that highlights each tour step's
anchor was drawn in the wrong place on Android. Two separate bugs were found. One
is fixed and pushed. One is not.

## Bug 1 — FIXED, pushed to main (commit d8fc04f)

`TourOverlay` rendered inside a React Native `<Modal>`. On Android, `<Modal>` opens
a **separate native window** whose coordinate origin doesn't match the window
`measureInWindow()` uses for the screen's content — so a correctly-measured anchor
position got drawn in the wrong place inside the Modal's window. This explained why
Journal's "Start with a template" step wrapped the header instead of the Templates
row.

**Fix:** turned `TourOverlay` into a same-window portal instead of a `Modal`,
mirroring the existing `PrivacyShield` pattern in `src/app/_layout.tsx` (a plain
absolutely-positioned `View`, not a native Modal window):

- `src/context/tour-overlay-context.tsx` (new) — `TourOverlayProvider` +
  `useTourOverlayContext`.
- `src/components/tour/TourOverlay.tsx` — split into `TourOverlay` (registers props
  with context, renders nothing), `TourOverlayView` (the actual dialog/spotlight
  JSX), and `TourOverlayHost` (mounted once at the root, renders whichever screen's
  tour is active).
- `src/app/_layout.tsx` — wired in `TourOverlayProvider` + `TourOverlayHost`.

Journal/Emotions/Insights needed zero changes to their `<TourOverlay>` call sites
— the props interface didn't change.

**Verified** via pixel sampling (PIL) on real device screenshots: sampled actual
pixel colors at the dim/bright boundary and confirmed it lines up almost exactly
with the computed box position for Journal's 'templates' and 'input' steps. Not a
"looks right" judgment call — checked numerically.

Also reduced `SPOTLIGHT_PAD` in `TourOverlay.tsx` from 8 to 4 — even after the
Modal fix, the box on step 1 crowded right up against the header (only a 16dp
natural gap between them, and an 8dp pad on both sides left almost nothing
visible). This is a separate, minor, real fix — keep it regardless of how the
'save' bug below resolves.

## Bug 2 — NOT FIXED, uncommitted in the working tree

Journal's 'save' tour step (dialogue: "Save your entry — Tap Save when you're
done...") highlights the **TAGS chip row** (#work #home #family #health...)
instead of the actual Save button, which sits dimmed just below the box.
Confirmed both via the user's own on-device screenshots
(`Screenshot_20260919-16*.png`, sitting untracked in repo root) and via adb
screenshots pulled during this session — not a screenshot artifact, reproduces
live.

### Diagnosis so far (measured, not guessed)

Added temporary debug refs/logging (still in the tree, see "cleanup" below) and
got concrete `measureInWindow()` numbers, cross-checked two ways:

- `saveBtnRef.current.measureInWindow()` **consistently and immediately stably**
  (identical across every animation frame — no settling delay involved at all)
  reports `y=589.14dp height=54.29dp`. Confirmed via two independent refs: the
  existing outer wrapper `View` and a second debug ref placed directly on the
  `AnimatedPressable` button inside it — both agree exactly.
- The TAGS section (separately ref'd for debugging,
  `<View style={styles.section} ref={tagsDebugRef}>` in
  `src/components/journal/JournalComposer.tsx`) reports
  `y=498.29dp height=66.86dp` → bottom = 565.14dp — a clean, normal 24dp gap
  before Save's `y=589.14dp`. The two measurements are internally
  self-consistent and look structurally correct in isolation (24dp matches the
  app's standard section gap).
- **But** a zoomed pixel crop of the actual screenshot (crop region
  y=900–1250px, 2x upscaled — see the "TAGS" crop taken during this session)
  shows the green spotlight border cutting straight through the middle of the
  visible tag chips, with the real "Save entry" pill button visible right
  at/below the box's bottom edge, mostly *outside* it. So the measured position
  doesn't match the *visual render* position for this one anchor, despite being
  internally consistent with its sibling's (TAGS) measurement.

### Hypothesis tried and REJECTED

`removeClippedSubviews` on the Journal screen's FlatList
(`src/components/journal/JournalEntryList.tsx`) — theory was that content inside
the tall `ListHeaderComponent` (the whole `JournalComposer`), below the initial
viewport fold, was getting clipped/detached by this Android rendering
optimization, causing `measureInWindow` to report a stale position for anything
past the fold. Removed the prop (edit still in the working tree, with an
explanatory comment) and re-tested live on-device — **bug still reproduces
identically** (same `y=589.14` in the debug log, same visual mismatch). This
was not the (or not the only) root cause. The removal can probably be reverted
unless further investigation still implicates it — it's currently just dead
weight in the diff.

### Next things worth trying

- Check whether `windowSize` / `maxToRenderPerBatch` on that same FlatList
  still cause some form of header virtualization even without
  `removeClippedSubviews`.
- Check whether `KeyboardAvoidingView`'s `"height"` behavior
  (`src/app/(tabs)/journal.tsx`) is doing something to the Save button's
  rendered-vs-layout position — it's the one wrapper between `Screen` and the
  `FlatList`/header that actively resizes things.
- Consider whether `react-native-reanimated`'s layout-animation machinery
  (used elsewhere in this tree) has some interaction with plain
  (non-`Animated`) sibling Views' `measureInWindow` correctness.
- Consider scrolling the anchor into view *before* measuring, the way the
  existing `'past'` step already special-cases a
  `listRef.current?.scrollToEnd({ animated: true })` call before its own
  measurement. `'save'` sits below the fold on a phone screen just like
  `'past'` does, but has no scroll-into-view treatment — `'past'` being the
  one step that already needed this is a strong hint that off-screen-at-
  measurement-time is the real shape of the bug, even though the
  `removeClippedSubviews` theory for *why* didn't pan out.
- Try `onLayout`-based measurement relative to the ScrollView/FlatList's own
  content offset instead of a bare `measureInWindow()`, which might sidestep
  whatever Android-specific quirk is causing the mismatch.

## Separate, not yet investigated

The Emotions tab's tour step 1 (emotion picker) spotlight also looked slightly
off in one of the user's uploaded screenshots
(`Screenshot_20260919-163144_clarity-in-calm.png`) — the box seems to clip the
top "What are you feeling?" heading and the bottom "Surprise"/"+Other" pills
row. Not yet root-caused; lower priority than the Journal `'save'` bug, but
worth the same pixel-sampling treatment once `'save'` is solved.

## Other changes in the working tree (uncommitted, keep these — good fixes)

- `src/utils/measureWhenSettled.ts` (+ `__tests__/measureWhenSettled.test.ts`):
  ported from the sibling `dreami` repo (its commit d5ccf63, issue #91) — polls
  `measureInWindow` via `requestAnimationFrame` until 3 consecutive frames read
  identical, instead of a fixed 350ms `setTimeout`, before locking in a tour
  step's spotlight position. Applied to `journal.tsx`, `emotions.tsx`,
  `insights.tsx` (replacing their old `MEASURE_SETTLE_MS` timeout effects).
  `npx tsc --noEmit` was clean and `npx jest measureWhenSettled` passed (4/4)
  as of the last check in this session.

## Debug instrumentation still in the tree — clean up once 'save' is fixed

- `src/app/(tabs)/journal.tsx`: `console.log('[tour-debug] frame'/'SETTLED', ...)`
  inside the `measureWhenSettled` callback.
- `src/components/journal/JournalComposer.tsx`: `tagsDebugRef` and
  `saveInnerDebugRef` (plus the wrapping `<View ref={saveInnerDebugRef}>` around
  the `AnimatedPressable`), and a debug `useEffect` logging
  `'[tour-debug] TAGS-section'` / `'SAVE-inner-button'` / `'SAVE-outer-wrapper'`
  600ms after mount.

All of this needs to be removed before calling the fix done — it was added
purely to get concrete `measureInWindow` numbers instead of guessing from
screenshots.

## Live device / tooling notes

- Moto G connected via
  `adb -s "adb-ZT4225SW82-fwmA1o (2)._adb-tls-connect._tcp"`. App package:
  `com.clarityincalm.app`. Metro (`npx expo start --dev-client`) serves JS on
  port 8081; `adb reverse tcp:8081 tcp:8081` lets the device reach it as
  `127.0.0.1:8081`. JS-only edits hot-reload live on-device — no rebuild
  needed for anything in this investigation.
- To force a fresh JS load after edits Fast Refresh doesn't pick up cleanly:
  `adb shell am force-stop com.clarityincalm.app`, then
  `am start -n com.clarityincalm.app/.MainActivity`, then tap
  "Recently Opened → clarity-in-calm" on the dev-client launcher screen.
- To re-trigger the Journal tour without wiping app data: Settings tab →
  scroll to "ABOUT" → "Replay Journal tour" (also "Replay Emotions tour" /
  "Replay Insights tour").
- Debug log lines land in `.expo/dev/logs/start.log` as JSON-lines; filter
  with something like:
  ```bash
  tail -N /home/jayhaxxx88/projects/clarity-in-calm/.expo/dev/logs/start.log | python3 -c "
  import json,sys
  for line in sys.stdin:
      try:
          d = json.loads(line)
          if d.get('_e') == 'metro:client_log' and any('tour-debug' in str(x) for x in d.get('data', [])):
              print(d['data'])
      except: pass
  "
  ```
- Pixel-level screenshot verification used PIL in a throwaway venv (this
  session's job tmp dir, won't persist into a new session) — recreate with
  `python3 -m venv <dir> && <dir>/bin/pip install pillow` if needed again.
  It's what caught both the Modal-fix confirmation and the tag-chip/save-button
  mismatch crop.

## Also done this session, unrelated to this bug (don't redo)

- A GitHub Actions workflow (`.github/workflows/android-debug-build.yml`)
  builds a debug APK on a hosted runner instead of locally (this machine has
  OOM'd on local Gradle builds before — see `AGENTS.md`). Trigger with
  `gh workflow run android-debug-build.yml --ref main`, poll with
  `gh run view <id> --json status,conclusion`, download with
  `gh run download <id> --name clarity-in-calm-debug-apk`. Already used once
  successfully (run `35473448400`) to test the Modal-portal fix, before the
  `'save'`-button bug was found via live JS reload instead (faster iteration
  than a full CI build).
- A handoff doc about that CI-build approach was written to the sibling
  `dreami` repo: `dreami/github-actions-android-debug-build-handoff.md`
  (left uncommitted there, matching how other handoff docs in that repo are
  also untracked).

## Git state

Nothing has been committed since **d8fc04f** (the Modal-portal fix, already
pushed to `origin/main`). Everything else described above is sitting
uncommitted in the working tree. Do not commit until the `'save'` step bug is
actually fixed and the debug instrumentation is cleaned up.

## RESOLUTION (2026-09-19, continuation session)

Root cause found and fixed. It wasn't specific to the 'save' step — every
Journal/Emotions/Insights tour anchor was affected, but only 'save' made it
obvious because the box landed on unrelated content (the tags row) instead of
just being "slightly off" on the same element.

**Root cause:** `measureInWindow()` on this device (Android, edge-to-edge,
`targetSdkVersion 36`) returns Y coordinates that exclude the status-bar
inset, while the tour overlay (`TourOverlayHost`, a root-level portal) and
the physical screen both use full edge-to-edge window coordinates. Every
anchor's measured `y` was reported exactly `insets.top` too small — confirmed
numerically on-device: `insets.top` logged as `40`, and real anchor positions
(cross-checked via pixel-sampling actual screenshots against measured
coordinates) were consistently `measured_y + 40dp`. This affected *every*
anchor, not just 'save' — 'templates' and 'input' were also off, just not
enough to look wrong (the box still mostly overlapped the right content).

Two rejected theories from the original investigation turned out to be red
herrings for the real bug (though one produced a real, unrelated
improvement):
- `removeClippedSubviews` — not the cause; reverted back to enabled.
- `KeyboardAvoidingView`'s Android `'height'` behavior — tested by disabling
  it entirely; had zero effect on the misalignment, so reverted back to
  `'height'`.

**Fix:** in each screen's tour-measurement effect (`journal.tsx`,
`emotions.tsx`, `insights.tsx`), add `insets.top` (from `useSafeAreaInsets()`,
already in scope in all three files) to the settled box's `y` before calling
`setSpotlight`/`setTourSpotlight`. One line each, no other changes needed —
`measureWhenSettled`, `TourOverlay`, and the anchor refs were all already
correct.

Verified live on-device for all 4 Journal tour steps (templates/input/
save/past) and the Emotions tour's 'picker' step (previously also
slightly off per the "Separate, not yet investigated" note above) —
all spotlight boxes now tightly and correctly frame their anchors.

All debug instrumentation (console.log calls, extra debug refs/onLayout
handlers in `JournalComposer.tsx` and `JournalEntryList.tsx`) has been
removed. `npx tsc --noEmit` is clean and `npx jest measureWhenSettled` passes
(4/4). Nothing has been committed — this is still sitting in the working
tree, same as the rest of this session's other uncommitted changes.
