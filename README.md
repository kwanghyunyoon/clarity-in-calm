# Clarity in Calm

A wellness app built with React Native and Expo. Journal your thoughts with on-device encryption, name what you feel, practice guided breathing and grounding exercises, and track your emotional patterns over time — all stored privately on the device.

**Privacy Policy:** https://kwanghyunyoon.github.io/clarity-in-calm-privacy/

---

## Features

- **Encrypted journal** — entries are encrypted with AES-256-GCM before being stored; v1 entries (CTR) auto-migrate to GCM on read; 6 templates (free write, gratitude, reflection, reframe, future self, and more), with tags and search over past entries
- **Emotions** — tap one of 7 core (Ekman) emotions or type your own, with intensity and context tags
- **Feelings Library** — reference content for understanding and naming emotions
- **Guided breathing** — animated breathing circle with timed inhale/exhale prompts
- **Grounding exercises** — guided grounding flow for moments of anxiety or overwhelm
- **Insights** — mood trends, top emotions, and streaks surfaced from your logged entries
- **Screen blur (Privacy Shield)** — app content blurs automatically when backgrounded via AppState listener
- **Onboarding** — 7-slide tour (Welcome, Dashboard, Journal, Emotions, Insights, Settings, Privacy) with per-slide animated visuals, a language step, and a "Report an issue" link on every slide
- **Floating language pill** — quick language switcher available from any tab; selection persists to AsyncStorage
- **In-app feedback** — bottom-sheet form (type + description) posted to a Cloudflare Worker proxy, forwarded to Discord
- **Internationalization** — English, Korean, Spanish, Hindi
- **Accounts (built, disabled)** — Supabase email + Google OAuth sign-in exists in code but is gated off behind `AUTH_ENABLED` (see `src/lib/auth-flag.ts`) for the initial device-local release

## Tech Stack

| Layer | Library |
|---|---|
| Framework | Expo (React Native, TypeScript) — see `AGENTS.md` for the exact SDK version and versioned docs link |
| Routing | Expo Router (file-based) |
| State | Zustand + React Context (`wellness`, `emotion`, `language`, `settings`, `help`) |
| Animations | react-native-reanimated |
| Encryption | AES-256-GCM via `expo-crypto` (native, Keychain/Keystore-backed key) / Web Crypto API + IndexedDB (web) — Hermes has no `crypto.subtle` |
| Secure storage | expo-secure-store |
| Persistent storage | AsyncStorage |
| Accounts (disabled) | Supabase (email + Google OAuth) |
| Feedback proxy | Cloudflare Worker (https://app-feedback.kwangyoon.workers.dev) |

## Getting Started

```bash
npm install
npx expo start
```

Open in:
- iOS Simulator
- Android Emulator
- Expo Go (scan QR code)
- Browser (PWA via `npx expo start --web`)

## Project Structure

```
src/
  app/
    (tabs)/             # Today, journal, emotions, insights, settings (visible)
                         # breathe, ground, feelings-library (hidden, still navigable)
    (auth)/             # sign-in, sign-up, forgot-password — built, gated behind AUTH_ENABLED
  components/           # onboarding-modal.tsx, language-pill.tsx, feedback-modal.tsx, error-boundary.tsx, …
  context/              # wellness, emotion, language, settings, help
  i18n/
    translations.ts     # All translations (en / ko / es / hi)
  lib/
    secure-storage.ts       # Native AES-256-GCM encryption (expo-crypto)
    secure-storage.web.ts   # Web Crypto API + IndexedDB fallback
    auth-flag.ts             # AUTH_ENABLED switch for the Supabase accounts feature
    supabase.ts, oauth.ts     # Supabase client + Google OAuth (built, disabled)
assets/                 # Icons, splash, fonts
public/
  privacy.html          # Privacy policy
```

## Contact

clarityincalm@icloud.com
