/**
 * OnboardingModal — shown on first launch AND whenever the user taps the help button.
 * Language toggle is available on every slide.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Spacing } from '@/constants/theme';
import { useHelp } from '@/context/help-context';
import { useLocale } from '@/context/language-context';
import { type Locale } from '@/i18n/translations';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';

const ONBOARDING_KEY = '@cic:hasSeenOnboarding';

const LANGUAGES: { locale: Locale; flag: string; label: string }[] = [
  { locale: 'en', flag: '🇺🇸', label: 'EN' },
  { locale: 'ko', flag: '🇰🇷', label: '한' },
  { locale: 'es', flag: '🇲🇽', label: 'ES' },
  { locale: 'hi', flag: '🇮🇳', label: 'हि' },
];

export function OnboardingModal() {
  const colors                = useTheme();
  const t                     = useTranslation();
  const { locale, setLocale } = useLocale();
  const { isHelpVisible, hideHelp } = useHelp();

  const [firstLaunch, setFirstLaunch] = useState(false);
  const [page,        setPage]        = useState(0);

  // Show on first launch — guard against setState after unmount
  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(ONBOARDING_KEY)
      .then((val) => { if (mounted && val !== 'true') setFirstLaunch(true); })
      .catch(() => { if (mounted) setFirstLaunch(true); }); // storage failure → assume first launch
    return () => { mounted = false; };
  }, []);

  // Reset to page 0 every time it's re-opened via the help button
  useEffect(() => {
    if (isHelpVisible) setPage(0);
  }, [isHelpVisible]);

  const visible = firstLaunch || isHelpVisible;
  const slides  = t.onboarding.slides as readonly { emoji: string; title: string; body: string }[];
  const isLast  = page === slides.length - 1;

  const handleNext = async () => {
    if (isLast) {
      // Mark first-launch as done; close however it was opened
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      setFirstLaunch(false);
      hideHelp();
      setPage(0);
    } else {
      setPage((p) => p + 1);
    }
  };

  const handleClose = async () => {
    // Mark as seen so it doesn't reappear on next launch
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    setFirstLaunch(false);
    hideHelp();
    setPage(0);
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

        {/* ── Close / skip button (top-right) ── */}
        <TouchableOpacity style={s.closeBtn} onPress={handleClose} activeOpacity={0.7}>
          <Text style={[s.closeTxt, { color: colors.textSecondary }]}>✕</Text>
        </TouchableOpacity>

        {/* ── Language toggle ── */}
        <View style={s.langRow}>
          {LANGUAGES.map((lang, i) => {
            const active = locale === lang.locale;
            return (
              <TouchableOpacity
                key={lang.locale}
                onPress={() => setLocale(lang.locale)}
                activeOpacity={0.75}
                style={[
                  s.langBtn,
                  { backgroundColor: active ? colors.primary : colors.backgroundElement },
                  i === 0 && s.langBtnFirst,
                  i === LANGUAGES.length - 1 && s.langBtnLast,
                ]}
              >
                <Text style={s.langFlag}>{lang.flag}</Text>
                <Text style={[s.langLabel, { color: active ? '#fff' : colors.textSecondary }]}>
                  {lang.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Slide content ── */}
        <Animated.View key={page} entering={FadeIn.duration(280)} style={s.slide}>
          <Text style={s.emoji}>{slide.emoji}</Text>
          <Text style={[s.title, { color: colors.text }]}>{slide.title}</Text>
          <Text style={[s.body,  { color: colors.textSecondary }]}>{slide.body}</Text>
        </Animated.View>

        {/* ── Bottom ── */}
        <View style={s.bottom}>
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

          <Text style={[s.privacy, { color: colors.textSecondary }]}>
            {t.onboarding.privacy}
          </Text>

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
  root:         { flex: 1, paddingHorizontal: Spacing.four, paddingTop: 56, paddingBottom: 52 },

  closeBtn:     { position: 'absolute', top: 56, right: Spacing.four,
                  width: 36, height: 36, alignItems: 'center', justifyContent: 'center',
                  zIndex: 10 },
  closeTxt:     { fontSize: 18, fontWeight: '600' },

  langRow:      { flexDirection: 'row', justifyContent: 'center',
                  borderRadius: 50, overflow: 'hidden', alignSelf: 'center',
                  marginTop: Spacing.four },
  langBtn:      { flexDirection: 'row', alignItems: 'center', gap: 4,
                  paddingHorizontal: Spacing.two + 4, paddingVertical: Spacing.one + 4 },
  langBtnFirst: { borderTopLeftRadius: 50, borderBottomLeftRadius: 50 },
  langBtnLast:  { borderTopRightRadius: 50, borderBottomRightRadius: 50 },
  langFlag:     { fontSize: 14 },
  langLabel:    { fontSize: 12, fontWeight: '700' },

  slide:        { flex: 1, justifyContent: 'center', alignItems: 'center', gap: Spacing.three },
  emoji:        { fontSize: 72, textAlign: 'center' },
  title:        { fontSize: 30, fontWeight: '800', textAlign: 'center',
                  letterSpacing: -0.5, lineHeight: 38 },
  body:         { fontSize: 16, lineHeight: 25, textAlign: 'center', fontWeight: '500',
                  maxWidth: 320 },

  bottom:       { gap: Spacing.three, alignItems: 'center' },
  dots:         { flexDirection: 'row', gap: 6, alignItems: 'center' },
  dot:          { height: 8, borderRadius: 4 },
  privacy:      { fontSize: 13, fontWeight: '500', textAlign: 'center' },
  btn:          { paddingHorizontal: Spacing.five, paddingVertical: Spacing.two + 6,
                  borderRadius: 50, alignItems: 'center', width: '100%' },
  btnText:      { fontSize: 17, fontWeight: '700', color: '#ffffff' },
});
