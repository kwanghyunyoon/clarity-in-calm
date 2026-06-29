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
