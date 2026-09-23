// Lets local TS config plugins (plugins/*.ts) import the app's TS modules.
import 'tsx/cjs';

export default {
  expo: {
    name: 'clarity-in-calm',
    slug: 'clarity-in-calm',
    version: '1.1.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'clarityincalm',
    userInterfaceStyle: 'automatic',
    ios: {
      bundleIdentifier: 'com.clarityincalm.app',
      icon: './assets/images/icon.png',
      supportsTablet: true,
      usesAppleSignIn: true,
    },
    android: {
      package: 'com.clarityincalm.app',
      versionCode: 26,
      jsEngine: 'hermes',
      adaptiveIcon: {
        backgroundColor: '#EDEAE5',
        foregroundImage: './assets/images/android-icon-foreground.png',
        backgroundImage: './assets/images/android-icon-background.png',
        monochromeImage: './assets/images/android-icon-monochrome.png',
      },
      predictiveBackGestureEnabled: false,
    },
    newArchEnabled: true,
    web: {
      output: 'static',
      favicon: './assets/images/favicon.png',
      name: 'Clarity in Calm',
      shortName: 'Clarity',
      description: 'A mindfulness app for breathing, journaling, and tracking your wellness.',
      themeColor: '#208AEF',
      backgroundColor: '#E6F4FE',
      display: 'standalone',
      orientation: 'portrait',
      lang: 'en',
    },
    plugins: [
      ['expo-build-properties', { android: { targetSdkVersion: 36 } }],
      'expo-router',
      [
        'expo-notifications',
        {
          // Android renders the small notification icon as a silhouette from
          // the alpha channel: icon.png is RGB with no alpha, so every pixel
          // is opaque and it draws as a solid white square. The monochrome
          // asset has real transparency and renders as the actual mark.
          icon: './assets/images/android-icon-monochrome.png',
          color: '#F0A855',
          sounds: [],
        },
      ],
      [
        'expo-splash-screen',
        {
          backgroundColor: '#EDEAE5',
          android: {
            image: './assets/images/splash-icon.png',
            imageWidth: 200,
          },
        },
      ],
      'expo-secure-store',
      'expo-apple-authentication',
      './plugins/app-shortcuts.ts',
    ],
    experiments: {
      typedRoutes: true,
      baseUrl: process.env.DEPLOY_BASE_URL || '',
    },
    extra: {
      privacyPolicyUrl: 'https://kwanghyunyoon.github.io/clarity-in-calm-privacy/',
      eas: {
        projectId: 'bf00ce6d-48cc-42ed-ac7e-584978e2fc60',
      },
    },
    owner: 'yoonk478',
  },
};
