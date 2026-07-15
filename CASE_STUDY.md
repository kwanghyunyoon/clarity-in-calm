# Clarity in Calm — Redesign Case Study
**Date:** June 29, 2026
**Branch:** `claude/clarity-calm-redesign-mdvdqj` → merged to `main` via PR #2

---

## Overview

This documents a full UI/UX and feature redesign of **Clarity in Calm**, a React Native / Expo mindfulness app. The original app focused on box breathing, a basic mood logger, and a progress tab. The redesign refocused it entirely on **journaling and emotion tracking**, with a new 5-tab navigation structure, a $4.99 one-time IAP unlock, and a robust set of supporting features.

---

## Starting Point

The original app had:
- 4 tabs: Breathe, Journal, Progress, Settings
- Basic box breathing exercise
- Single mood picker + free-write journal
- Simple progress stats (streak, sessions)
- No emotion tracking
- Stub IAP (set `unlocked: true` without any purchase)
- No real notification scheduling
- Hardcoded English strings in several components
- ScrollView + `.map()` for journal entries (no virtualization)

---

## Goals

1. Refocus on journaling + emotion tracking as the core value prop
2. Implement a 32-emotion Plutchik wheel as the emotion logging centrepiece
3. Build robust journaling: 6 templates, tags, search, multi-entry per day
4. Implement real IAP ($4.99 one-time unlock) via RevenueCat
5. Wire up `expo-notifications` with real permission flow and scheduling
6. Dark mode with midnight navy base, `useSafeAreaInsets()` on every screen
7. Keep all data encrypted (AES-256-GCM via existing `secureRead`/`secureWrite`)

---

## What Was Built

### 1. Navigation Restructure
Replaced the 4-tab layout with a **5-tab structure**:

| Tab | Purpose |
|-----|---------|
| Today | Daily dashboard — streak, recent entries, quick-log shortcuts |
| Journal | 6 templates, tags, search, entry list |
| Emotions | Plutchik wheel, intensity slider, context tags, body check-in |
| Insights | Mood trends, top emotions, 7-day chart |
| Settings | IAP, notifications, language, data export, privacy |

---

### 2. Journaling System

**6 templates** added to `src/constants/emotions.ts`:
- Free Write (rotating daily prompts)
- Gratitude
- Daily Reflection
- Thought Check (CBT reframe)
- Weekly Review
- Future Self Letter

**Features:**
- Tag system (10 preset + unlimited custom tags, stored encrypted)
- Full-text search across notes and tags
- Multi-entry per day support
- Crisis keyword detection → modal with crisis line links

**FlatList refactor:**  
`ScrollView + .map()` replaced with a virtualized `FlatList`. The compose form was moved into `ListHeaderComponent` to avoid nested scroll issues while keeping the form always visible above the entry list.

```tsx
<FlatList
  data={filteredEntries}
  renderItem={renderEntry}
  ListHeaderComponent={listHeader}
  ListEmptyComponent={listEmpty}
  removeClippedSubviews
  initialNumToRender={8}
  maxToRenderPerBatch={8}
  windowSize={5}
/>
```

---

### 3. Future Self Letters

The most complex journaling feature. When the "Future Self 💌" template is selected:

- A date picker banner appears below the note input
- Tapping it opens a custom scrollable month/day/year picker modal (pure React Native — no native date picker dependency)
- The chosen unlock date is saved with the entry as `unlockAt` (ISO string) and `isFutureSelf: true`

**Entry rendering has two states:**

| State | Appearance |
|-------|-----------|
| Sealed (today < unlockAt) | Closed envelope card — big 💌, "Unlocks on [date]", content hidden |
| Revealed (today ≥ unlockAt) | Normal entry with "💌 Letter from past you" badge |

The `JournalEntry` type already had `isFutureSelf` and `unlockAt` fields; the `addEntry` signature was extended to accept them. Data is stored in the same encrypted store as all other entries — no migration needed.

---

### 4. Emotion Tracking (Plutchik Wheel)

Built `src/components/emotions/PlutchikWheel.tsx` using `react-native-svg`:
- 32 emotions across 3 rings (core, secondary, tertiary)
- 8 primary emotion families colour-coded
- Tap any segment to select it
- Dark mode aware (ring 2/3 label fill switches based on `scheme`)

**Emotion log fields:**
- Emotion (from wheel)
- Intensity (1–10 slider with `onLayout`-based dynamic width)
- Context tags
- Body check-in regions
- Coping actions
- Optional note

**`IntensitySlider` fix:**  
The original slider used a hardcoded `TRACK_WIDTH = 260` constant which broke on iPhone SE and in landscape. Fixed with `onLayout` to measure actual rendered width and update the thumb position accordingly.

