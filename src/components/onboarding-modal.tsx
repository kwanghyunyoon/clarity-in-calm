/**
 * OnboardingModal — shown on first launch AND whenever the user taps the help button.
 * Language toggle is available on every slide.
 * Each slide has a tailored visual component in addition to the text content.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import { Animated, KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated2, { FadeIn } from 'react-native-reanimated';

import { Spacing } from '@/constants/theme';
import { useHelp } from '@/context/help-context';
import { useLocale } from '@/context/language-context';
import { type Locale } from '@/i18n/translations';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';

const ONBOARDING_KEY  = '@cic:hasSeenOnboarding';
const FEEDBACK_WORKER = 'https://app-feedback.kwangyoon.workers.dev';
const ISSUE_TYPES     = ['Bug', 'Suggestion', 'Other'];

const LANGUAGES: { locale: Locale; flag: string; label: string }[] = [
  { locale: 'en', flag: '🇺🇸', label: 'EN' },
  { locale: 'ko', flag: '🇰🇷', label: '한' },
  { locale: 'es', flag: '🇲🇽', label: 'ES' },
  { locale: 'hi', flag: '🇮🇳', label: 'हि' },
];

function FeedbackModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { colors } = useTheme();
  const [issueType, setIssueType]     = useState('Bug');
  const [description, setDescription] = useState('');
  const [status, setStatus]           = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const reset = () => {
    setIssueType('Bug');
    setDescription('');
    setStatus('idle');
  };

  const handleClose = () => { reset(); onClose(); };

  const handleSubmit = async () => {
    if (!description.trim()) return;
    setStatus('sending');
    try {
      const res = await fetch(FEEDBACK_WORKER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issueType, description: description.trim(), source: 'clarity' }),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={fs.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity style={fs.backdrop} activeOpacity={1} onPress={handleClose} />
        <View style={[fs.sheet, { backgroundColor: colors.surface }]}>
          {status === 'success' ? (
            <View style={fs.centered}>
              <Text style={fs.successIcon}>✅</Text>
              <Text style={[fs.successTitle, { color: colors.text }]}>Thanks!</Text>
              <Text style={[fs.successBody, { color: colors.textSecondary }]}>
                Your feedback has been received.
              </Text>
              <TouchableOpacity
                style={[fs.submitBtn, { backgroundColor: colors.primary }]}
                onPress={handleClose}
              >
                <Text style={fs.submitBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={[fs.sheetTitle, { color: colors.text }]}>Report an issue</Text>
              <Text style={[fs.fieldLabel, { color: colors.textSecondary }]}>Type</Text>
              <View style={fs.typeRow}>
                {ISSUE_TYPES.map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[
                      fs.typeBtn,
                      { borderColor: colors.backgroundSelected },
                      issueType === t && { borderColor: colors.primary, backgroundColor: colors.primary + '18' },
                    ]}
                    onPress={() => setIssueType(t)}
                    activeOpacity={0.75}
                  >
                    <Text style={[
                      fs.typeText,
                      { color: issueType === t ? colors.primary : colors.textSecondary },
                      issueType === t && { fontWeight: '700' as const },
                    ]}>
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={[fs.fieldLabel, { color: colors.textSecondary }]}>Description</Text>
              <TextInput
                style={[fs.textInput, fs.textInputMulti, {
                  backgroundColor: colors.backgroundElement,
                  borderColor: colors.backgroundSelected,
                  color: colors.text,
                }]}
                placeholder="Describe what happened..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={description}
                onChangeText={setDescription}
              />
              {status === 'error' && (
                <Text style={fs.errorText}>Something went wrong. Please try again.</Text>
              )}
              <TouchableOpacity
                style={[
                  fs.submitBtn,
                  { backgroundColor: colors.primary },
                  (!description.trim() || status === 'sending') && fs.submitBtnDisabled,
                ]}
                onPress={handleSubmit}
                disabled={!description.trim() || status === 'sending'}
                activeOpacity={0.85}
              >
                <Text style={fs.submitBtnText}>
                  {status === 'sending' ? 'Sending…' : 'Send feedback'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const fs = StyleSheet.create({
  overlay:           { flex: 1, justifyContent: 'flex-end' },
  backdrop:          { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.55)' },
  sheet:             { borderTopLeftRadius: 24, borderTopRightRadius: 24,
                       padding: Spacing.four, paddingBottom: Spacing.four + 16, gap: Spacing.two },
  sheetTitle:        { fontSize: 22, fontWeight: '800', marginBottom: Spacing.one },
  fieldLabel:        { fontSize: 12, fontWeight: '600', marginTop: Spacing.two },
  typeRow:           { flexDirection: 'row', gap: Spacing.two },
  typeBtn:           { flex: 1, paddingVertical: Spacing.two, borderRadius: 10,
                       borderWidth: 1.5, alignItems: 'center' },
  typeText:          { fontSize: 13, fontWeight: '500' },
  textInput:         { borderRadius: 10, borderWidth: 1,
                       paddingHorizontal: Spacing.two + 4, paddingVertical: Spacing.two,
                       fontSize: 15 },
  textInputMulti:    { height: 100 },
  errorText:         { fontSize: 12, color: '#d33', textAlign: 'center' },
  submitBtn:         { borderRadius: 50, paddingVertical: Spacing.two + 6,
                       alignItems: 'center', marginTop: Spacing.two },
  submitBtnDisabled: { opacity: 0.45 },
  submitBtnText:     { fontSize: 16, fontWeight: '700', color: '#ffffff' },
  centered:          { alignItems: 'center', paddingVertical: Spacing.five, gap: Spacing.three },
  successIcon:       { fontSize: 48 },
  successTitle:      { fontSize: 24, fontWeight: '800' },
  successBody:       { fontSize: 15, textAlign: 'center' },
});

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

type ThemeColors = ReturnType<typeof useTheme>['colors'];

// Slide 1 — Today: mini streak card + shortcut pills
function TodayVisual({ colors }: { colors: ThemeColors }) {
  return (
    <View style={s.todayWrap}>
      <View style={[s.streakCard, { backgroundColor: colors.backgroundElement }]}>
        <Text style={s.streakFlame}>🔥</Text>
        <Text style={[s.streakNum, { color: colors.text }]}>7</Text>
        <Text style={[s.streakLabel, { color: colors.textSecondary }]}>day streak</Text>
      </View>
      <View style={s.pillRow}>
        <View style={[s.pill, { backgroundColor: colors.primary + '22' }]}>
          <Text style={[s.pillText, { color: colors.primary }]}>📖 Journal</Text>
        </View>
        <View style={[s.pill, { backgroundColor: colors.primary + '22' }]}>
          <Text style={[s.pillText, { color: colors.primary }]}>🎡 Emotions</Text>
        </View>
      </View>
    </View>
  );
}

// Slide 2 — Journal: template cards
const TEMPLATE_LABELS = [
  { icon: '✏️', label: 'Free Write' },
  { icon: '🙏', label: 'Gratitude' },
  { icon: '🔄', label: 'Reframe' },
];
function JournalVisual({ colors }: { colors: ThemeColors }) {
  return (
    <View style={s.templateWrap}>
      {TEMPLATE_LABELS.map((t, i) => (
        <View
          key={i}
          style={[s.templateCard, { backgroundColor: colors.backgroundElement }]}
        >
          <Text style={s.templateIcon}>{t.icon}</Text>
          <Text style={[s.templateLabel, { color: colors.text }]}>{t.label}</Text>
        </View>
      ))}
    </View>
  );
}

// Slide 3 — Emotions: mini Plutchik-style colour arcs
const WHEEL_SEGMENTS = [
  '#ef5350', '#e57373', '#ef9a9a',
  '#ff7043', '#ff8a65', '#ffccbc',
  '#ffa726', '#ffb74d', '#ffe0b2',
  '#ffee58', '#fff176', '#fff9c4',
  '#66bb6a', '#81c784', '#c8e6c9',
  '#26c6da', '#4dd0e1', '#b2ebf2',
  '#42a5f5', '#64b5f6', '#bbdefb',
  '#7e57c2', '#9575cd', '#d1c4e9',
];
function EmotionsVisual({ colors: _colors }: { colors: ThemeColors }) {
  const cx = 68, cy = 68, outerR = 64, innerR = 28;
  const count = WHEEL_SEGMENTS.length;
  const angle = (2 * Math.PI) / count;

  const paths = WHEEL_SEGMENTS.map((fill, i) => {
    const startA = i * angle - Math.PI / 2;
    const endA   = startA + angle;
    const x1o = cx + outerR * Math.cos(startA);
    const y1o = cy + outerR * Math.sin(startA);
    const x2o = cx + outerR * Math.cos(endA);
    const y2o = cy + outerR * Math.sin(endA);
    const x1i = cx + innerR * Math.cos(endA);
    const y1i = cy + innerR * Math.sin(endA);
    const x2i = cx + innerR * Math.cos(startA);
    const y2i = cy + innerR * Math.sin(startA);
    const d = `M${x1o},${y1o} A${outerR},${outerR} 0 0,1 ${x2o},${y2o} L${x1i},${y1i} A${innerR},${innerR} 0 0,0 ${x2i},${y2i} Z`;
    return { d, fill };
  });

  // Use View-based fallback if SVG unavailable; rely on react-native-svg already in project
  const Svg = require('react-native-svg').Svg;
  const Path = require('react-native-svg').Path;

  return (
    <View style={s.wheelWrap}>
      <Svg width={136} height={136} viewBox="0 0 136 136">
        {paths.map((p, i) => (
          <Path key={i} d={p.d} fill={p.fill} opacity={0.85} />
        ))}
      </Svg>
    </View>
  );
}

// Slide 4 — Insights: mini bar chart
const BAR_HEIGHTS = [40, 60, 30, 80, 55, 70, 45];
const BAR_LABELS  = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
function InsightsVisual({ colors }: { colors: ThemeColors }) {
  return (
    <View style={s.chartWrap}>
      {BAR_HEIGHTS.map((h, i) => (
        <View key={i} style={s.barCol}>
          <View
            style={[
              s.bar,
              { height: h, backgroundColor: colors.primary, opacity: 0.6 + i * 0.06 },
            ]}
          />
          <Text style={[s.barLabel, { color: colors.textSecondary }]}>{BAR_LABELS[i]}</Text>
        </View>
      ))}
    </View>
  );
}

// ─── Slide visual router ──────────────────────────────────────────────────────
function SlideVisual({ page, colors }: { page: number; colors: ThemeColors }) {
  switch (page) {
    case 0: return <WelcomeVisual />;
    case 1: return <TodayVisual colors={colors} />;
    case 2: return <JournalVisual colors={colors} />;
    case 3: return <EmotionsVisual colors={colors} />;
    case 4: return <InsightsVisual colors={colors} />;
    default: return null;
  }
}

// ─── Main modal ───────────────────────────────────────────────────────────────
export function OnboardingModal() {
  const { colors }            = useTheme();
  const t                     = useTranslation();
  const { locale, setLocale } = useLocale();
  const { isHelpVisible, hideHelp } = useHelp();

  const [firstLaunch,     setFirstLaunch]     = useState(false);
  const [page,            setPage]            = useState(0);
  const [feedbackVisible, setFeedbackVisible] = useState(false);

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

          <TouchableOpacity onPress={() => setFeedbackVisible(true)} activeOpacity={0.7} style={s.reportBtn}>
            <Text style={[s.reportTxt, { color: colors.textSecondary }]}>
              {t.onboarding.reportIssue}
            </Text>
          </TouchableOpacity>
        </View>

      </View>

      <FeedbackModal visible={feedbackVisible} onClose={() => setFeedbackVisible(false)} />
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

  // Today
  todayWrap:     { alignItems: 'center', gap: Spacing.two },
  streakCard:    { borderRadius: 18, paddingHorizontal: Spacing.five, paddingVertical: Spacing.two,
                   alignItems: 'center', flexDirection: 'row', gap: Spacing.two },
  streakFlame:   { fontSize: 28 },
  streakNum:     { fontSize: 36, fontWeight: '800', lineHeight: 42 },
  streakLabel:   { fontSize: 12, fontWeight: '600' },
  pillRow:       { flexDirection: 'row', gap: Spacing.two },
  pill:          { borderRadius: 50, paddingHorizontal: Spacing.three, paddingVertical: Spacing.one + 2 },
  pillText:      { fontSize: 13, fontWeight: '700' },

  // Journal templates
  templateWrap:  { gap: Spacing.one + 2 },
  templateCard:  { flexDirection: 'row', alignItems: 'center', gap: Spacing.two,
                   borderRadius: 12, paddingHorizontal: Spacing.three,
                   paddingVertical: Spacing.one + 4, width: 180 },
  templateIcon:  { fontSize: 20 },
  templateLabel: { fontSize: 14, fontWeight: '600' },

  // Emotions wheel
  wheelWrap:     { alignItems: 'center', justifyContent: 'center' },

  // Insights chart
  chartWrap:     { flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: 90 },
  barCol:        { alignItems: 'center', gap: 4 },
  bar:           { width: 20, borderRadius: 5 },
  barLabel:      { fontSize: 10, fontWeight: '600' },

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
