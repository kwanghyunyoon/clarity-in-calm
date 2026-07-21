export default {
  expo: {
    name: 'clarity-in-calm',
    slug: 'clarity-in-calm',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'clarityincalm',
    userInterfaceStyle: 'automatic',
    ios: {
      bundleIdentifier: 'com.clarityincalm.app',
      icon: './assets/images/icon.png',
      supportsTablet: true,
    },
    android: {
      package: 'com.clarityincalm.app',
      versionCode: 6,
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
          icon: './assets/images/icon.png',
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
