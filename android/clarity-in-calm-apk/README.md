# Clarity in Calm - Android APK (WebView Wrapper)

This project wraps your single-file web app (`index.html`) inside an Android `WebView`, so you can build a real Android APK.

Your web content is bundled here:

- `app/src/main/assets/index.html`

## Prerequisites

- Android Studio installed
- Android SDK installed (Android Studio will prompt you if missing)
- (Optional) Android device connected via USB with Developer Options + USB debugging enabled

## Build a Debug APK (recommended first)

1. Open Android Studio
2. Click **File > Open**
3. Select the folder:
   - `android/clarity-in-calm-apk`
4. Wait for **Gradle Sync** to finish (Android Studio may download Gradle/AGP dependencies the first time)
5. In the top toolbar, set the build variant to **debug**
6. Go to **Build > Build APK(s)**
7. After it finishes, the APK will be available in:
   - `app/build/outputs/apk/debug/`

## Install on a device (optional)

Option A (Android Studio “Run”)
1. Connect your Android device (or start an emulator)
2. In Android Studio, choose the device from the device selector
3. Click **Run** (the ▶ button)

Option B (manual install)
1. Copy the generated APK from `app/build/outputs/apk/debug/` to your device
2. Install it like a normal APK

## Notes

- This app loads the bundled file using:
  - `file:///android_asset/index.html`
- It does not fetch any remote resources for the core UI.

