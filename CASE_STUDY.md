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
