/**
 * GroundScreen — 5-4-3-2-1 grounding technique.
 * Walks the user through 5 steps, one sense at a time.
 * No data tracking; pure guided exercise.
 */

import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Screen, ScreenHeader } from '@/components/ui/Screen';
import { Spacing, TAB_BAR_CLEARANCE } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { AUTOSTART_PARAM, decideQuickLaunch } from '@/lib/quick-launch';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

// Maps each grounding step (by count: 5,4,3,2,1) to a sense-appropriate icon
const STEP_ICONS: Record<number, IoniconsName> = {
  5: 'eye-outline',          // 5 things you can SEE
  4: 'hand-left-outline',    // 4 things you can TOUCH
  3: 'ear-outline',          // 3 things you can HEAR
  2: 'rose-outline',         // 2 things you can SMELL
  1: 'restaurant-outline',   // 1 thing you can TASTE
};

export default function GroundScreen() {
  const { colors } = useTheme();
  const t = useTranslation();
  const g = t.ground;
  const insets = useSafeAreaInsets();
  const bottomPad = TAB_BAR_CLEARANCE + insets.bottom;
  const params = useLocalSearchParams();

  const steps = g.steps as readonly {
    count: number; sense: string; instruction: string; tip: string;
  }[];

  const [stepIndex, setStepIndex]   = useState(0);
  const [completed, setCompleted]   = useState(false);

  const step    = steps[stepIndex];
  const isLast  = stepIndex === steps.length - 1;

  const handleNext = () => {
    if (isLast) {
      setCompleted(true);
    } else {
      setStepIndex((i) => i + 1);
    }
  };

  const handleReset = () => {
    setStepIndex(0);
    setCompleted(false);
  };

  /* ── Quick Launch ──
   * `autostart=1` (see src/lib/quick-launch.ts) opens at step 1 unless a run
   * is already under way, in which case it resumes where it was left. The
   * param is cleared straight away so coming back to this tab later doesn't
   * reset it again.
   */
  const autostart = params[AUTOSTART_PARAM];
  useEffect(() => {
    const decision = decideQuickLaunch({
      route: '/ground',
      params: { [AUTOSTART_PARAM]: autostart },
      exerciseState: completed ? 'finished' : stepIndex > 0 ? 'in-progress' : 'not-started',
    });
    if (!decision.isQuickLaunch) return;
    const id = setTimeout(() => {
      router.setParams({ [AUTOSTART_PARAM]: undefined });
      if (decision.action === 'restart') handleReset();
    }, 0);
    return () => clearTimeout(id);
    // stepIndex/completed are read, not watched: the decision is made once per link.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autostart]);

  // ── Completion screen ──────────────────────────────────────────────────────
  if (completed) {
    return (
      <Screen style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
        <View style={s.completeWrap}>
          <Ionicons
            name="checkmark-circle-outline"
            size={72}
            color={colors.primary}
            accessibilityLabel={g.complete.title}
          />
          <Text style={[s.completeTitle, { color: colors.text }]}>{g.complete.title}</Text>
          <Text style={[s.completeBody,  { color: colors.textSecondary }]}>{g.complete.body}</Text>

          <TouchableOpacity
            style={[s.btn, { backgroundColor: colors.primary }]}
            onPress={handleReset}
            activeOpacity={0.85}
          >
            <Text style={s.btnText}>{g.complete.again}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.btnOutline, { borderColor: colors.backgroundSelected }]}
            onPress={() => router.navigate('/')}
            activeOpacity={0.75}
          >
            <Text style={[s.btnOutlineText, { color: colors.textSecondary }]}>{g.complete.back}</Text>
          </TouchableOpacity>
        </View>
      </Screen>
    );
  }

  // ── Step screen ────────────────────────────────────────────────────────────
  return (
    <Screen>
      <TouchableOpacity
        style={[s.exitButton, { top: insets.top + Spacing.two, backgroundColor: colors.backgroundElement }]}
        onPress={() => router.navigate('/')}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={g.exit}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="close" size={22} color={colors.text} />
      </TouchableOpacity>

      <ScreenHeader variant="immersive">
        <Text style={[s.title,    { color: colors.text }]}>{g.title}</Text>
        <Text style={[s.subtitle, { color: colors.textSecondary }]}>{g.subtitle}</Text>
      </ScreenHeader>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scroll, { paddingBottom: bottomPad }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Intro — only on step 0 */}
        {stepIndex === 0 && (
          <View style={[s.introCard, { backgroundColor: colors.backgroundElement }]}>
            <Text style={[s.introText, { color: colors.textSecondary }]}>{g.intro}</Text>
          </View>
        )}

        {/* Progress dots */}
        <View style={s.dotsRow}>
          {steps.map((_, i) => (
            <View
              key={i}
              style={[
                s.dot,
                {
                  backgroundColor: i <= stepIndex ? colors.primary : colors.backgroundSelected,
                  width: i === stepIndex ? 20 : 8,
                },
              ]}
            />
          ))}
        </View>

        {/* Step card */}
        <View style={[s.stepCard, { backgroundColor: colors.backgroundElement }]}>
          {/* Big count bubble */}
          <View style={[s.countBubble, { backgroundColor: colors.primary + '22' }]}>
            <Text style={[s.countNum, { color: colors.primary }]}>{step.count}</Text>
            <Ionicons
              name={STEP_ICONS[step.count] ?? 'ellipse-outline'}
              size={22}
              color={colors.primary}
              accessibilityLabel={step.sense}
            />
          </View>

          <Text style={[s.senseLabel,   { color: colors.textSecondary }]}>{step.sense}</Text>
          <Text style={[s.instruction,  { color: colors.text }]}>{step.instruction}</Text>
          <Text style={[s.tip,          { color: colors.textSecondary }]}>{step.tip}</Text>
        </View>

        {/* Next / Done button */}
        <TouchableOpacity
          style={[s.btn, { backgroundColor: colors.primary }]}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={s.btnText}>
            {isLast ? g.done : g.next}
          </Text>
        </TouchableOpacity>

        {/* Info card — only on last step */}
        {isLast && (
          <View style={[s.infoCard, { backgroundColor: colors.backgroundElement }]}>
            <Text style={[s.infoText, { color: colors.textSecondary }]}>{g.infoText}</Text>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  exitButton:  { position: 'absolute', right: Spacing.four, zIndex: 10,
                 width: 40, height: 40, borderRadius: 20,
                 alignItems: 'center', justifyContent: 'center' },

  scroll:      { flexGrow: 1, justifyContent: 'center', paddingHorizontal: Spacing.three },

  title:       { fontSize: 28, fontWeight: '700', letterSpacing: -0.5, textAlign: 'center' },
  subtitle:    { fontSize: 16, fontWeight: '500', textAlign: 'center' },

  introCard:   { borderRadius: 16, padding: Spacing.three, marginBottom: Spacing.three },
  introText:   { fontSize: 16, lineHeight: 24, fontWeight: '500' },

  dotsRow:     { flexDirection: 'row', gap: 6, alignItems: 'center',
                 justifyContent: 'center', marginBottom: Spacing.three },
  dot:         { height: 8, borderRadius: 4 },

  stepCard:    { borderRadius: 20, padding: Spacing.four, alignItems: 'center',
                 gap: Spacing.two, marginBottom: Spacing.three },
  countBubble: { width: 96, height: 96, borderRadius: 48, alignItems: 'center',
                 justifyContent: 'center', gap: 2, marginBottom: Spacing.one },
  countNum:    { fontSize: 40, fontWeight: '800', lineHeight: 44 },

  senseLabel:  { fontSize: 14, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.2 },
  instruction: { fontSize: 24, fontWeight: '700', textAlign: 'center', lineHeight: 33 },
  tip:         { fontSize: 16, lineHeight: 24, textAlign: 'center', fontWeight: '500', maxWidth: 300 },

  btn:         { borderRadius: 50, paddingVertical: Spacing.two + 4,
                 alignItems: 'center', marginBottom: Spacing.two },
  btnText:     { fontSize: 17, fontWeight: '700', color: '#ffffff' },

  btnOutline:  { borderRadius: 50, borderWidth: 1.5, paddingVertical: Spacing.two + 4,
                 alignItems: 'center' },
  btnOutlineText: { fontSize: 16, fontWeight: '600' },

  infoCard:    { borderRadius: 16, padding: Spacing.three },
  infoText:    { fontSize: 15, lineHeight: 22, textAlign: 'center', fontWeight: '500' },

  // Completion
  completeWrap:  { flex: 1, justifyContent: 'center', alignItems: 'center',
                   paddingHorizontal: Spacing.four, gap: Spacing.three },
  completeTitle: { fontSize: 30, fontWeight: '800', letterSpacing: -0.5, textAlign: 'center' },
  completeBody:  { fontSize: 16, lineHeight: 24, textAlign: 'center', fontWeight: '500', maxWidth: 320 },
});
