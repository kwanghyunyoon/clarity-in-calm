# Clarity in Calm — Production Readiness Spec

Written 2026-07-25. This is a plain-language handoff document. It exists because the
Claude subscription that has been driving development is ending, and you need a
complete, self-contained picture of exactly where the app stands and exactly what's
left before you'd call it "done" and safe to keep shipping.

Everything below is written so you (or any future assistant, human or AI) can pick this
up cold, with no memory of past sessions, and know what to do next.

---

## 1. What this app is, in one paragraph

Clarity in Calm is a mindfulness app (breathing exercises, a grounding exercise, a
feelings journal, mood/emotion tracking, and insights) built with Expo/React Native. It
already has a working Android release in the Play Store, real user accounts (email +
Google login via Supabase), and no in-app purchases — the app is fully free. It's part
of a family of three related apps (the other two are "Dreami" and "ClarityAI", in
separate repos) that are being given a shared visual look, but each app has its own
separate backend and user accounts — they don't share logins or data.

---

## 2. What's already done and working (you don't need to redo this)

- **Accounts/login**: Email sign-up and Google sign-in both work end-to-end, backed by
  Supabase (a hosted database + auth service). Apple sign-in code exists but was never
  finished/tested because there's no paid Apple Developer account to test it with.
- **Core features**: Breathing exercise ("Box Breathing"), Grounding exercise
  ("5-4-3-2-1"), a Feelings Journal (with emotion picker, tags, body-map, templates),
  Insights/streak tracking, multi-language support (the language picker "pill" in the
  corner), and a Settings screen.
- **No subscriptions/payments**: A previous version had in-app purchases via
  RevenueCat. That was fully ripped out — the app is 100% free with no paywalls
  anywhere. Don't re-add this unless you specifically decide to monetize again.
- **Visual identity overhaul (mostly done)**: The three sibling apps were found to have
  inconsistent icons (a mix of emoji, real icons, and logos all in the same screens).
  A plan was made to standardize on one real icon set ("Ionicons") everywhere and drop
  emoji-as-UI. Of the 7 planned pieces of this work:
  - ✅ Done: the reusable "Card" and "IconChip" building blocks, the Today screen's tool
    cards, the streak card, and the bottom tab bar icons.
  - ❌ Not done yet: see Section 3 below — 4 pieces remain.
