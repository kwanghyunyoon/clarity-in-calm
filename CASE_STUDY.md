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

**Outcome:** Committed as `9b7f054` ("fix: point the 3 __tests__ files at real src/ code instead of reimplementing it"). Pushed to `origin/main` in a later session's batch push (see the 2026-07-15 "(last)" entry below).

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

---

## 2026-07-15 (next again) — Categorized `crisisKeywords` for cross-locale parity

Asked the user which remaining architecture-review candidate to tackle next; they picked the `crisisKeywords` finding (`use-translation.ts:13-16` is a thin pass-through hook over `translations.ts`; `crisisKeywords` duplicated per-locale with no parity check). Re-derived the finding first: `src/i18n/translations.ts`'s `journal.crisisKeywords` was a flat `string[]` per locale (en=22, ko=23, es=20, hi=15 items) with nothing — no test, no lint rule, no type-level constraint beyond "some array of strings exists" — checking that all 4 locales cover the same crisis concepts. Since this only feeds `journal.tsx`'s `checkCrisis()` (a substring `.includes()` scan that shows a "reach out for help" modal before saving a journal entry), an uncaught gap here is a real safety miss, not just style debt.

**Fix:** regrouped each locale's flat array into 5 semantic categories — `suicidalIdeation`, `hopelessness`, `givingUp`, `selfHarm`, `overdose` — reclassifying every existing phrase into its category (zero phrases added, removed, or reworded; verified the per-locale item counts before/after are identical: 22/23/20/15). Because `ko`/`es`/`hi` are declared `: Translations` (`= Loosen<typeof en>`), giving `en.journal.crisisKeywords` this keyed shape makes TypeScript itself enforce that every locale defines the same category keys — a missing category is now a compile error, not a silent gap. `journal.tsx`'s `checkCrisis()` updated from `(tj.crisisKeywords as readonly string[]).some(...)` to `Object.values(tj.crisisKeywords).flat().some(...)`.

**Real gap surfaced by the categorization (not fixed — flagged for the user):** `ko` and `hi` both have a fully empty `overdose` category (0 phrases; `es` and `en` have 1 each). `hi`'s `hopelessness` category is also thin (2 phrases vs. en's 6). Left these as empty arrays with an inline comment rather than inventing crisis-detection phrases myself — mistranslating self-harm/suicide-detection keywords in a mental-health app is a clinical/translation-accuracy call I'm not positioned to make unilaterally; the user should route this to a native speaker or clinician-reviewed source before phrases are added. Did **not** attempt any new translations.

**New test:** `__tests__/CrisisKeywordsParity.test.ts` — imports the real `TRANSLATIONS` export (continuing the "point tests at real src/ code" pattern from the prior test-file fix) and asserts (1) all 4 locales declare the same category keys, and (2) every category has ≥1 phrase in every locale, with an explicit carve-out for the known `ko`/`hi` `overdose` gap so the test documents the gap instead of either hiding it or failing CI on a content decision that isn't mine to make.

**Verification:** `npx tsc --noEmit` — zero new errors (fixed 3 implicit-`any` errors in the new test file from an untyped `test.each` callback; remaining output is the same pre-existing jest-globals-in-test-files and `settings.tsx` `expo-file-system` baseline noise). `npx eslint` on all touched files — same 3 pre-existing unused-import warnings in `journal.tsx` (confirmed via `git diff` these lines weren't touched), zero new warnings. `npx jest` — 4 suites, 23 tests, all pass. Also verified live per [[verify_via_expo_web_playwright]] since this touches an actual safety-critical runtime path, not just types: ran `expo start --web` + a scratch Playwright script that logged into the app, selected a mood, typed "I have been thinking about an overdose lately" (a phrase that only exists in English's `crisisKeywords.overdose` category), saved, and confirmed the crisis modal appeared; then typed a neutral phrase ("Had a pretty good day today, went for a walk") and confirmed the modal did *not* appear. Both passed, confirming the categorized restructure didn't break detection.

**Outcome:** Committed as `cd88236` ("fix: categorize crisisKeywords per locale so parity is compiler-enforced"). Pushed to `origin/main` in a later session's batch push (see the 2026-07-15 "(last)" entry below). User decided to leave the `ko`/`hi` missing-overdose-phrase gap as a tracked issue rather than have phrases drafted — needs a native speaker or clinician, not a guess.

**Still open from the architecture review:** the unrelated `FeedbackModal` embedded in `onboarding-modal.tsx`, and the still-placeholder RevenueCat keys in `src/config/iap.ts`. Also newly surfaced: `ko`/`hi` missing translated `overdose`-category crisis phrases (see above).

---

## 2026-07-15 (last) — Extracted `FeedbackModal` out of `onboarding-modal.tsx`

Asked the user which remaining architecture-review candidate to tackle next; they picked the `FeedbackModal` finding — a fully unrelated "Report an issue" sheet (its own Cloudflare Worker POST, issue-type state machine, styles) had been living inline inside `onboarding-modal.tsx`, the only connection being that the onboarding tour happens to be the current entry point for the "Report an issue" link.

**Fix:** moved the component, its two module constants (`FEEDBACK_WORKER`, `ISSUE_TYPES`), and its `StyleSheet` wholesale into a new `src/components/feedback-modal.tsx`, exported as `FeedbackModal`. `onboarding-modal.tsx` now imports it from `./feedback-modal` instead of declaring it locally — zero behavior change, pure move. Also trimmed `onboarding-modal.tsx`'s `react-native` import line down to what it still uses (`KeyboardAvoidingView`, `Platform`, `TextInput` were only used by the extracted component; `Modal` stayed since `OnboardingModal` itself renders one).

