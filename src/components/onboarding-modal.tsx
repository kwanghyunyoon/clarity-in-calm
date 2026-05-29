/**
 * OnboardingModal — shown on first launch AND whenever the user taps the help button.
 * Language toggle is available on every slide.
 * Each slide has a tailored visual component in addition to the text content.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import { Animated, Linking, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated2, { FadeIn } from 'react-native-reanimated';

import { Spacing } from '@/constants/theme';
import { useHelp } from '@/context/help-context';
import { useLocale } from '@/context/language-context';
import { type Locale } from '@/i18n/translations';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';

const ONBOARDING_KEY = '@cic:hasSeenOnboarding';
const SUPPORT_EMAIL  = 'trac3r1885@gmail.com';

const LANGUAGES: { locale: Locale; flag: string; label: string }[] = [
  { locale: 'en', flag: '🇺🇸', label: 'EN' },
  { locale: 'ko', flag: '🇰🇷', label: '한' },
  { locale: 'es', flag: '🇲🇽', label: 'ES' },
  { locale: 'hi', flag: '🇮🇳', label: 'हि' },
];

function openFeedback() {
  Linking.openURL(
    `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('Clarity in Calm Feedback')}&body=${encodeURIComponent('Hi,\n\nI found an issue:\n\n')}`,
  );
}

// ─── Slide visuals ────────────────────────────────────────────────────────────

// Slide 0 — Welcome: gently pulsing lotus
function WelcomeVisual() {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.1, duration: 1400, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1,   duration: 1400, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <Animated.View style={[s.welcomeOrb, { transform: [{ scale }] }]}>
      <Text style={s.welcomeEmoji}>🌿</Text>
    </Animated.View>
  );
}

// Slide 1 — Breathe: animated expanding circle
function BreatheVisual({ colors }: { colors: ReturnType<typeof useTheme> }) {
  const scale = useRef(new Animated.Value(0.75)).current;
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scale,   { toValue: 1.2, duration: 1800, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 1,   duration: 1800, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(scale,   { toValue: 0.75, duration: 1800, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.5,  duration: 1800, useNativeDriver: true }),
        ]),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <View style={s.breatheWrap}>
      {/* Outer glow ring */}
      <Animated.View
        style={[
          s.breatheRing,
          { borderColor: colors.primary + '40', transform: [{ scale }], opacity },
        ]}
      />
      {/* Inner circle */}
      <Animated.View
        style={[
          s.breatheCircle,
          { backgroundColor: colors.primary + '22', transform: [{ scale }] },
        ]}
      >
        <Text style={s.breatheEmoji}>🫁</Text>
      </Animated.View>
    </View>
  );
}