- **UI polish**: The Breathing screen, Grounding screen, and bottom tab bar (now a
  floating rounded "pill" bar, matching the language picker's look) have all been fixed
  for spacing/overlap issues that were reported. The Journal screen's section-label
  spacing was also fixed.
- **A Play Store release has been uploaded** (version code 9) and the user confirmed
  the upload succeeded in the Play Console.

If you open this repo fresh, `git log` and `CASE_STUDY.md` (a running diary of every
session, in the repo root) are the two sources of truth for exactly what happened and
why. Read `CASE_STUDY.md`'s most recent entries first.

---

## 3. What's left to do — in priority order

This is the actual to-do list. Items are ordered by what will most affect whether the
app is safe/complete to keep shipping.

### 3.1 Finish the icon/visual-identity work (4 tickets, already written up on GitHub)

There are 4 remaining GitHub issues in this repo (view them by running
`gh issue list --state open` in a terminal, or on github.com under the repo's Issues
tab) that were already scoped out in detail — you don't need to figure out *what* to
do, just have someone (a developer or an AI coding assistant like Claude Code) do it:

- **#47** — Remove the flag emoji from the language picker, replace with plain text
  (e.g. "EN" / "한국어") instead of flag icons.
- **#48** — Find every remaining place in the app that still uses an emoji as an icon
  (rather than the new Card/IconChip building blocks) and convert it.
- **#49** — Add a small "More from us" section to the Settings screen that links to
  the Play Store / App Store listings for the other two sibling apps (Dreami,
  ClarityAI). This requires you to have the actual store listing URLs, which is a
  real business decision, not something an AI can invent — you'll need to provide the
  actual links to Dreami and ClarityAI's store pages.
- **#50** — A final walkthrough of the whole app to catch any leftover emoji or visual
  inconsistency the earlier tickets missed, plus a general regression check (make sure
  nothing broke).

**How to execute these**: If you have Claude Code (or another AI coding assistant)
available, you can literally hand it the issue number and say "implement issue #47 in
this repo" and it can read the ticket and do the work — that's exactly how #44-#46 got
done. If you're doing it by hand, each issue's description on GitHub has the specific
files and reasoning already written out.

### 3.2 Real-device verification (never actually done — only checked in a browser)

Every UI change so far (breathing/grounding spacing, the floating tab bar, the icon
work) was only visually checked by running the app in a web browser (Expo's web
preview), never on an actual Android phone. Browser preview is a reasonable stand-in
but it can miss things that only show up on real hardware, specifically:
- Shadow/elevation clipping on the floating tab bar (the rounded shadow behind it might
  get cut off at the screen edge on a real phone, since phone screens have hardware
  corners/notches the browser doesn't simulate).
- Safe-area spacing (the padding around notches, home-bar gesture areas, etc.) — the
  browser doesn't have these at all.

**Action**: Install the current build on an actual Android phone (you already have a
signed release build process working — see Section 4) and just look at every screen,
especially the bottom tab bar and any screen with content near the top or bottom edge.

### 3.3 Dark mode was never actually tested live

Every change so far included a note like "dark mode not live-toggled — this browser
sandbox exposes no dark/light override." The reasoning given each time is "this should
be safe because it reuses the same existing color values," but nobody has actually
looked at the app in dark mode after all these changes stacked up.

**Action**: On a real phone or in the Expo web preview, switch your device/OS to dark
mode and click through every screen once, looking for anything that's the wrong color,
invisible (e.g. dark text on a dark background), or low-contrast.

### 3.4 No automated tests exist at all

This is worth understanding clearly: **there is no test suite**. `package.json` has
test *libraries* installed (`jest`, `@testing-library/react-native`) but there is no
`test` script wired up and there are zero test files anywhere under `src/`. Every
single change made so far has been verified by hand (visually looking at the running
app) plus TypeScript's type-checker (`tsc`) and the linter (`expo lint`), which catch
typos and type mistakes but **do not catch logic bugs or broken user flows.**

This isn't necessarily wrong for an app this size built by one person, but it does mean
"production ready" here means "I clicked through it and it looked right" rather than
"a suite of automated tests protects this app from regressions." If you want more
confidence going forward, consider:
- At minimum, manually testing the full "golden path" before every release: onboarding
  → sign up → log a journal entry → do a breathing exercise → check insights → sign
  out → sign back in. This exercises almost every major system (auth, database writes,
  navigation) in one pass.
- Longer term, if you or a future developer wants real automated tests, that's a
  distinct, larger project (writing the test script, writing test files) — not
  something to bolt on casually.

### 3.5 Repo cleanup — files that shouldn't be there

Running `git status` shows a few files sitting in the project folder that were never
cleaned up and aren't tracked by git (meaning: they exist on your disk but git doesn't
know about them, so they won't get lost, but they're clutter):

- `Next.md` — a scratch note from a past session, safe to delete once you've read this
  spec (it's now superseded by this document).
- `list.md` — three old UI complaints (breathing screen spacing, grounding screen
  spacing, bottom tab bar redesign). **All three have already been fixed** (see Section
  2), so this file is stale and safe to delete.
- `clarityincalm.aab` — an old Android App Bundle file sitting in the repo root
  (outside the normal `android/app/build/outputs/` build location). This is a large
  binary file that has no reason to live in your project folder — it was presumably an
  old release build copied out for convenience. Safe to delete once you've confirmed
  you don't need it (i.e., you already have this version in the Play Console).
- `supabase/.temp/` — a cache folder the Supabase command-line tool creates
  automatically. Safe to delete; it'll regenerate if needed. Consider adding
  `supabase/.temp/` to `.gitignore` so it stops showing up in `git status`.

**Action**: Once you've confirmed you don't need any of these, run:
```
rm Next.md list.md clarityincalm.aab
rm -rf supabase/.temp
```
Then optionally add `supabase/.temp/` to the `.gitignore` file so this doesn't
reappear.

### 3.6 Known but deliberately deferred items (not urgent, don't chase these blindly)

These were identified and consciously set aside — they're documented here so you know
they're intentional gaps, not oversights:

- **A shared custom heading font/typeface** across all three sibling apps was planned
  but the specific font was never chosen — this needs a design decision (literally
  picking a font that feels right), not an engineering task.
- **Korean/Hindi crisis-related phrasing gap**: there's a known content gap around
  overdose-related phrasing translations that was flagged during a review but
  deliberately not drafted without your explicit go-ahead (this is sensitive
  safety-related content and should be written/reviewed carefully, likely with input
  from a native speaker or professional translator, not generated blind).
- **Apple Sign-In**: code exists in the app but was never tested, because testing it
  requires a paid ($99/year) Apple Developer account. If you plan to ship on iOS at
  all, you'll need that account regardless (Apple requires it to publish any iOS app),
  at which point you should also finish testing Apple Sign-In.
- **iOS release entirely**: everything shipped so far has been Android only. There is
  no App Store listing, no iOS build, no TestFlight testing. If iOS matters to you,
  this is a substantial separate body of work: an Apple Developer account, building the
  iOS version (`expo prebuild --platform ios` + Xcode, since you're on Linux this would
  require either a Mac, a cloud Mac service, or Expo's cloud build service "EAS Build"),
  app icons/screenshots sized for Apple's requirements, and their app review process.
- **A "Connect" feature in the ClarityAI app** that references this app and Dreami as
  data sources was found during review and deliberately left alone — it doesn't
  currently work correctly given that the three apps don't share data, but fixing it is
  ClarityAI's problem to solve in its own repo, not this one.

---

## 4. How to actually build and release a new version (step by step)

You've done this before, but here it is written down in full so you don't have to
remember it from scratch.

### Building for Android (what you've been doing)

This machine has limited memory (6.4GB RAM), which matters because Android builds are
memory-hungry. Read `AGENTS.md` in the repo root before running any build — it explains
a memory setting you must reapply by hand after certain steps, or the build can silently
die with no error message.

1. **If you need a fresh native Android project** (the `android/` folder doesn't exist,
   or you want to start clean): run `npx expo prebuild --platform android --clean`.
2. **If this is a one-off local debug build** (for testing on your own phone, not for
   the Play Store): after prebuild, hand-edit `android/gradle.properties` to add:
   ```
   org.gradle.jvmargs=-Xmx1536m -XX:MaxMetaspaceSize=512m
   reactNativeArchitectures=arm64-v8a
   ```
   This is required on this machine or the build can get silently killed. Do **not**
   commit this change or put it in `app.config.js` — it's a local-only workaround.
3. **If this is a real release build for the Play Store**: `android/gradle.properties`
   needs to build for all 4 device types (`reactNativeArchitectures` should include
   `armeabi-v7a,arm64-v8a,x86,x86_64`, or just be left out entirely to build all of
   them), because the Play Store requires supporting all device types. Then, before
   building, bump `android.versionCode` in `app.config.js` by 1 from whatever the last
   released version was (currently 9 — your next release should be 10).
4. Run the build:
   ```
   cd android && ./gradlew bundleRelease --no-daemon
   ```
   This produces a `.aab` file at
   `android/app/build/outputs/bundle/release/app-release.aab`. This is the file you
   upload to the Play Console.
5. **Signing**: the release signing key already exists
   (`android/app/release.keystore.jks`) — don't regenerate it. If you ever lose this
   file, you will not be able to update the app on the Play Store under the same
   listing again, so back it up somewhere safe (e.g. a password manager or encrypted
   cloud storage) if you haven't already.
6. Upload the resulting `.aab` file manually to the Play Console (Play Console →
   your app → Production or Internal testing → Create new release → upload the file).

### Before every release, at minimum:

- [ ] Run `npx tsc --noEmit` — this checks for type errors. Should show no new errors
      beyond the small number of pre-existing ones in test-type-definition files
      (unrelated to app code).
- [ ] Run `npx expo lint` — checks code style/common mistakes.
- [ ] Manually click through the full app once (the "golden path" from Section 3.4).
- [ ] Bump the version number in `app.config.js`.

---

## 5. Secrets and accounts you'll need to keep track of

- **Supabase project**: the app's backend/database. Login credentials for
  `supabase.com` control this — don't lose access to that account.
- **`.env` file** (not checked into git, exists only on this machine): contains
  `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`. If you set this app
  up on a new machine, copy `.env.example`, fill in the real values from your Supabase
  project's dashboard.
- **Google Play Console account**: needed to publish/update the Android app.
- **Android signing key** (`android/app/release.keystore.jks`, plus the password
  values in `android/gradle.properties`): required to publish updates to the *same*
  Play Store listing. Losing this means you can never update this listing again — back
  it up.
- **Privacy policy**: hosted for free on GitHub Pages at
  `https://kwanghyunyoon.github.io/clarity-in-calm-privacy/` (a separate, public repo
  called `clarity-in-calm-privacy`). If you ever change what data the app collects,
  update that page too — Play Store review checks that the privacy policy matches
  actual app behavior.

---

## 6. If you want to keep using an AI coding assistant after this

Everything in this repo was set up to make that easy to pick back up:

- **`CASE_STUDY.md`** (repo root) — a full chronological diary of every development
  session, written in plain narrative form. Point a new AI session at "read
  CASE_STUDY.md's most recent entries" and it will understand recent history.
- **`AGENTS.md`** (repo root) — technical gotchas specific to this machine/setup
  (the memory/build issue, Expo version notes).
- **GitHub Issues** — the remaining work (Section 3.1) is already written up as
  numbered tickets (#47-#50) with enough detail that an AI assistant can implement them
  directly if you say "implement issue #47."
- **`docs/adr/`** — two "Architecture Decision Record" documents explaining *why* the
  visual-identity and cross-app-connection decisions were made the way they were, in
  case that context matters later.

---

## 7. Bottom-line summary

The app works, is live on the Play Store, is free with no broken payment code left
over, and has no major known bugs. What's left before you'd call this fully "buttoned
up" is: 4 already-scoped visual-consistency tickets, one real-device check, one dark-
mode check, and some harmless file cleanup. None of it is urgent in the sense of "the
app is currently broken" — it's finishing-touches and verification work, not firefighting.
