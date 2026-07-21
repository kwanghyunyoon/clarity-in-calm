import { Tabs } from 'expo-router';
import { Platform, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { LanguagePill } from '@/components/language-pill';
import { OnboardingModal } from '@/components/onboarding-modal';
import { Colors } from '@/constants/theme';
import { useTranslation } from '@/hooks/use-translation';

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <View style={{ width: 28, height: 28, alignItems: 'center', justifyContent: 'center', opacity: focused ? 1 : 0.45 }}>
      <Text style={{ fontSize: 20 }}>{emoji}</Text>
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  const colors = Colors[scheme];
  const t = useTranslation();
  const insets = useSafeAreaInsets();

  const TAB_BAR_BASE = 54;
  const bottomPad = Math.max(insets.bottom, Platform.OS === 'android' ? 8 : 4);

  return (
    <>
      <AnimatedSplashOverlay />
      <LanguagePill />
      <OnboardingModal />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: false,
          tabBarStyle: {
            backgroundColor: colors.tabBar,
            borderTopColor: colors.tabBarBorder,
            borderTopWidth: StyleSheet.hairlineWidth,
            height: TAB_BAR_BASE + bottomPad,
            paddingBottom: bottomPad,
            paddingTop: 6,
            elevation: 0,
            shadowOpacity: 0,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '600',
            letterSpacing: 0.2,
            marginTop: -2,
          },
        }}
      >
        {/* ── Visible tabs ─────────────────────────────── */}
        <Tabs.Screen
          name="index"
          options={{
            title: t.tabs.today,
            tabBarLabel: t.tabs.today,
            tabBarIcon: ({ focused }) => <TabIcon emoji="☀️" focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="journal"
          options={{
            title: t.tabs.journal,
            tabBarLabel: t.tabs.journal,
            tabBarIcon: ({ focused }) => <TabIcon emoji="📖" focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="emotions"
          options={{
            title: t.tabs.emotions,
            tabBarLabel: t.tabs.emotions,
            tabBarIcon: ({ focused }) => <TabIcon emoji="🌀" focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="insights"
          options={{
            title: t.tabs.insights,
            tabBarLabel: t.tabs.insights,
            tabBarIcon: ({ focused }) => <TabIcon emoji="✨" focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: t.tabs.settings,
            tabBarLabel: t.tabs.settings,
            tabBarIcon: ({ focused }) => <TabIcon emoji="⚙️" focused={focused} />,
          }}
        />

        {/* ── Hidden utility routes (still navigable) ── */}
        <Tabs.Screen name="breathe"  options={{ href: null }} />
        <Tabs.Screen name="ground"   options={{ href: null }} />
        <Tabs.Screen name="progress" options={{ href: null }} />
        <Tabs.Screen name="feelings-library" options={{ href: null }} />
      </Tabs>
    </>
  );
}
