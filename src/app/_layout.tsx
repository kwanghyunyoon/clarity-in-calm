import { DarkTheme, DefaultTheme, Tabs, ThemeProvider } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { AppState, Platform, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import ErrorBoundary from '@/components/error-boundary';
import { OnboardingModal } from '@/components/onboarding-modal';
import { Colors } from '@/constants/theme';
import { EmotionProvider } from '@/context/emotion-context';
import { HelpProvider } from '@/context/help-context';
import { LanguageProvider } from '@/context/language-context';
import { SettingsProvider } from '@/context/settings-context';
import { WellnessProvider } from '@/context/wellness-context';
import { useTranslation } from '@/hooks/use-translation';

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <View style={{ width: 28, height: 28, alignItems: 'center', justifyContent: 'center', opacity: focused ? 1 : 0.45 }}>
      <Text style={{ fontSize: 20 }}>{emoji}</Text>
    </View>
  );
}

// Register service worker for PWA offline support (web only)
if (Platform.OS === 'web' && typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

function PrivacyShield() {
  const [hidden, setHidden] = useState(false);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    if (Platform.OS === 'web') return;
    const sub = AppState.addEventListener('change', next => {
      setHidden(next === 'inactive' || next === 'background');
      appState.current = next;
    });
    return () => sub.remove();
  }, []);

  if (!hidden) return null;
  return <View style={[StyleSheet.absoluteFill, { backgroundColor: '#000', zIndex: 9999 }]} />;
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
    <ErrorBoundary>
      <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
        <SettingsProvider>
          <HelpProvider>
            <LanguageProvider>
              <WellnessProvider>
                <EmotionProvider>
                  <PrivacyShield />
                  <AnimatedSplashOverlay />
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
                  </Tabs>
                </EmotionProvider>
              </WellnessProvider>
            </LanguageProvider>
          </HelpProvider>
        </SettingsProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