**Verification:** `npx tsc --noEmit` — zero new errors (same pre-existing jest-globals-in-test-files and `settings.tsx` `expo-file-system` baseline). `npx eslint` on both files — same 9 pre-existing problems (6 errors, 3 warnings) as a `git stash`-diffed baseline, confirmed at the same relative lines (`WelcomeVisual`'s `useRef` access, `EmotionsVisual`'s `require()`, `setPage` in an effect) — nothing new. Verified live per [[verify_via_expo_web_playwright]]: ran `expo start --web` + a scratch Playwright script, walked the first-launch language step, tapped "Report an issue" from the onboarding slide, confirmed the sheet still opens with the Bug/Suggestion/Other type selector and description field, typed a test description, and confirmed "Send feedback" becomes enabled — screenshotted mid-flow.

**Net:** `onboarding-modal.tsx` 706 → 562 lines; new `feedback-modal.tsx` is 157 lines, self-contained.

**Outcome:** Committed as `efebdf1` ("refactor: extract FeedbackModal out of onboarding-modal.tsx"). Pushed to `origin/main` (`3ab146f..3bd9e1a`) at explicit user request.

**Still open from the architecture review:** the still-placeholder RevenueCat keys in `src/config/iap.ts` (product decision, not mechanical). Also still tracked: `ko`/`hi` missing translated `overdose`-category crisis phrases.

---

## 2026-07-15 (last, wrap) — Session close: pushed, no further code changes

Pushed `origin/main` from `3ab146f` to `3bd9e1a`, carrying everything committed since the last push: the dead-test-files fix (`9b7f054`), the `LANGUAGES` consolidation (`9a18ee5`, `aa75db3`), the `crisisKeywords` parity fix (`cd88236`, `3ab146f`), and this session's `FeedbackModal` extraction (`efebdf1`, `3bd9e1a`). `origin/main` and local `main` are now in sync. No new code changes this entry — pure push + doc cleanup (backfilled "not yet pushed" notes above that had gone stale once this push landed).

**Architecture-review status: 6 of 7 original findings fixed, committed, and pushed.** Only remaining candidate: RevenueCat placeholder keys in `src/config/iap.ts` (product decision — needs real keys/entitlement IDs from the user, not a mechanical fix). Separately tracked, not part of the original 7: `ko`/`hi` missing translated `overdose`-category crisis phrases (needs a native speaker or clinician-reviewed source).

**Separately, still uncommitted in the working tree** (untouched all session): `.agents/`, `.claude/skills/`, `Feelings.pdf`, `eslint.config.js`, `gradlelog.md`, `skills-lock.json` — predate this session, see prior entries/MEMORY.md.

---

## 2026-07-15 (final) — Guarded IAP unlock/restore against the still-placeholder RevenueCat keys

Picked up the last open architecture-review candidate: the placeholder RevenueCat keys in `src/config/iap.ts`. Asked the user whether they had a real RevenueCat project set up yet — they didn't, so filling in real keys/entitlement IDs wasn't on the table this session. Asked a follow-up on what should happen in the meantime: leave the existing try/catch behavior as-is, or add a guard so a tap on "Unlock" doesn't surface a raw SDK error. User picked the guard.

**Fix:** added `IAP_IS_CONFIGURED` to `src/config/iap.ts` (true once both `REVENUECAT_API_KEY_IOS`/`_ANDROID` no longer contain the literal `'PLACEHOLDER'` string). `settings.tsx`'s `handleUnlock` and `handleRestore` both check it first and return early with a `'Coming soon'` alert, before ever calling `initRC()`/hitting the RevenueCat SDK.

