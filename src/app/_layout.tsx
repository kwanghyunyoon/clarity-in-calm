import { DarkTheme, DefaultTheme, Tabs, ThemeProvider } from 'expo-router';
import { useEffect } from 'react';
import { Platform, Text, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { OnboardingModal } from '@/components/onboarding-modal';
import { Colors } from '@/constants/theme';
import { LanguageProvider } from '@/context/language-context';
import { WellnessProvider } from '@/context/wellness-context';
import { useTranslation } from '@/hooks/use-translation';

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <View style={{ width: 28, height: 28, alignItems: 'center', justifyContent: 'center', opacity: focused ? 1 : 0.45 }}>
      <Text style={{ fontSize: 22 }}>{emoji}</Text>
    </View>
  );
}

// Register service worker for PWA offline support (web only)
if (Platform.OS === 'web' && typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => { /* ignore in dev */ });
  });
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  const colors = Colors[scheme];
  const t = useTranslation();
  const insets = useSafeAreaInsets();

  const TAB_BAR_BASE = 58;
  const bottomPad = Math.max(insets.bottom, Platform.OS === 'android' ? 10 : 26) + 36;

  return (
    <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <LanguageProvider>
      <WellnessProvider>
        <AnimatedSplashOverlay />
        <OnboardingModal />
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarHideOnKeyboard: false,
            tabBarStyle: {
              backgroundColor: colors.surface,
              borderTopColor: colors.border,
              borderTopWidth: 1,
              height: TAB_BAR_BASE + bottomPad,
              paddingBottom: bottomPad,
              paddingTop: 8,
            },
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.textSecondary,
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: '600',
              marginTop: 0,
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: t.tabs.home,
              tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />,
            }}
          />
          <Tabs.Screen
            name="breathe"
            options={{
              title: t.tabs.breathe,
              tabBarIcon: ({ focused }) => <TabIcon emoji="🫁" focused={focused} />,
            }}
          />
          <Tabs.Screen
            name="journal"
            options={{
              title: t.tabs.journal,
              tabBarIcon: ({ focused }) => <TabIcon emoji="📖" focused={focused} />,
            }}
          />
          <Tabs.Screen
            name="progress"
            options={{
              title: t.tabs.progress,
              tabBarIcon: ({ focused }) => <TabIcon emoji="✨" focused={focused} />,
            }}
          />
          {/* Hide the original explore screen from the tab bar */}
          <Tabs.Screen name="explore" options={{ href: null }} />
        </Tabs>
      </WellnessProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