// Slide 2 — Journal: interactive mini mood row
const MOOD_EMOJIS = ['😞', '😕', '😐', '🙂', '😊'];
function JournalVisual({ colors }: { colors: ReturnType<typeof useTheme> }) {
  const [selected, setSelected] = useState(2);

  return (
    <View style={s.moodWrap}>
      {MOOD_EMOJIS.map((emoji, i) => (
        <TouchableOpacity
          key={i}
          onPress={() => setSelected(i)}
          activeOpacity={0.75}
          style={[
            s.moodBtn,
            { backgroundColor: i === selected ? colors.primary + '22' : colors.backgroundElement },
            i === selected && s.moodBtnActive,
          ]}
        >
          <Text style={[s.moodEmoji, i === selected && s.moodEmojiActive]}>{emoji}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// Slide 3 — Progress: mini streak + 7-day dots
function ProgressVisual({ colors }: { colors: ReturnType<typeof useTheme> }) {
  const HAS_ENTRY = [true, true, false, true, true, true, false];

  return (
    <View style={s.progressWrap}>
      <View style={[s.streakCard, { backgroundColor: colors.backgroundElement }]}>
        <Text style={s.streakFlame}>🔥</Text>
        <Text style={[s.streakNum, { color: colors.text }]}>5</Text>
        <Text style={[s.streakLabel, { color: colors.textSecondary }]}>day streak</Text>
      </View>
      <View style={s.dotRow}>
        {HAS_ENTRY.map((has, i) => (
          <View
            key={i}
            style={[
              s.dayDot,
              { backgroundColor: has ? colors.primary : colors.backgroundSelected },
            ]}
          />
        ))}
      </View>
      <Text style={[s.progressHint, { color: colors.textSecondary }]}>Last 7 days</Text>
    </View>
  );
}

// ─── Slide visual router ──────────────────────────────────────────────────────
function SlideVisual({ page, colors }: { page: number; colors: ReturnType<typeof useTheme> }) {
  switch (page) {
    case 0: return <WelcomeVisual />;
    case 1: return <BreatheVisual colors={colors} />;
    case 2: return <JournalVisual colors={colors} />;
    case 3: return <ProgressVisual colors={colors} />;
    default: return null;
  }
}

// ─── Main modal ───────────────────────────────────────────────────────────────
export function OnboardingModal() {
  const colors                = useTheme();
  const t                     = useTranslation();
  const { locale, setLocale } = useLocale();
  const { isHelpVisible, hideHelp } = useHelp();

  const [firstLaunch, setFirstLaunch] = useState(false);
  const [page,        setPage]        = useState(0);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(ONBOARDING_KEY)
      .then((val) => { if (mounted && val !== 'true') setFirstLaunch(true); })
      .catch(() => { if (mounted) setFirstLaunch(true); });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (isHelpVisible) setPage(0);
  }, [isHelpVisible]);

  const visible = firstLaunch || isHelpVisible;
  const slides  = t.onboarding.slides as readonly { emoji: string; title: string; body: string }[];
  const isLast  = page === slides.length - 1;

  const handleNext = async () => {
    if (isLast) {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      setFirstLaunch(false);
      hideHelp();
      setPage(0);
    } else {
      setPage((p) => p + 1);
    }
  };

  const handleClose = async () => {
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

        {/* ── Visual component for this slide ── */}
        <Animated2.View key={`visual-${page}`} entering={FadeIn.duration(300)} style={s.visualWrap}>
          <SlideVisual page={page} colors={colors} />
        </Animated2.View>

        {/* ── Text content ── */}
        <Animated2.View key={`text-${page}`} entering={FadeIn.duration(280)} style={s.slide}>
          <Text style={[s.title, { color: colors.text }]}>{slide.title}</Text>
          <Text style={[s.body,  { color: colors.textSecondary }]}>{slide.body}</Text>
        </Animated2.View>

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

          <TouchableOpacity onPress={openFeedback} activeOpacity={0.7} style={s.reportBtn}>
            <Text style={[s.reportTxt, { color: colors.textSecondary }]}>
              {t.onboarding.reportIssue}
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  root:         { flex: 1, paddingHorizontal: Spacing.four, paddingTop: 52, paddingBottom: 40 },

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

  // Visual area
  visualWrap:   { alignItems: 'center', justifyContent: 'center', height: 160, marginTop: Spacing.three },

  // Welcome
  welcomeOrb:   { width: 120, height: 120, borderRadius: 60,
                  backgroundColor: 'rgba(130,190,130,0.15)',
                  alignItems: 'center', justifyContent: 'center' },
  welcomeEmoji: { fontSize: 64 },

  // Breathe
  breatheWrap:   { alignItems: 'center', justifyContent: 'center', width: 160, height: 160 },
  breatheRing:   { position: 'absolute', width: 140, height: 140, borderRadius: 70, borderWidth: 2 },
  breatheCircle: { width: 100, height: 100, borderRadius: 50,
                   alignItems: 'center', justifyContent: 'center' },
  breatheEmoji:  { fontSize: 44 },

  // Journal mood row
  moodWrap:     { flexDirection: 'row', gap: 10, alignItems: 'center' },
  moodBtn:      { width: 48, height: 48, borderRadius: 14,
                  alignItems: 'center', justifyContent: 'center' },
  moodBtnActive:{ transform: [{ scale: 1.2 }] },
  moodEmoji:    { fontSize: 24 },
  moodEmojiActive: { fontSize: 28 },

  // Progress
  progressWrap:  { alignItems: 'center', gap: Spacing.two },
  streakCard:    { borderRadius: 18, paddingHorizontal: Spacing.five, paddingVertical: Spacing.two,
                   alignItems: 'center', flexDirection: 'row', gap: Spacing.two },
  streakFlame:   { fontSize: 28 },
  streakNum:     { fontSize: 36, fontWeight: '800', lineHeight: 42 },
  streakLabel:   { fontSize: 12, fontWeight: '600' },
  dotRow:        { flexDirection: 'row', gap: 8 },
  dayDot:        { width: 28, height: 28, borderRadius: 8 },
  progressHint:  { fontSize: 11, fontWeight: '500' },

  // Slide text
  slide:        { flex: 1, justifyContent: 'center', alignItems: 'center', gap: Spacing.two,
                  paddingHorizontal: Spacing.two },
  title:        { fontSize: 28, fontWeight: '800', textAlign: 'center',
                  letterSpacing: -0.5, lineHeight: 36 },
  body:         { fontSize: 15, lineHeight: 23, textAlign: 'center', fontWeight: '500',
                  maxWidth: 300 },

  bottom:       { gap: Spacing.two + 2, alignItems: 'center' },
  dots:         { flexDirection: 'row', gap: 6, alignItems: 'center' },
  dot:          { height: 8, borderRadius: 4 },
  privacy:      { fontSize: 13, fontWeight: '500', textAlign: 'center' },
  btn:          { paddingHorizontal: Spacing.five, paddingVertical: Spacing.two + 6,
                  borderRadius: 50, alignItems: 'center', width: '100%' },
  btnText:      { fontSize: 17, fontWeight: '700', color: '#ffffff' },

  reportBtn:    { paddingVertical: 4 },
  reportTxt:    { fontSize: 12, fontWeight: '500', textDecorationLine: 'underline' },
});
