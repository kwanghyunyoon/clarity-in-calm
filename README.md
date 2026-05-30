# Clarity in Calm

A wellness app built with React Native and Expo. Journal your thoughts with end-to-end encryption, practice guided breathing, and track your emotional progress over time.

**Live PWA:** https://clarityincalmjournalv1.netlify.app
**Privacy Policy:** https://clarityincalmjournalv1.netlify.app/privacy

---

## Features

- **Encrypted journal** — entries are encrypted with AES-256-GCM before being stored; v1 entries (CTR) auto-migrate on read
- **Screen blur (Privacy Shield)** — app content blurs automatically when backgrounded via AppState listener
- **Guided breathing** — animated breathing circle with timed inhale/exhale prompts
- **Mood tracking** — interactive mood row; streaks and progress stats persist across sessions
- **Onboarding** — 4-slide flow (Welcome → Breathe → Journal → Progress) with per-slide animated visuals and a "Report an issue" link on every slide
- **In-app feedback** — bottom-sheet form (type + description) posted to a Cloudflare Worker proxy, forwarded to Discord
- **Language persistence** — selected language saved to AsyncStorage and restored on restart
- **Internationalization** — English, Korean, Spanish, Hindi

## Tech Stack

| Layer | Library |
|---|---|
| Framework | Expo 56 (React Native, TypeScript) |
| Routing | Expo Router (file-based) |
| Animations | react-native-reanimated |
| Encryption | AES-256-GCM via `crypto.subtle` (native) / Web Crypto API + IndexedDB (web) |
| Secure storage | expo-secure-store |
| Persistent storage | AsyncStorage |
| Feedback proxy | Cloudflare Worker (https://app-feedback.yoonk478.workers.dev) |

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
  app/                  # Expo Router screens (journal.tsx, progress.tsx, …)
  components/           # UI components (onboarding-modal.tsx, PrivacyShield, ErrorBoundary, …)
  context/              # wellness-context.tsx, language-context.tsx
  i18n/
    translations.ts     # All translations (en / ko / es / hi)
  lib/
    secure-storage.ts       # Native AES-256-GCM encryption
    secure-storage.web.ts   # Web Crypto API fallback
assets/                 # Icons, splash, fonts
public/
  privacy.html          # Privacy policy
```

## Contact

clarityincalm@icloud.com
