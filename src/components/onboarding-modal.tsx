/**
 * OnboardingModal — shown once on first launch.
 * Three slides explain the app's three core features.
 * Dismissed state is persisted in AsyncStorage.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';

const ONBOARDING_KEY = '@cic:hasSeenOnboarding';

export function OnboardingModal() {
  const colors = useTheme();
  const t      = useTranslation();

  const [visible, setVisible] = useState(false);
  const [page,    setPage]    = useState(0);

  // Show only when the user has never seen it
  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_KEY).then((val) => {
      if (val !== 'true') setVisible(true);
    });
  }, []);

  const slides = t.onboarding.slides as readonly { emoji: string; title: string; body: string }[];
  const isLast = page === slides.length - 1;

  const handleNext = async () => {
    if (isLast) {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      setVisible(false);
    } else {
      setPage((p) => p + 1);
    }
  };

  const slide = slides[page];

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      statusBarTranslucent
    >
      <View style={[s.root, { backgroundColor: colors.background }]}>

        {/* Slide — keyed on `page` so the fade animation re-runs each slide */}
        <Animated.View key={page} entering={FadeIn.duration(280)} style={s.slide}>
          <Text style={s.emoji}>{slide.emoji}</Text>
          <Text style={[s.title, { color: colors.text }]}>{slide.title}</Text>
          <Text style={[s.body, { color: colors.textSecondary }]}>{slide.body}</Text>
        </Animated.View>

        {/* Bottom — dots + privacy note + button */}
        <View style={s.bottom}>

          {/* Pagination dots */}
          <View style={s.dots}>
            {slides.map((_, i) => (
              <View
                key={i}
                style={[
                  s.dot,
                  {
                    backgroundColor: i === page ? colors.primary : colors.backgroundSelected,
                    width: i === page ? 20 : 8,
                  },
                ]}
              />
            ))}
          </View>

          {/* Privacy note */}
          <Text style={[s.privacy, { color: colors.textSecondary }]}>
            {t.onboarding.privacy}
          </Text>

          {/* CTA button */}
          <TouchableOpacity
            style={[s.btn, { backgroundColor: colors.primary }]}
            onPress={handleNext}
            activeOpacity={0.85}
          >
            <Text style={s.btnText}>
              {isLast ? t.onboarding.getStarted : t.onboarding.next}
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  root:    { flex: 1, justifyContent: 'space-between', paddingHorizontal: Spacing.four,
             paddingTop: 80, paddingBottom: 52 },

  slide:   { flex: 1, justifyContent: 'center', alignItems: 'center', gap: Spacing.three },
  emoji:   { fontSize: 72, textAlign: 'center' },
  title:   { fontSize: 30, fontWeight: '800', textAlign: 'center',
             letterSpacing: -0.5, lineHeight: 38 },
  body:    { fontSize: 16, lineHeight: 25, textAlign: 'center', fontWeight: '500',
             maxWidth: 320 },

  bottom:  { gap: Spacing.three, alignItems: 'center' },

  dots:    { flexDirection: 'row', gap: 6, alignItems: 'center' },
  dot:     { height: 8, borderRadius: 4 },

  privacy: { fontSize: 13, fontWeight: '500', textAlign: 'center' },

  btn:     { paddingHorizontal: Spacing.five, paddingVertical: Spacing.two + 6,
             borderRadius: 50, minWidth: 180, alignItems: 'center', width: '100%' },
  btnText: { fontSize: 17, fontWeight: '700', color: '#ffffff' },
});