---

### 5. IAP — RevenueCat One-Time Unlock

**Choice:** RevenueCat over `expo-in-app-purchases` (deprecated) or StoreKit directly.

**Architecture:**
- All credentials isolated in `src/config/iap.ts` — swap 4 values to go live
- RevenueCat initialised lazily inside `handleUnlock`/`handleRestore` (no startup cost when IAP not needed)
- Full purchase + restore flow with entitlement verification

```ts
// src/config/iap.ts
export const IAP_CONFIG = {
  REVENUECAT_API_KEY_IOS:     'appl_PLACEHOLDER_REPLACE_ME',
  REVENUECAT_API_KEY_ANDROID: 'goog_PLACEHOLDER_REPLACE_ME',
  ENTITLEMENT_ID:             'clarity_unlock',
  PRODUCT_ID:                 'clarity_unlock_499',
  DISPLAY_PRICE:              '$4.99',
} as const;
```

The previous stub simply called `setIAPStatus({ unlocked: true })` with no purchase — replaced with a real `purchasePackage` → entitlement verification flow.

---

### 6. Notifications

Built `src/lib/notifications.ts` with three exported helpers:

```ts
requestNotificationPermission(): Promise<boolean>
scheduleDailyReminder(hour, minute): Promise<void>
cancelDailyReminder(): Promise<void>
```

In Settings:
- Toggle requests permission before enabling (no silent failures)
- Custom `TimePicker` modal (24-hour × 4 minute options: 0/15/30/45)
- Notification state derived directly from `settings.notifications.enabled` (removed local state that could drift out of sync)

---

### 7. Data Export

The "Export all data" setting was previously a `Alert.alert('coming soon')` stub. Replaced with a real implementation:

1. Reads all 5 encrypted storage keys via `secureRead`
2. Parses JSON values, serialises the whole payload with `exportedAt` timestamp
3. Writes to `FileSystem.cacheDirectory` via `expo-file-system`
4. Opens native share sheet via `expo-sharing`

Both `expo-file-system` (transitive) and `expo-sharing` were already installed.

---

### 8. Onboarding Slides Update

The onboarding modal had 4 slides referencing the old app (box breathing, mood picker, progress tab). Updated to **5 slides** matching the new structure:

| Slide | Title | Visual |
|-------|-------|--------|
| 0 | Welcome to Clarity in Calm | Pulsing lotus orb |
| 1 | Your Daily Dashboard | Streak card + quick-action pills |
| 2 | Journal Your Way | Template card list |
| 3 | Map Your Emotions | SVG Plutchik colour wheel |
| 4 | Discover Your Patterns | Mini bar chart |

All 4 locales updated: English, Korean (한국어), Spanish (Español), Hindi (हिन्दी).

---

### 9. Bug Fixes & Code Quality

| Issue | Fix |
|-------|-----|
| `useTheme()` destructuring wrong in onboarding | `const colors = useTheme()` → `const { colors } = useTheme()` |
| `todayEmotions` re-computed every render | Wrapped in `useMemo` |
| `getLast7Days()` called in render body | Wrapped in `useMemo([], [])` |
| `StreakCard` hardcoded English strings | Added `entriesLabel`/`emotionsLabel` props, wired to i18n |
| `handleDeleteAll` was a no-op | Replaced with `Promise.all(DATA_KEYS.map(k => secureDelete(k)))` |
| `IntensitySlider` hardcoded 260px width | Dynamic `onLayout` measurement |
| Notification toggle local state drift | Removed local state, derived from context |
| Journal `ScrollView + .map()` | FlatList with virtualization |
| Crisis modal missing `onRequestClose` | Added to prevent Android back-button orphan |
| PlutchikWheel dead code + dark mode label | Removed dead lookup, added scheme-aware fill |

---

## Technical Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native + Expo SDK 56 |
| Router | Expo Router (file-based) |
| Storage | `expo-secure-store` + AES-256-GCM (custom `secureRead`/`secureWrite`) |
| Animations | `react-native-reanimated` v4, `react-native-animated` |
| SVG | `react-native-svg` |
| IAP | `react-native-purchases` (RevenueCat) |
| Notifications | `expo-notifications` |
| File sharing | `expo-file-system` + `expo-sharing` |
| i18n | Custom `useTranslation` hook, 4 locales |
| Safe area | `react-native-safe-area-context` (`useSafeAreaInsets`) on every screen |

---

## Files Changed (Key)