**Verification:** `npx tsc --noEmit` and `npx eslint` — same pre-existing baseline (60 errors, all jest-globals-in-test-files and the `settings.tsx` `expo-file-system` typing mismatch; zero new). Verified live per [[verify_via_expo_web_playwright]], including a negative control: `git stash`ed the fix, ran `expo start --web` + a scratch Playwright script that pre-seeded `localStorage` (`@cic_locale`, `@cic:hasSeenOnboarding`) to skip straight past the first-launch language picker and onboarding tour, then clicked "Unlock for $4.99" — confirmed the console showed the raw RevenueCat error (`"Invalid API key. Use your Web Billing API key."`). Popped the stash, reran the identical script — confirmed zero console output, the button never entered its "Processing…" loading state, and the guard returned before `initRC()` was reached. (Note: `Alert.alert` is a no-op on `react-native-web`, so the "Coming soon" copy itself isn't visually verifiable in this harness — the absence of the SDK error and loading state is the observable proxy that the guard fired.)

**Outcome:** Committed as `1a8d081` ("fix: guard IAP unlock/restore against placeholder RevenueCat keys") and pushed to `origin/main` (`3bd9e1a..1a8d081`) at explicit user request.

**Architecture-review status: all 7 original findings now addressed** (6 fixed outright, this 7th mitigated with a guard pending the user's real RevenueCat credentials). Still separately tracked, not part of the original 7: `ko`/`hi` missing translated `overdose`-category crisis phrases (needs a native speaker or clinician-reviewed source).

---

## 2026-07-15 (post-review cleanup) — Triaged the 6 files that had sat untouched all session

The RevenueCat-guard commit (`1a8d081`) closed out the architecture review, but `.agents/`, `.claude/skills/`, `Feelings.pdf`, `eslint.config.js`, `gradlelog.md`, and `skills-lock.json` had been sitting uncommitted in the working tree since before this session started. User asked for a recommendation on each, then asked to act on it.

**Findings, one by one:**
- `eslint.config.js` — the live Expo flat-config ESLint file; `npm run lint` (`expo lint`) already depends on it and no other ESLint config was tracked in the repo. Genuine project config that had never been committed.
- `gradlelog.md` — a raw pasted Gradle daemon/task log from the earlier Android-build troubleshooting session (see [[local_android_build_setup]]), not curated notes. No lasting value.
- `.agents/skills/` and `.claude/skills/` — near-duplicate installs (~40 skills each, two agent formats) from a Claude Code skill-marketplace tool, keyed by `skills-lock.json` as their lockfile. Confirmed `.claude/settings.json` is separately already tracked in this repo (left alone); the bulk skill content is regenerable tooling, structurally like `node_modules/`, unrelated to the wellness app.
- `Feelings.pdf` (10.7MB) — the emotion-content source-of-truth reference (per [[feelings_journal_source_of_truth]]); its content is already diff-verified into `src/`, so the binary itself doesn't need to ship with the app.

**Fix:** added a new `.gitignore` block for `/.agents/`, `/.claude/skills/`, `skills-lock.json`, and `/Feelings.pdf`; deleted `gradlelog.md` outright (it was untracked, so this only cleaned the working tree, no history to purge); staged and committed `eslint.config.js` for real.

**Outcome:** Committed as `1f87dba` ("chore: add eslint.config.js, gitignore skill-tooling and content reference files") and pushed to `origin/main` (`46ba9e0..1f87dba`) at explicit user request. Working tree is now fully clean — `git status` shows nothing untracked or modified.

**Nothing open from this thread.** Only remaining product-level open item across the whole engagement: real RevenueCat credentials (see above) and the `ko`/`hi` overdose-phrase translation gap (see architecture-review entries above) — both are user/content decisions, not mechanical work.

---

## 2026-07-15 (emotion pills) — Replaced the Plutchik wheel with selectable emotion pills + free text

User wanted to change the emotion-logging UX entirely: instead of the Plutchik wheel, tap one of several common-emotion pills or free-type anything. Mid-conversation they also floated splitting a wheel-comparison/emotional-intelligence teaching app (Feelings Wheel, Panksepp's Affective Wheels, etc.) into a *separate* product, and explicitly decided to keep Clarity in Calm scoped to daily affirmation/nightly gratitude/emotion tracking/journaling — the wheel-education idea was deliberately deferred out of scope, not started.

**Planning:** the 7 requested pills (happiness, sadness, fear, disgust, anger, contempt, surprise) turned out to be Ekman's basic emotions — a different taxonomy from the app's existing 8-primary Plutchik model (`EMOTIONS`/`DYAD_EMOTIONS` in `src/constants/emotions.ts`). Asked the user to choose between keeping both taxonomies (additive) or replacing Plutchik outright; they picked **full replace**. An Explore-agent grep traced the full blast radius before writing the plan: `EMOTIONS_BY_ID` was consumed in three places (`emotions.tsx` past-logs, `index.tsx` today row, `insights.tsx` top-emotion card + a `.primary` subtext line), `DYAD_EMOTIONS`/`ALL_EMOTIONS` were dead exports with zero consumers, and a Settings paywall bullet ("Full Plutchik emotion wheel") turned out to be marketing copy only — nothing in code actually gated the wheel behind the $4.99 unlock.

The plan was briefly handed to Ultraplan (cloud plan refinement) at the user's request; that remote session auto-started implementing without an explicit review step, which surprised the user, but it never touched this local checkout (`git status` confirmed clean) — implementation proceeded from the local plan file only after the user's explicit "I approve the plan, start implementation."

**Implementation:**
- `src/constants/emotions.ts` — deleted `PlutchikEmotion`, `EMOTIONS` (24 entries), `DyadEmotion`, `DYAD_EMOTIONS`, `ALL_EMOTIONS`, `EMOTIONS_BY_RING`, `EMOTIONS_BY_ID`; added `BasicEmotion`/`BASIC_EMOTIONS` (7 entries, reusing the old Plutchik hex colors where they overlap) / `BASIC_EMOTIONS_BY_ID`.
- New `src/components/emotions/EmotionPillSelector.tsx` (replaces deleted `PlutchikWheel.tsx`) — 7 colored pills in a wrapping row (`ContextTagSelector`'s chip pattern, but wrapping not horizontal-scroll since this is the primary control) plus a dashed "+Other" pill that swaps in an inline `TextInput`; a local `slugify()` turns free text into an id (neutral `colors.textSecondary` color, no canonical color for custom entries).
- `src/app/emotions.tsx`, `src/app/index.tsx` — swapped to the new component/data; `primaryEmotion` on save is now just `selectedEmotion.id` (no more separate ring/primary split).
- `src/app/insights.tsx` — `topEmotion` reworked to tally straight from `emotionLogs` (label/color carried on the log itself) instead of requiring a dataset match, so a free-typed emotion can still win "Most felt"; dropped the now-nonexistent `.primary` subtext/style.
- `src/i18n/translations.ts` — reworded wheel-referencing copy (`selectEmotion`, `emptyBody`) and the paywall bullet, added `otherPill`/`customPlaceholder` keys, across all 4 locales (en authored directly; ko/es/hi are Claude's best-effort translations, **not** native-speaker reviewed — same caution as the tracked `ko`/`hi` crisis-keyword gap in the architecture-review entries above).

**Verification:** `npx tsc --noEmit` and `npx eslint` — zero new errors/warnings (confirmed via targeted grep against the pre-existing baseline: jest-globals-in-test-files, `settings.tsx`'s `expo-file-system` typing mismatch). Full live walkthrough per [[verify_via_expo_web_playwright]]: selected a basic pill (Happiness), free-typed a custom emotion ("Bittersweet"), saved both, and confirmed correct colors/labels on `/emotions` (past logs), `/` (today row), `/insights` ("Most felt" correctly resolved the free-typed entry — the one behavior that actually changes, not just a color swap), and `/settings` (paywall bullet no longer mentions "wheel"). Also drove all 3 non-English locales (ko/es/hi) through `/emotions` — copy renders correctly, no missing-key errors, pills still wrap cleanly on a 420px viewport.

**Outcome:** Committed as `55d4675` ("feat: replace Plutchik emotion wheel with selectable pills + free text") and pushed to `origin/main` (`85cdf18..55d4675`) at explicit user request.

**Still open:** the ko/es/hi translations for this feature's new/changed copy should get a native-speaker spot-check before relying on them (never reviewed, just best-effort). The separate wheel-comparison/emotional-intelligence teaching app idea remains explicitly out of scope for this repo — nothing started, no plan drafted.

---

## 2026-07-15 (post-emotion-pills device pass) — Local device build/run, then three leftover-wheel bugs found and fixed

Same-day follow-up session. First set up local device testing (not previously done for the emotion-pills feature — that work had only been verified via Expo web/Playwright), then the user spotted three UI regressions from the emotion-pills migration by eyeballing the app on their actual phone, plus one unrelated pre-existing bug.

**Device setup:** paired the user's Moto G (2025) over ADB wireless debugging fresh (`adb pair`/`adb connect`, see [[adb_wireless_debugging_gotchas]]), built `assembleDebug -PreactNativeArchitectures=arm64-v8a` (~2min clean, ~20-25s incremental — see [[local_android_build_setup]]), installed via `adb install -r`, and reused an already-running `expo start --dev-client` Metro instance (10+ hours uptime from an earlier session) rather than starting a duplicate — confirmed port 8081 was already bound to the same project's Metro before treating the "port in use" failure as a real problem.

**Bugs found from phone screenshots (uploaded to a new, gitignored `screenshots/` folder in the repo root):**

1. **Onboarding slide 4/7 still showed the deleted Plutchik wheel** — a hand-built 24-segment SVG color wheel (`WHEEL_SEGMENTS`/`EmotionsVisual` in `src/components/onboarding-modal.tsx`) plus copy reading "Log from 32 emotions on the Plutchik wheel" in all 4 locales (`src/i18n/translations.ts`). The emotion-pills migration only touched the live emotion-logging screens, never the onboarding tour. Fixed by replacing the SVG wheel with a mini preview of the real 7 `BASIC_EMOTIONS` pills (same colors/labels as the actual selector) and rewriting the copy to "Tap one of 7 core emotions, or type your own" across en/ko/es/hi. Also caught a stray 🎡 emoji on the Today slide's mockup pill (unrelated small leftover in the same file) and swapped it to 🎭.

2. **Onboarding layout had a large, unintended gap** between the icon and the title/body text, with the footer pinned hard to the bottom edge — visible on every slide, not just the wheel one. Root cause (confirmed via Explore-agent trace before touching code): the modal had **zero safe-area handling** — hardcoded `paddingTop: 52`/`paddingBottom: 40` guesses instead of `useSafeAreaInsets()` (the pattern already used in every other screen in this app), and the icon block (fixed height, anchored near the top) and the title/body block (a *separate* `flex: 1` region that centered itself independently in whatever space was left) were laid out as two independent pieces rather than one visual group. Fixed by wiring in `useSafeAreaInsets()` for both the root padding and the close button's `top` offset, and by wrapping the icon and text in one shared `contentCenter` (`flex: 1, justifyContent: 'center'`) container so they're centered together as a single block.

3. **Dead Plutchik-id map, unrelated to the "Emotion Library" button the user asked about.** User initially flagged a home-screen "emotion library" button as showing "the old emotions list" — traced (Explore agent) to the **"Feelings Library"** card (📖, `src/app/index.tsx` → `/feelings-library`), which turned out to be a *separate, working, intentional* feature built in an earlier unrelated session (a coping-guide with 8 categories: anger/anxiousness/burnout/fear/sadness/insecurity/loneliness/overwhelm) — not leftover Plutchik data, and left untouched after the user confirmed that's what they meant. The real leftover found nearby: `PLUTCHIK_TO_FEELINGS_CATEGORY` in `src/app/index.tsx`, a lookup map still keyed on old Plutchik ids (`rage`, `terror`, `grief`, `annoyance`, `apprehension`, `pensiveness`) that can never match since emotion logs only ever contain the 7 new Ekman ids now — 6 of its 9 entries were permanently dead code. Renamed to `EMOTION_TO_FEELINGS_CATEGORY` and trimmed to the 3 ids that still apply (`anger`/`fear`/`sadness`).

4. **Pre-existing, unrelated bug, found on a second screenshot pass after the above fixes were installed:** onboarding slide 3 ("Journal Your Way") renders as just **"Journal Your"** — the last word is silently dropped, no ellipsis, on-device only. Confirmed via screenshot comparison that this predates all of today's changes (visible in the very first screenshot batch, before any edits) and isn't width/wrapping-related (a longer title, "Discover Your Patterns", renders fully fine one slide later). Best-effort fix applied: added `collapsable={false}` to the text `Animated2.View` — the standard fix for the known React Native/Android class of bug where Android's view-flattening optimization clips text that's mid-layout during a Reanimated `entering` animation. **This fix is UNVERIFIED on-device** — applied based on diagnosis reasoning, not confirmed against a fresh screenshot. Needs an actual device check next session before considering it closed.

**Verification:** `npx tsc --noEmit` and `npx eslint` on all touched files — confirmed zero new errors beyond the pre-existing baseline (test-file jest-globals, `settings.tsx` expo-file-system typing) for both the first three fixes and the slide-3 fix; error/warning counts went down slightly (removed a `require()`-style-import warning that came with the deleted wheel code). Live device verification via fresh screenshots confirmed fixes 1–3 render correctly (pill preview, tighter centered layout, Feelings Library untouched and working). Fix 4 (`collapsable={false}`) was applied after the last screenshot batch and has not yet been re-verified on-device.

**Outcome:** All four fixes are made locally in `src/app/index.tsx`, `src/components/onboarding-modal.tsx`, and `src/i18n/translations.ts` — **not yet committed** (user has not asked to commit this thread's work). `screenshots/` is untracked and not part of any commit.

**Still open:**
- Verify the slide-3 "Journal Your Way" truncation fix (`collapsable={false}`) actually resolves the dropped word on-device — reload the app via Metro and re-screenshot slide 3.
- The three device-screenshot-verified fixes plus the unverified fourth one are all sitting uncommitted — commit once the user confirms fix 4 and is ready.
- Same standing ko/es/hi native-speaker review gap as before, now also covering this session's new onboarding-slide copy.

---

## 2026-07-15 (slide-3 fix, take two) — `collapsable={false}` didn't work; found and fixed the real cause

Same-day follow-up. Reconnected to the already-running Metro instance and the previously-paired Moto G (fresh `adb connect`, same device, address unchanged this time), force-stopped and relaunched the app to pick up a clean JS bundle, then reopened onboarding via the home screen's "?" button and navigated to slide 3. **The `collapsable={false}` fix from last session's entry did not work** — "Journal Your Way" still rendered as "Journal Your", word silently dropped.

**Diagnosis (bisection via live edits + Fast Refresh, screenshotting after each change):** Pulled the accessibility tree with `adb shell uiautomator dump` and confirmed the underlying TextView's `text` attribute was the full, correct `"Journal Your Way"` — ruling out any string/i18n bug. Bounds from the same dump (`[180,758][539,812]`, 359×54px) showed the view's actual *laid-out* box was sized for "Journal Your" only, not clipped-after-layout. Tested three hypotheses in sequence, reloading between each: (1) removed the `Animated2.View`/`FadeIn` entering animation entirely, replacing it with a plain `View` — bug persisted, ruling out Reanimated's Android layout-animation clipping as the cause; (2) removed `letterSpacing: -0.5` from the title style — bug persisted, ruling out kerning; (3) gave the title Text a temporary `backgroundColor: 'yellow'` to make its real bounding box visible in a screenshot — confirmed the box itself only wrapped "Journal Your", not a parent-clip artifact; (4) added a temporary explicit `width: 400` on top of the yellow highlight — **"Journal Your Way" rendered in full**, box now visibly sized correctly.

**Root cause:** the title `Text` has no explicit width and sits in a flex column (`s.slide`) with `alignItems: 'center'`, so its box shrink-wraps to Yoga's own intrinsic-width measurement of the string. For this specific string at `fontWeight: '800'`, Yoga's Android text measurement under-measured the true rendered width, so the view laid out one pixel-line narrower than the text actually needs — Android then paints only what fits inside that too-narrow box, with no wrap and no ellipsis (a known class of RN-Android bug: auto-width bold text in a centered flex container can silently under-measure and clip rather than wrap). It didn't reproduce on other slide titles by luck of string/font-metric timing, not because they're structurally different.

**Fix:** reverted all the diagnostic scaffolding (yellow background, fixed width, animation removal, letterSpacing removal) back to the original code, then added a single real change: `alignSelf: 'stretch'` on `s.title` in `src/components/onboarding-modal.tsx`. This makes the title take the parent's full available width (rather than shrink-wrap), so text wrapping is computed against a real width constraint up front instead of relying on the buggy intrinsic-width estimate. `collapsable={false}` was removed again since it turned out to be unrelated to the actual bug.

**Verification:** Live device walkthrough of all 7 onboarding slides after the fix — slide 3 ("Journal Your Way") now renders in full; spot-checked slides 1, 4 ("Name What You Feel"), 5 ("Discover Your Patterns"), and 7 (privacy checklist) to confirm the shared style change didn't regress any other title. `npx tsc --noEmit` and `npx eslint src/components/onboarding-modal.tsx` — same pre-existing baseline only (3 known issues: `WelcomeVisual`'s `useRef` access, `setPage` in an effect, one `exhaustive-deps` warning), zero new.

**Outcome:** All four fixes committed as `673784a` ("fix: repair three leftover-wheel onboarding bugs and a text-clipping bug"), doc-logged as `a2d6a73`, and pushed to `origin/main` (`606153c..a2d6a73`) at explicit user request. Working tree is clean (only untracked, gitignored `screenshots/` remains).

**Still open:**
- Same standing ko/es/hi native-speaker review gap as before (crisis phrases + this session's onboarding copy) — needs a native speaker or clinician-reviewed source, not mechanical work.
- Still-placeholder RevenueCat keys in `src/config/iap.ts`, already guarded (see prior architecture-review entries) — needs the user's real RevenueCat credentials whenever that product decision happens.

---

## 2026-07-16/17 — RevenueCat project setup begun (Android-only); Play Store release signing wired up locally

User picked up the standing "real RevenueCat credentials" open item. Walked them live through RevenueCat's dashboard onboarding: project creation, SDK/framework picker (React Native — matches the already-installed `react-native-purchases` dependency), and platform choice. Confirmed with the user via AskUserQuestion that scope is **Android-only for now** — all prior build/test work has been Android/Chromebook-only, no Apple Developer account or iOS build in the picture; the Apple App Store app card can be added to the same RevenueCat project later with no rework.

**Entitlement:** created with identifier `clarity_unlock` (matches `ENTITLEMENT_ID` in `src/config/iap.ts:22`). Caught a real user mistake first: RevenueCat's entitlement form has an Identifier field and a separate Display Name field, and the user had them backwards (`Clarity Unlock` in Identifier, `clarity_unlock` in Display Name) on their first attempt. RevenueCat locks the Identifier field after creation (only Display Name stays editable), so the fix was deleting that first entitlement and recreating it with the fields correct — confirmed done successfully.

**Product setup hit a real blocker:** Google Play Console refused to let the user create an in-app product, citing a missing `BILLING` permission. Investigated and confirmed this is a red herring about the manifest — `react-native-purchases` already declares `com.android.vending.BILLING` in its own AndroidManifest.xml and it was already auto-merging into the locally-built debug manifest (`android/app/build/intermediates/merged_manifest/debug/.../AndroidManifest.xml`). The real cause: Play Console won't unlock in-app product creation until a signed **release** build (`.aab`, not `.apk`) has been uploaded to at least one track, and the project's `android/app/build.gradle` had `release` signing pointed at the `debug` keystore (Expo's default stub) — Play Console will reject a debug-signed upload.

Initially proposed generating a brand-new local release keystore, but the user pointed out the project already has an EAS project registered (`app.config.js`'s `extra.eas.projectId`) and `eas.json` already has a `production` profile building `app-bundle` plus an `eas submit` config — so checked EAS's cloud-managed credentials first instead of minting a duplicate keystore. `eas credentials -p android` (run by the user interactively, not scriptable) confirmed a release keystore already exists in EAS, auto-generated ~29 days prior when the EAS project was first registered (alias `0c2eaf466dc2b8af80653d0f3b8717f1`). Downloaded it locally via the same command's "Download credentials from EAS" option, which wrote `credentials.json` (keystore passwords in plaintext) and `credentials/android/keystore.jks` to the repo root — both untracked but **not yet gitignored** at that point; added `credentials.json` and `/credentials/` to `.gitignore` immediately (the `.jks` itself was already covered by the pre-existing `*.jks` rule). Committed as `7a22581`, not yet pushed at end of session.

**User clarified they build locally with `gradlew`, not `eas build`** — despite the EAS project/credentials existing, actual builds have always been local (see [[local_android_build_setup]]). Rewired the local build instead of using EAS's cloud build: copied `credentials/android/keystore.jks` → `android/app/release.keystore.jks`, added `MYAPP_RELEASE_STORE_FILE`/`MYAPP_RELEASE_KEY_ALIAS`/`MYAPP_RELEASE_STORE_PASSWORD`/`MYAPP_RELEASE_KEY_PASSWORD` to `android/gradle.properties`, added a `release` block to `signingConfigs` in `android/app/build.gradle` referencing those properties, and repointed `buildTypes.release.signingConfig` from `signingConfigs.debug` to `signingConfigs.release`. All of this lives inside the gitignored `/android` tree (regenerated by `expo prebuild`), so nothing here touches git — but it means the wiring is lost on the next `expo prebuild --clean` and must be redone from this entry (or [[local_android_build_setup]]) if that happens.

Attempted to run `cd android && ./gradlew bundleRelease` to produce the signed `.aab` needed to unblock Play Console; **blocked by the auto-mode permission classifier**, not a build failure — the command was never attempted by the user in this session either.

**Verification:** none of the gradle/credentials wiring has been build-verified yet — `./gradlew bundleRelease` has not successfully run. `git status`/`git check-ignore` confirmed `credentials.json` and `credentials/android/keystore.jks` are properly ignored after the `.gitignore` fix.

**Outcome:** Two commits made and to be logged: `30466a0` (screenshots/ gitignore, pushed) and `7a22581` (credentials.json/credentials/ gitignore, **not yet pushed** as of this entry). The `android/` signing wire-up is uncommitted by nature (gitignored directory) and won't show in `git status`.

**Still open (this thread):**
1. ~~Run `cd android && ./gradlew bundleRelease`~~ — done. Play Console already had an existing upload at `versionCode 3` (`1.0.0`) from earlier app setup that wasn't in this doc's record; bumped `versionCode` to `4` in both `app.config.js` (`android.versionCode`) and directly in `android/app/build.gradle` (prebuild wasn't re-run, to avoid losing the manual signing wiring — see above) before the successful build. Confirmed `reactNativeArchitectures` in `android/gradle.properties` already covers all four ABIs (`armeabi-v7a`, `arm64-v8a`, `x86`, `x86_64`) — nothing restricted there. Produced `android/app/build/outputs/bundle/release/app-release.aab` (75MB).
2. ~~Upload that `.aab` to Play Console~~ — done, uploaded to Testing → Internal testing with release notes "Internal test build — signing/IAP setup verification." This unblocked the in-app product creation screen as expected.
3. Finish creating the Google Play in-app product with ID `clarity_unlock_499` (must match `PRODUCT_ID` in `src/config/iap.ts:25` exactly and is permanent once saved), price $4.99, status Active.
4. Register that product in RevenueCat's dashboard (Products → + New → Google Play → identifier `clarity_unlock_499`) and attach it to the `clarity_unlock` entitlement.
5. Get RevenueCat's public Android SDK key (`goog_...`) from the dashboard and drop it into `IAP_CONFIG.REVENUECAT_API_KEY_ANDROID` in `src/config/iap.ts:19`, replacing the placeholder — this is the step that flips `IAP_IS_CONFIGURED` to `true` and lifts the "Coming soon" guard in `settings.tsx`.
6. Push commit `7a22581` when the user's ready.
7. Same standing ko/es/hi native-speaker review gap as always.

**Note for next `expo prebuild --clean`:** the regenerated `android/` tree will reset `versionCode` back to whatever `app.config.js`'s `android.versionCode` says (now `4`, updated above) and will also need the release signing block re-wired per the earlier entry — both must be redone together, not just one.

---

## 2026-07-17 (later) — Audited the paywall: found it enforces nothing; trimmed `unlockFeatures` copy to match reality

User asked whether all the "full version" features were actually mapped out and wired. Grepped the whole `src/` tree for `isUnlocked`, `settings.iap`, `ENTITLEMENT_ID`, `IAP_IS_CONFIGURED`, `IAP_CONFIG`, and `Purchases.` — every hit besides `src/config/iap.ts` itself was inside `src/app/settings.tsx`'s own buy/restore flow. **No other screen in the app checks entitlement state at all**, so purchasing "Clarity Unlock" only flips the Settings screen's own paywall card to a checkmark — it doesn't gate or unlock anything else in the app.

Dispatched an Explore agent to check each of the 6 perks advertised in `unlockFeatures` (`src/i18n/translations.ts`) against the actual code:

| Perk as advertised | Exists in code? | Gated by purchase? |
|---|---|---|
| Unlimited emotion categories | Yes — 7 fixed pills + unlimited free-text, `EmotionPillSelector.tsx` | No — no cap ever existed, free or paid |
| Unlimited history & analytics | Yes — `insights.tsx` always shows full history | No |
| PDF reports & data export | **No** — only JSON export exists (`settings.tsx` `handleExport`, `Sharing.shareAsync(..., { mimeType: 'application/json' })`) | N/A; JSON export itself is also ungated |
| Future Self Letters | Yes — `journal.tsx`, locked by a user-chosen date | No — the "lock" is date-based, not purchase-based |
| Advanced pattern insights | Only one insights tier exists at all — no "advanced" version to distinguish from | No |
| Custom journal templates | Only 6 fixed built-in templates (`JOURNAL_TEMPLATES` in `constants/emotions.ts`) — no true user-created template UI | No, and "custom" overstates it |

**Fix (this entry): copy only, no gating logic added yet.** Asked the user how to handle the two overstated-but-real perks (Advanced pattern insights, Custom journal templates) via AskUserQuestion; they picked renaming over cutting. Edited `unlockFeatures` across all 4 locales in `src/i18n/translations.ts`:
- Removed the "PDF reports & data export" / "PDF 보고서 내보내기" / "Exportar reportes en PDF" / "PDF रिपोर्ट" line entirely (feature doesn't exist).
- Renamed "Advanced pattern insights" → "Pattern insights" (and ko/es/hi equivalents), "Custom journal templates" → "Guided journal templates" (and ko/es/hi equivalents) — same feature, accurate wording.
- List is now 5 items per locale instead of 6.

**Verification:** `npx tsc --noEmit` — zero new errors; the only non-test-file errors are the pre-existing `settings.tsx` `expo-file-system` `cacheDirectory`/`documentDirectory` typing mismatch (unrelated, untouched this session). Not yet git-committed.

**New item surfaced, not yet acted on:** `insightsScreen.exportBtn` (all 4 locales) separately advertises "Export as PDF" / "PDF로 내보내기" on the Insights screen — same non-existent-PDF issue as the paywall copy, just a different string outside `unlockFeatures`. Flagged to the user; not yet fixed.

**Still open:**
1. The `insightsScreen.exportBtn` "Export as PDF" copy (see above) — same fix pattern (rename to match the real JSON export, or actually build PDF export).
2. Decide whether to implement real gating behind `isUnlocked` for any of the remaining perks (emotion categories/history/future-self-letters/pattern-insights/guided-templates) — right now none of them are restricted for non-payers, so the $4.99 unlock currently buys nothing functional. This was raised to the user as a next step but not yet decided.
3. Commit this session's `translations.ts` copy trim (currently uncommitted, alongside the still-pending items 3-7 from the RevenueCat thread above: finish the Play Console in-app product, register it in RevenueCat, drop in the real Android SDK key, push commit `7a22581`).
4. Same standing ko/es/hi native-speaker review gap as always (now also covering this session's renamed strings, which are Claude's best-effort translations, not native-reviewed).

---

## 2026-07-17 (continuation) — Committed paywall-copy fixes, pushed; fixed exportBtn PDF copy; found exposed GCP keys

Picked up the prior session's uncommitted `translations.ts` copy trim plus the already-present `app.config.js`/`iap.ts` changes. First checked whether commit `7a22581` (credentials.json/.gitignore fix) genuinely still needed pushing — `git status` showed `main` already up to date with `origin/main`, so that "not yet pushed" note in the prior entry was stale; no action needed there.

**Commit 1 (`58c9e02`):** staged and committed only the 4 intentionally-modified files (`CASE_STUDY.md`, `app.config.js`, `src/config/iap.ts`, `src/i18n/translations.ts`) — the `unlockFeatures` copy trim, the `versionCode` 3→4 bump, and the Android-only `IAP_IS_CONFIGURED` change, all already sitting in the working tree from the prior session. Pushed to `origin/main`.

**Security finding (not fixed, flagged only):** before staging, checked the untracked files in `git status` and found `assets/clarity.json` and `assets/skillful-signer-502715-m5-02550709b69d.json` are two **live GCP service-account private keys** (project `skillful-signer-502715-m5`, two different key IDs) sitting in the repo, untracked *and not covered by any `.gitignore` rule* — unlike `google-service-account.json`, which already has a dedicated ignore entry. A future `git add -A`/`git add .` would stage real secrets. Left both files untouched (didn't delete, didn't gitignore) since their purpose/origin is unknown — flagged to the user, saved as memory ([[exposed_gcp_keys_in_assets]]) so future sessions don't `git add -A` in this repo without checking `assets/` first.

**Commit 2 (`fe0daf3`):** fixed the `insightsScreen.exportBtn` "Export as PDF" copy across all 4 locales (en/ko/es/hi) → "Export as JSON", same rename-to-match-reality pattern as the `unlockFeatures` fix. While tracing consumers, discovered `insightsScreen.exportBtn`/`exportTitle`/`exportSuccess` have **zero consumers anywhere in `src/app` or `src/components`** — these are dead i18n keys, not currently rendered on the Insights screen at all. The real, live export button is `settingsScreen.exportData` ("Export all data (JSON)") in `settings.tsx:462-463`, which was already accurate. Renamed the dead keys rather than deleting them, in case they're wired up later. `npx tsc --noEmit` confirmed clean (same pre-existing baseline: test-file jest-globals, `settings.tsx` expo-file-system typing). Committed and pushed.

**Outcome:** Working tree now has only the 3 untracked non-repo files (`assets/Untitled design.png`, `assets/clarity.json`, `assets/skillful-signer-502715-m5-02550709b69d.json`) — no modified/staged files. `origin/main` is at `fe0daf3`.

**Still open (paywall thread): only the gating-vs-tip-jar product decision remains** — implement real feature gating behind `isUnlocked` for the 5 remaining perks, or leave the $4.99 unlock as a no-op "support the app" purchase. Not yet decided.

**Still open (other threads, unchanged):**
- Finish the RevenueCat rollout: create the Google Play in-app product (`clarity_unlock_499`, $4.99, Active), register it in RevenueCat attached to entitlement `clarity_unlock`, and drop the real Android SDK key into `IAP_CONFIG.REVENUECAT_API_KEY_ANDROID` in `src/config/iap.ts:19` (flips `IAP_IS_CONFIGURED` to `true`). See [[revenuecat_setup_2026_07_17]].
- ko/hi crisis-keyword `overdose` category is empty — needs a native speaker/clinician, not a guess.
- The exposed GCP service-account keys in `assets/` (see above) — decide whether to delete, gitignore, or relocate them; not acted on this session.

---

## 2026-07-18 — Chartered a `/wayfinder` map for Play Store production readiness (no code changes)

**Note on the RevenueCat thread above:** superseded same-day by commit `4a26e68` ("Remove IAP paywall + production-readiness fixes") — the app is going fully free (a separate sleep app will carry the paid unlock instead), so the RevenueCat rollout and the gating-vs-tip-jar decision are both moot. That commit also dropped the unused `android.permission.CAMERA`/photo permissions and fixed the in-app Privacy Policy link, which pointed at a 404'd URL.

A separate `/wayfinder` session (run from the sibling `~/projects/new` working directory, chatting through the user's original loose idea before either of us realized `clarity-in-calm` already existed) initially spent a long stretch grilling toward a from-scratch native-Android spec. That framing was wrong on two counts — this is Expo/React Native, not native Kotlin (Gradle only exists as Expo's generated `android/` wrapper), and almost everything discussed (4-language i18n, crisis keywords, mood tracking, breathing exercise, fully-free/no-IAP) was already built here. Caught by actually reading the repo (`README.md`, `git log`, this file) instead of continuing to grill on assumptions — worth remembering for next time a session starts from the wrong directory.

**Rescoped destination:** close the gap between the existing app and actual Google Play production submission (an app listing already exists in Play Console; IAP was just removed).

**Chartered as GitHub Issues** (this repo has a real remote + authenticated `gh`, so used native issues rather than local-markdown): created `wayfinder:*` labels, then the map plus 6 child tickets, wired via the sub-issues API and native issue `blocked_by` dependencies.

- Map: [#4](https://github.com/kwanghyunyoon/clarity-in-calm/issues/4)
- [#5](https://github.com/kwanghyunyoon/clarity-in-calm/issues/5) YouTube channel link — placement/design (open)
- [#6](https://github.com/kwanghyunyoon/clarity-in-calm/issues/6) ko/hi crisis-keyword `overdose` translation gap (open) — a research subagent already posted sourced candidate phrases as a comment ([Korean/Hindi proposals with citations](https://github.com/kwanghyunyoon/clarity-in-calm/issues/6#issuecomment-5014470760)); MSD Manual-sourced for both languages, but no India-specific crisis-org (iCall/Vandrevala/NIMHANS) Hindi source could be found despite trying — flagged for extra human scrutiny before merging into `translations.ts`
- [#7](https://github.com/kwanghyunyoon/clarity-in-calm/issues/7) Spanish crisis lines currently hardcode Mexico only (Línea de la Vida, SAPTEL) + findahelpline.com fallback — open question whether that's the right permanent scope for a broader Latin-America audience
- [#8](https://github.com/kwanghyunyoon/clarity-in-calm/issues/8) Play Console current-state audit (task — needs the user to check Play Console directly; agent has no access)
- [#9](https://github.com/kwanghyunyoon/clarity-in-calm/issues/9) Data Safety form answers — blocked by #8
- [#10](https://github.com/kwanghyunyoon/clarity-in-calm/issues/10) Content rating (IARC) questionnaire answers — blocked by #8

Explicitly out of scope (recorded on the map): therapist/telehealth, ads/IAP, embedded/bundled YouTube video (static link only), ML-based crisis detection, and any data-migration scenario (no prior distinct app to migrate from).

No app code touched this session. Next session: run `/wayfinder` against issue #4 to resolve the next frontier ticket, or answer #8 directly in Play Console to unblock #9/#10.
