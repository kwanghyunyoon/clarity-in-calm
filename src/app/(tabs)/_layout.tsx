import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { ColorValue, Platform, StyleSheet, View, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { LanguagePill } from '@/components/language-pill';
import { OnboardingModal } from '@/components/onboarding-modal';
import { Colors, Spacing, TAB_BAR_FLOAT_HEIGHT } from '@/constants/theme';
import { useTranslation } from '@/hooks/use-translation';

function TabIcon({
  name,
  color,
}: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: ColorValue;
}) {
  return (
    <View style={{ width: 30, height: 30, alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons name={name} size={24} color={color} />
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  const colors = Colors[scheme];
  const t = useTranslation();
  const insets = useSafeAreaInsets();

  const barBottom = Math.max(insets.bottom, Platform.OS === 'android' ? 8 : 4) + Spacing.two;

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
            position: 'absolute',
            left: Spacing.three,
            right: Spacing.three,
            bottom: barBottom,
            height: TAB_BAR_FLOAT_HEIGHT,
            borderRadius: 28,
            borderTopWidth: 0,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: colors.tabBarBorder,
            backgroundColor: colors.tabBar,
            paddingTop: 6,
            paddingBottom: 0,
            elevation: 4,
            shadowColor: '#000',
            shadowOpacity: 0.12,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
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
            tabBarIcon: ({ color }) => <TabIcon name="sunny" color={color} />,
          }}
        />
        <Tabs.Screen
          name="journal"
          options={{
            title: t.tabs.journal,
            tabBarLabel: t.tabs.journal,
            tabBarIcon: ({ color }) => <TabIcon name="book" color={color} />,
          }}
        />
        <Tabs.Screen
          name="emotions"
          options={{
            title: t.tabs.emotions,
            tabBarLabel: t.tabs.emotions,
            tabBarIcon: ({ color }) => <TabIcon name="sync" color={color} />,
          }}
        />
        <Tabs.Screen
          name="insights"
          options={{
            title: t.tabs.insights,
            tabBarLabel: t.tabs.insights,
            tabBarIcon: ({ color }) => <TabIcon name="sparkles" color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: t.tabs.settings,
            tabBarLabel: t.tabs.settings,
            tabBarIcon: ({ color }) => <TabIcon name="settings" color={color} />,
          }}
        />

        {/* ── Hidden utility routes (still navigable) ── */}
        <Tabs.Screen name="breathe"  options={{ href: null }} />
        <Tabs.Screen name="ground"   options={{ href: null }} />
        <Tabs.Screen name="feelings-library" options={{ href: null }} />
      </Tabs>
    </>
  );
}