```
src/
  app/
    index.tsx           — Today screen (StreakCard i18n props)
    journal.tsx         — FlatList refactor, Future Self Letters, templates, tags, search
    settings.tsx        — Real IAP, notifications, data export, TimePicker modal
    insights.tsx        — getLast7Days memoization
  components/
    emotions/
      PlutchikWheel.tsx — Dark mode fix, dead code removal
      IntensitySlider.tsx — Dynamic width via onLayout
    today/
      StreakCard.tsx     — i18n props
    onboarding-modal.tsx — 5-slide flow, new visuals, ThemeColors type fix
  context/
    wellness-context.tsx — addEntry extended for isFutureSelf/unlockAt
    emotion-context.tsx  — todayEmotions memoization
  config/
    iap.ts              — NEW: RevenueCat credentials (swap to go live)
  lib/
    notifications.ts    — NEW: permission + schedule + cancel helpers
  i18n/
    translations.ts     — New keys across all 4 locales
  types/
    index.ts            — JournalEntry.isFutureSelf, JournalEntry.unlockAt (pre-existing)
app.config.js           — expo-notifications plugin added
```

---

## Outcome

- PR #2 opened, reviewed, all findings fixed, and merged to `main`
- All Netlify deploy previews green throughout
- Zero breaking changes to existing encrypted data — all new fields are optional on existing entries
- RevenueCat credentials are placeholder stubs; swapping 4 values in `src/config/iap.ts` is all that's needed to go live

---

## 2026-07-14 — Local Android build fix + Feelings Library feature

**Thread 1: Local Android debug build**
- Root cause of `./gradlew assembleDebug` failure: `expo-in-app-purchases` (legacy Expo Modules API) is incompatible with SDK 56's `expo-modules-core` — the app had already migrated to RevenueCat's `react-native-purchases`, so the old package was dead weight.
- Fix: removed `expo-in-app-purchases` from `package.json`, `npm install`, `npx expo prebuild --platform android --clean`, reapplied the low-RAM `gradle.properties` fix (`org.gradle.jvmargs=-Xmx1536m -XX:MaxMetaspaceSize=512m` — wiped by `--clean` prebuild, must reapply every time). See `[[local_android_build_setup]]` memory for full detail.
- Follow-up session: root cause fix confirmed correct — `expo-in-app-purchases` was already removed from `package.json`/`node_modules` and `gradle.properties` jvmargs fix was in place. A background rebuild I (Claude) kicked off (`assembleDebug`, PID 19954) turned out to be redundant with the user's own build already running in their own terminal (PID 17335, started 20:29) — killed the redundant one on request. **The user's own terminal build subsequently completed successfully** (user confirmed "its done" — exact APK path not re-verified by Claude this session, but the build that had been stuck at the old `expo-in-app-purchases` compile error is now fixed and completes). Next session should just confirm `android/app/build/outputs/apk/debug/app-debug.apk` exists and install/launch on the emulator if not already done.

