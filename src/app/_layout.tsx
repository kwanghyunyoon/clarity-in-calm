import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { AppState, Platform, StyleSheet, View, useColorScheme } from 'react-native';

import ErrorBoundary from '@/components/error-boundary';
import { ReminderLocaleSync } from '@/components/ReminderLocaleSync';
import { HelpProvider } from '@/context/help-context';
import { LanguageProvider } from '@/context/language-context';
import { SettingsProvider } from '@/context/settings-context';
import { TourOverlayProvider } from '@/context/tour-overlay-context';
import { TourReplayProvider } from '@/context/tour-replay-context';
import { WellnessProvider } from '@/context/wellness-context';
import { TourOverlayHost } from '@/components/tour/TourOverlay';

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

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';

  return (
    <ErrorBoundary>
      <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
        <SettingsProvider>
          <HelpProvider>
            <TourReplayProvider>
              <TourOverlayProvider>
                <LanguageProvider>
                  <WellnessProvider>
                    <PrivacyShield />
                    <ReminderLocaleSync />
                    {/* Optional sign-in: all routes are always registered. The (tabs)
                        group is the app; (auth) is pushed from Settings; reset-password
                        is reached via the recovery deep link. No hard auth gate. */}
                    <Stack screenOptions={{ headerShown: false }}>
                      <Stack.Screen name="(tabs)" />
                      <Stack.Screen name="(auth)" options={{ presentation: 'modal' }} />
                      <Stack.Screen name="reset-password" />
                    </Stack>
                    <TourOverlayHost />
                  </WellnessProvider>
                </LanguageProvider>
              </TourOverlayProvider>
            </TourReplayProvider>
          </HelpProvider>
        </SettingsProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