**Thread 2: Feelings Library feature**
- Implemented per plan at `/home/jayhaxxx88/.claude/plans/shiny-crunching-yeti.md`:
  - `src/constants/feelings-library.ts` (new) — 8 emotions (anger, anxiousness, burnout, fear, sadness, insecurity, loneliness, overwhelm), each with original Notice/Hear/Feel/Ease/Explore content, written fresh without reading `Feelings.pdf` during drafting (per user's explicit no-copy requirement).
  - `src/app/feelings-library.tsx` (new) — grid of expand-in-place cards, same pattern as `emotions.tsx`.
  - `src/app/_layout.tsx` — registered `feelings-library` as a hidden route (`href: null`), same as `breathe`/`ground`/`progress`.
  - `src/app/index.tsx` — added a `ToolCard` entry point to the tools grid, plus a `PLUTCHIK_TO_FEELINGS_CATEGORY` partial mapping (only anger/fear/sadness family wheel ids map honestly) driving an affirmation card that shows the mapped emotion's `ease` line when the most recent logged emotion matches, falling back to the existing `QUOTES` rotation otherwise.
  - `src/i18n/translations.ts` — added `feelingsLibraryScreen` chrome-string namespace across en/ko/es/hi (body content stays English-only for v1, as flagged in the plan).
- Verified: `npx tsc --noEmit` — zero errors from any new/edited file (pre-existing unrelated errors only, in jest test files and `settings.tsx`).
- **Verified this session:** manually diffed all 8 drafted entries against every emotion chapter (Anger, Anxiousness, Burnout, Fear, Sadness, Insecurity, Loneliness, Overwhelm) in `Feelings.pdf` — no phrasing overlap. Calm's PDF uses a Notice/Hear/Feel/Ease/Explore body-map-and-affirmation format; the app's content is original and differently worded/structured throughout. This verification step from the plan is complete.
- **Still not done:** manual golden-path walkthrough in a running app (`npx expo start`, Metro was up at `localhost:8081` this session) — Today → Feelings Library → expand cards → log an anger/fear/sadness emotion → confirm affirmation card swaps → log an unmapped emotion (e.g. joy) → confirm fallback to `QUOTES`. Blocked this session because the emulator (`emulator-5554`) was occupied by the user's own gradle build; now that the build is done, this should be unblocked next session.
- Uncommitted at end of session — nothing has been git-committed yet (package.json/package-lock.json changes, i18n edits, and all new feelings-library files are still just working-tree changes).

**Meta: created a `wrap` skill this session** (discovered one already existed at `~/.agents/skills/wrap/SKILL.md` from a prior session — kept as-is rather than replacing).

---

## 2026-07-15 — Bigger emotion wheel, first-launch language screen, onboarding expansion, floating language pill

**Thread 1: Emotion wheel resize**
- Resolved the open [[emotion_wheel_ui_issue]] bug (small tap targets, overlapping labels). User's first framing was a big thumb-spinnable cropped wheel, but after clarifying questions the actual ask was simpler: keep tap-to-select, just make the wheel bigger and fully visible.
- `src/components/emotions/PlutchikWheel.tsx` — `SIZE` changed from a fixed `280` to `Math.min(Dimensions.get('window').width - 24, 440)`, with a `SCALE` factor applied to all ring radii and font sizes so everything grows proportionally.

**Thread 2: Onboarding expansion + first-launch language screen + floating pill**
- Expanded the existing 5-slide onboarding tour (`src/components/onboarding-modal.tsx`) to 7 slides: added a Settings-tab explainer slide and a "Built to Protect You" slide with a big green shield icon (custom `react-native-svg` path — the 🛡️ emoji renders blue/silver by default, not green, so a plain-emoji approach was rejected after visual verification) plus a privacy checklist (encryption, no uploads, no ads/trackers, export/delete anytime).
- Added a first-launch-only language-selection screen as a new step inside the same onboarding modal: 4 language cards labeled in their own script (English, 한국어, Español, हिन्दी — see new `src/constants/languages.ts`), tap-to-preview (calls `setLocale` live), Continue button disabled until a pick is made. Gated by its own AsyncStorage key `@cic:hasChosenLanguage`, independent from the existing `@cic:hasSeenOnboarding` tour flag — this lets "View onboarding again" (new row added to Settings → About, calls `useHelp().showHelp()`) replay the tour without repeating the language step.
- Added `src/components/language-pill.tsx` (new) — a floating top-left pill shown on every tab screen except Settings (which already has its own language section), tap opens a dropdown of all 4 languages by native name, tapping one switches the whole app's locale in place with no navigation. Mounted globally in `src/app/_layout.tsx`.
- All new UI strings added across all 4 locales (en/ko/es/hi) in `src/i18n/translations.ts`.

**Verification**
- `npx tsc --noEmit` checked incrementally after each file/chunk (per user's explicit ask mid-session to pace work and verify as it goes, not batch-and-check-at-the-end — see [[feedback_pace_and_verify]]) — zero new errors introduced anywhere.
- No project skill exists for running this app and `chromium-cli` wasn't available in this environment, so verification used `npx expo start --web` + a scratch Playwright script (see [[verify_via_expo_web_playwright]] for the recipe). Walked the full flow in a real headless-Chromium session at 390×844: language screen → 7-slide tour (screenshotted the new Settings and Shield slides) → Today screen → Emotions wheel (confirmed bigger, clearer labels) → language pill dropdown → live switch to Korean → Settings screen (confirmed pill correctly hidden, confirmed "View onboarding again" row present and working, confirmed replay skips the language step).
- **Bug found and fixed during verification:** the floating pill's absolute top-left position collided with and visually cut off each tab screen's header title (e.g. "Good morning" became "d morning"). Fixed by adding a `Spacing.six` (64px) left margin to the header title in `src/app/index.tsx`, `src/app/journal.tsx`, `src/app/emotions.tsx`, and `src/app/insights.tsx`. Confirmed fixed via a second screenshot pass.
- Only console noise observed: harmless `react-native-web` PanResponder shim warnings (`Unknown event handler property... onResponderGrant` etc.), unrelated to this work.

**Status:** Fully implemented and visually verified via the web build. Not yet git-committed — working tree has these changes plus the untracked feelings-library work from the prior session still sitting uncommitted. Not yet tested on native Android/iOS (web-only verification so far — react-native-svg and react-native-web render slightly differently from native in some edge cases, worth a native sanity check before shipping).

---

## 2026-07-15 (later) — Architecture review (`/improve-codebase-architecture`), no code changes

Ran the architecture-review skill twice this session (first at default effort, then redone at the user's request after they set `/effort` to `high`). No `CONTEXT.md` or `docs/adr/` exist in this repo yet. Both runs were pure analysis — **nothing was implemented or committed**; two self-contained HTML reports were written to the OS tmp dir (not the repo) and opened for the user:
- `/tmp/architecture-review-1784109335.html` (pass 1)
- `/tmp/architecture-review-1784109777.html` (pass 2, deeper — supersedes pass 1)

**Confirmed findings (pass 1, held up in pass 2):**
1. `toLocalDateStr` duplicated 6x (not 5) — `journal.tsx:41`, `insights.tsx:21`, `progress.tsx:46`, `emotion-context.tsx:17`, `wellness-context.tsx:31`, plus `wellness-context.tsx`'s `computeStreak:34` re-derives day boundaries independently again.
2. Four persistence contexts (wellness/emotion/settings/language) each hand-roll load→isLoaded→save boilerplate; `language-context.tsx:37-50` is worse than first thought — it bypasses `secure-storage.ts` entirely and talks to raw `AsyncStorage` with its own key.
3. `journal.tsx:235-244` — `handleCrisisConfirm`/`handleCrisisSave` are byte-identical.
4. `use-translation.ts:13-16` is a 6-line pass-through over the 1349-line `translations.ts`; `crisisKeywords` duplicated per-locale at lines 250/714/1001/1286 with no parity check.
5. All three `__tests__/*.test.ts` files (Breathing/EncryptedJournal/MoodTracker) have **zero imports from `src/`** (confirmed via grep) — they reimplement logic inline and don't actually test shipped code.
6. `src/lib/secure-storage.ts` (+`.web.ts`) called out as the positive counterexample — a genuinely deep module (3-fn interface hiding AES-GCM, key mgmt, v1→v2 migration) to use as the template for #2.

**New findings, pass 2 only (higher effort found these on a wider sweep):**
- **Live data-integrity bug, not just style debt:** `settings.tsx:42-47` hand-maintains `DATA_KEYS` for "Delete All Data" (line 288) / "Export Data" (line 300) — it's missing `wellness-context.tsx:28`'s `wellness_sessions_v1` key. Breathing-session history currently survives account deletion and is silently omitted from data exports. **This should probably be fixed on its own regardless of whether the bigger refactor happens** — it's a small, low-risk, high-value fix (each context should own/export its storage key(s); settings.tsx should import the list, not hand-copy it).
- Three divergent `LANGUAGES` arrays for the same 4 locales: canonical `constants/languages.ts:10-14`, plus `onboarding-modal.tsx` has **two of its own** (imports the canonical one as `LANGUAGE_OPTIONS` at line 13/385, *and* hand-declares a second differently-shaped local `LANGUAGES` at line 26, used at 516/527), plus a third shape in `settings.tsx:35-39`.
- `onboarding-modal.tsx` (712 lines) also contains a fully unrelated `FeedbackModal` (lines 32-150) with its own Discord-webhook POST (`FEEDBACK_WORKER`) and issue-type state machine — no connection to onboarding.
- `src/config/iap.ts`'s RevenueCat keys are still placeholder stubs (`appl_PLACEHOLDER_REPLACE_ME` etc., as originally documented above under "Outcome") and `settings.tsx:194-238` fully wires the purchase/restore flow against them — flagged as a product decision (finish RevenueCat config or gate the flow), not a mechanical refactor.

**Top recommendation given to user:** fix the `settings.tsx` storage-key leak first (real bug, cheap fix), ideally as part of the `usePersistedState`/`dateKey` consolidation so `settings.tsx` gets one place to ask "what keys exist" instead of a hand-copied list.

**Not yet decided:** user had not picked a candidate to implement as of end of session — next session should ask which of the above to build, starting with the storage-key bug if no preference is stated.

---

## 2026-07-15 (final) — Fixed the settings.tsx DATA_KEYS bug, committed and pushed

Asked the user which architecture-review candidate to tackle first; they picked the recommended option, the `settings.tsx` storage-key bug.

**Fix implemented:**
- `src/context/wellness-context.tsx` — added `export const WELLNESS_STORAGE_KEYS = [STORAGE_KEY_ENTRIES, STORAGE_KEY_ENTRIES_LEGACY, STORAGE_KEY_SESSIONS, STORAGE_KEY_TAGS]`.
- `src/context/emotion-context.tsx` — added `export const EMOTION_STORAGE_KEY = STORAGE_KEY`.
- `src/context/settings-context.tsx` — added `export const SETTINGS_STORAGE_KEY = STORAGE_KEY`.
- `src/app/settings.tsx` — replaced the hand-copied `DATA_KEYS` string array with `const DATA_KEYS = [...WELLNESS_STORAGE_KEYS, EMOTION_STORAGE_KEY, SETTINGS_STORAGE_KEY]`, importing from the three contexts above.

Net effect: `wellness_sessions_v1` (breathing-session data) is now included in "Delete All Data" and "Export Data"; any future storage key added to one of these contexts flows into settings.tsx automatically instead of requiring a manual, easily-forgotten edit.

**Verification:** `npx tsc --noEmit` and `npx eslint` on the four touched files. Both showed pre-existing errors (untyped `__tests__/*.test.ts` files missing jest globals; `settings.tsx`'s unrelated `expo-file-system` `cacheDirectory`/`documentDirectory` typing mismatch) — confirmed unchanged by diffing against a `git stash` of the fix, so nothing new was introduced. Not run against a live app session (no UI surface for this change beyond the two settings-screen buttons; logic-only fix).

**Outcome:** Code fix committed as `404d266` ("fix: settings.tsx no longer drops wellness_sessions_v1 from delete/export") and pushed to `origin/main` (`b012b7b..404d266`). This log entry was written afterward and committed separately.

**Still open from the architecture review** (not started): `usePersistedState`/`dateKey` consolidation across the 4-5 persistence contexts (including `language-context.tsx` bypassing `secure-storage.ts`), pointing the 3 `__tests__/*.test.ts` files at real `src/` code, the 3 divergent `LANGUAGES` arrays, the shallow `useTranslation()` wrapper + duplicated `crisisKeywords`, the unrelated `FeedbackModal` embedded in `onboarding-modal.tsx`, and the still-placeholder RevenueCat keys in `src/config/iap.ts`. Full detail in the "2026-07-15 (later)" entry above.

**Separately, still uncommitted in the working tree** (untouched this session, not part of this fix): `.agents/`, `.claude/skills/`, `Feelings.pdf`, `eslint.config.js`, `gradlelog.md`, `skills-lock.json` — these predate this session; see prior CASE_STUDY.md entries and MEMORY.md for the Feelings Library and onboarding/language-pill features they relate to.

---

## 2026-07-15 (next) — `usePersistedState`/`dateKey` consolidation

Picked the next architecture-review candidate off the still-open list: consolidating the duplicated `toLocalDateStr` helper and the hand-rolled load→isLoaded→save boilerplate across the persistence contexts.

**`toLocalDateStr`:** extracted the byte-identical implementation (duplicated 6x — `journal.tsx`, `insights.tsx`, `progress.tsx`, `emotion-context.tsx`, `wellness-context.tsx` x2) into `src/lib/date-utils.ts`; all six call sites now import it instead of redefining it.

**`usePersistedState`:** added `src/lib/use-persisted-state.ts`, a hook wrapping `secureRead`/`secureWrite` with the load→isLoaded→save effect pair every context re-implemented by hand. Options: `legacyKey` (read a fallback key if the primary key has no saved value — used for `wellness-entries` v1→v2 migration), `transform` (applied to whatever loaded, e.g. merging defaults), `onSaveResult` (surfaces save failures, e.g. `wellness-context`'s `saveError`).

**Migrated all four contexts:**
- `emotion-context.tsx` — straightforward swap, single key.
- `settings-context.tsx` — uses `transform` to merge `DEFAULT_SETTINGS` with whatever was saved.
- `wellness-context.tsx` — three `usePersistedState` calls (entries w/ `legacyKey` fallback to v1, breathing sessions, custom tags), combined `isLoaded = entriesLoaded && sessionsLoaded && tagsLoaded`, shared `onSaveResult` callback feeding the existing `saveError` state (tags save was never wired to `saveError` before either — preserved that asymmetry rather than changing behavior).
- `language-context.tsx` — the one flagged as bypassing `secure-storage.ts` entirely (talked to raw `AsyncStorage` with its own `@cic_locale` key). Now goes through `usePersistedState` like everything else, with `transform` re-validating the saved value is a known locale (falls back to device-detected locale otherwise, same as before). **Known behavior change:** since the encrypted store uses a different underlying `AsyncStorage` key (`@cic_enc:@cic_locale` vs. the old plain `@cic_locale`), existing installs will not read their previously-saved language preference on first launch after this update — it re-detects from the device locale instead, which is a low-stakes, self-healing fallback (not lost data, just a preference reset).

**Deliberately left open:** `settings.tsx`'s `DATA_KEYS` (used by "Delete All Data"/"Export Data") does *not* include the locale key — locale was never covered by that flow even when it lived in plain `AsyncStorage`, and folding it in is a product-scope decision (should "Delete All Data" also reset the language pref?), not a mechanical part of this refactor.

**Lint note:** moving the `useState` setters behind a custom hook made ESLint's `react-hooks/exhaustive-deps` stop recognizing them as stable identities (it special-cases setters returned directly from `useState`, not from wrapping hooks), producing 10 new warnings across the three contexts with `useCallback`s. Fixed by adding the setter to each callback's deps array — zero behavior change, since the setter actually is stable, just satisfies the linter explicitly.

**Verification:** `npx tsc --noEmit` — output identical to the pre-refactor baseline (only the pre-existing test-file/expo-file-system errors, confirmed via diff). `npx eslint` on all touched files — 9 warnings, matching the pre-refactor baseline exactly (all pre-existing unused-import/unused-var warnings, unrelated to this change). Not run against a live app session — logic-only refactor preserving existing gating (`isLoaded` checks) and effect timing; no new UI surface.

**Net:** 124 lines of duplicated load/save/date-key boilerplate removed, 42 lines added (two new small `src/lib/` modules) — net -82 lines across 7 modified + 2 new files.

**Outcome:** Committed as `0e88366` ("refactor: consolidate persistence-context boilerplate and date-key helper") and pushed to `origin/main` (`417e6cc..0e88366`).

**Still open from the architecture review:** pointing the 3 `__tests__/*.test.ts` files at real `src/` code, the 3 divergent `LANGUAGES` arrays, the shallow `useTranslation()` wrapper + duplicated `crisisKeywords`, the unrelated `FeedbackModal` embedded in `onboarding-modal.tsx`, and the still-placeholder RevenueCat keys in `src/config/iap.ts`.

---

## 2026-07-15 (still later) — Pointed the 3 dead test files at real `src/` code

Asked the user which remaining architecture-review candidate to tackle next; they picked the dead-test-files finding. All three `__tests__/*.test.ts` files reimplemented the logic they claimed to test inline, so they exercised zero shipped code — confirmed by reading each test against its supposed source. Also discovered along the way: `package.json` had no `test` script at all, so `npm test` couldn't even run them.

**`BreathingExercise.test.ts`:** `breathe.tsx`'s phase-timing logic (which phase is active at elapsed-ms `t`, and the countdown display) lived inline inside a `setInterval` callback, not exported anywhere. Extracted it to a new `src/lib/breathing.ts` (`PHASE_DURATIONS`, `CYCLE_MS`, `getPhaseAtTime`, `getPhaseCountdownAtTime`), rewired `breathe.tsx`'s phase tracker to call the extracted functions instead of the inline loop (identical behavior, same 80ms poll), and rewrote the test to import from `@/lib/breathing` instead of redeclaring the same duration table and loop.

**`MoodTracker.test.ts`:** `computeStreak` was a private, unexported function in `wellness-context.tsx`; the test had a byte-identical private copy, including a redeclared `toLocalDateStr` that already exists as an export in `src/lib/date-utils.ts` (from the prior session's consolidation). Exported `computeStreak` from `wellness-context.tsx` and rewired the test to import both real functions.

**`EncryptedJournal.test.ts`:** the worst case — it tested raw `globalThis.crypto.subtle` AES-GCM directly, disconnected from `secure-storage.ts` entirely, and per [[hermes_no_web_crypto]] that Web Crypto API doesn't even exist on-device (Hermes has no `crypto.subtle`); the test was validating a capability the app doesn't use. Rewired it to call `secure-storage.ts`'s real exported API (`secureWrite`/`secureRead`/`secureDelete`) instead. That required jest-mocking three native modules `secure-storage.ts` imports: added `__mocks__/expo-crypto.ts` (real AES-256-GCM via the `globalThis.crypto` WebCrypto global — unavailable on-device but genuine AES-GCM under test, so encrypt/decrypt/tamper-detection behavior is authentic, standing in only for the native Keystore/CryptoKit call), `__mocks__/expo-secure-store.ts` (in-memory key/value map standing in for Keychain/Keystore), and `__mocks__/@react-native-async-storage/async-storage.js` (re-exports the package's own official jest mock). New test cases cover roundtrip, ciphertext-doesn't-contain-plaintext, GCM tamper detection (flip a ciphertext byte → `secureRead` returns `null`), missing-key read, delete, and empty-string roundtrip.

**Added `"test": "jest"` to `package.json` scripts** — previously missing, so these tests had no run path via `npm test` (unclear if any CI step called `npx jest` directly; either way this closes the gap).

**Verification:** `npx jest` — all 3 suites, 18 tests pass. `npx tsc --noEmit` — clean on every touched/new file (had to fix a lib.dom.d.ts `Uint8Array<ArrayBufferLike>` vs `Uint8Array<ArrayBuffer>` generic mismatch in the new `expo-crypto` mock — same class of issue `secure-storage.ts` already works around with `as ArrayBuffer` casts); remaining `tsc` output is the pre-existing `settings.tsx` `expo-file-system` typing mismatch only (confirmed via `git stash` diff — the jest-globals-in-test-files errors are gone now that `@types/jest` question is moot for these files' *logic*, but no `@types/jest` package was installed so the `describe`/`test`/`expect` global-name errors are unchanged, pre-existing, and out of scope for this fix). `npx eslint` on all touched/new files — zero warnings or errors. Not run against a live app session — pure logic/test-infra change, no UI surface.

**Outcome:** Committed as `9b7f054` ("fix: point the 3 __tests__ files at real src/ code instead of reimplementing it"). Not yet pushed to `origin/main` — awaiting explicit push instruction.

**Still open from the architecture review:** the 3 divergent `LANGUAGES` arrays, the shallow `useTranslation()` wrapper + duplicated `crisisKeywords`, the unrelated `FeedbackModal` embedded in `onboarding-modal.tsx`, and the still-placeholder RevenueCat keys in `src/config/iap.ts`.

---

## 2026-07-15 (yet later) — Consolidated the 3 divergent `LANGUAGES` arrays

Asked the user which remaining architecture-review candidate to tackle next; they picked the `LANGUAGES` finding. `src/constants/languages.ts` already held a canonical `LanguageOption[]` (`{ locale, flag, nativeName }`), consumed correctly by `language-pill.tsx`, but two more call sites had drifted into their own hand-copied arrays for the same 4 locales:

- `settings.tsx` had its own `{ code, label, flag }`-shaped array (field named `code` instead of `locale`).
- `onboarding-modal.tsx` had **two** language lists: it already imported the canonical array as `LANGUAGE_OPTIONS` for the first-launch language-picker cards, *and* separately hand-declared a second, differently-shaped local `LANGUAGES` (`{ locale, flag, label }`) for the persistent per-slide language-toggle row — that second one used deliberately abbreviated labels (`EN`, `한`, `ES`, `हि`) rather than full native names, so it wasn't pure duplication, just a shape that didn't fit the canonical type.

**Fix:** added a `shortLabel` field to `LanguageOption` in `src/constants/languages.ts` (`EN`/`한`/`ES`/`हि`, one per locale) so the abbreviated-label use case is representable in the canonical array instead of needing a separate list. Then:
- `settings.tsx` — deleted its local array, imports `LANGUAGES` from `@/constants/languages`, uses `lang.locale`/`lang.nativeName` instead of `lang.code`/`lang.label`. Also dropped its now-unused `Locale` type import.
- `onboarding-modal.tsx` — deleted its local array, dropped the `LANGUAGE_OPTIONS` alias (both use sites now just import `LANGUAGES` directly), and the toggle row reads `lang.shortLabel` instead of `lang.label`.

Net: one array definition instead of three, `grep -rn "LANGUAGES\s*[:=]"` across `src/` now matches only `constants/languages.ts`.

**Verification:** `npx tsc --noEmit` and `npx eslint` on all four touched/consuming files — output identical to a `git stash`-diffed baseline (same pre-existing `__tests__/*.test.ts` jest-globals errors and `settings.tsx` `expo-file-system` typing mismatch; zero new errors or warnings). Also verified live in a browser per [[verify_via_expo_web_playwright]]: ran `expo start --web`, drove it with a scratch Playwright script — confirmed the first-launch language-picker cards still show full native names (English/한국어/Español/हिन्दी), the onboarding per-slide toggle row still shows the abbreviated labels (EN/한/ES/हि), and the Settings screen's language section shows full native names with correct checkmark/selection state and successfully switches the whole app's locale (screenshotted mid-flow in English and after switching to Korean).

**Outcome:** Committed as `9a18ee5` ("refactor: consolidate the 3 divergent LANGUAGES arrays into one source of truth") and pushed to `origin/main` (`96e0a2a..9a18ee5`).

**Still open from the architecture review:** the shallow `useTranslation()` wrapper + duplicated `crisisKeywords`, the unrelated `FeedbackModal` embedded in `onboarding-modal.tsx`, and the still-placeholder RevenueCat keys in `src/config/iap.ts`.
