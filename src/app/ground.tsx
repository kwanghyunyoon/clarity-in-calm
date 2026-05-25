/**
 * GroundScreen — 5-4-3-2-1 grounding technique.
 * Walks the user through 5 steps, one sense at a time.
 * No data tracking; pure guided exercise.
 */

import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';

export default function GroundScreen() {
  const colors = useTheme();
  const t = useTranslation();
  const g = t.ground;

  const steps = g.steps as readonly {
    count: number; emoji: string; sense: string; instruction: string; tip: string;
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

  // ── Completion screen ──────────────────────────────────────────────────────
  if (completed) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={[s.root, { backgroundColor: colors.background }]}>
        <View style={s.completeWrap}>
          <Text style={s.completeEmoji}>{g.complete.emoji}</Text>
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
            onPress={() => router.back()}
            activeOpacity={0.75}
          >
            <Text style={[s.btnOutlineText, { color: colors.textSecondary }]}>{g.complete.back}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Step screen ────────────────────────────────────────────────────────────
  return (
    <SafeAreaView edges={['top', 'bottom']} style={[s.root, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={s.header}>
          <Text style={[s.title,    { color: colors.text }]}>{g.title}</Text>
          <Text style={[s.subtitle, { color: colors.textSecondary }]}>{g.subtitle}</Text>
        </View>

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
            <Text style={[s.countNum,   { color: colors.primary }]}>{step.count}</Text>
            <Text style={[s.countEmoji, { color: colors.primary }]}>{step.emoji}</Text>
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
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root:        { flex: 1 },
  scroll:      { paddingHorizontal: Spacing.three, paddingBottom: Spacing.six },

  header:      { paddingTop: Spacing.three, paddingBottom: Spacing.two, gap: Spacing.half },
  title:       { fontSize: 28, fontWeight: '700', letterSpacing: -0.5 },
  subtitle:    { fontSize: 14, fontWeight: '500' },

  introCard:   { borderRadius: 16, padding: Spacing.three, marginBottom: Spacing.three },
  introText:   { fontSize: 14, lineHeight: 21, fontWeight: '500' },

  dotsRow:     { flexDirection: 'row', gap: 6, alignItems: 'center',
                 justifyContent: 'center', marginBottom: Spacing.three },
  dot:         { height: 8, borderRadius: 4 },

  stepCard:    { borderRadius: 20, padding: Spacing.four, alignItems: 'center',
                 gap: Spacing.two, marginBottom: Spacing.three },
  countBubble: { width: 96, height: 96, borderRadius: 48, alignItems: 'center',
                 justifyContent: 'center', gap: 2, marginBottom: Spacing.one },
  countNum:    { fontSize: 40, fontWeight: '800', lineHeight: 44 },
  countEmoji:  { fontSize: 22 },
  senseLabel:  { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.2 },
  instruction: { fontSize: 22, fontWeight: '700', textAlign: 'center', lineHeight: 30 },
  tip:         { fontSize: 14, lineHeight: 21, textAlign: 'center', fontWeight: '500', maxWidth: 300 },

  btn:         { borderRadius: 50, paddingVertical: Spacing.two + 4,
                 alignItems: 'center', marginBottom: Spacing.two },
  btnText:     { fontSize: 17, fontWeight: '700', color: '#ffffff' },

  btnOutline:  { borderRadius: 50, borderWidth: 1.5, paddingVertical: Spacing.two + 4,
                 alignItems: 'center' },
  btnOutlineText: { fontSize: 16, fontWeight: '600' },

  infoCard:    { borderRadius: 16, padding: Spacing.three },
  infoText:    { fontSize: 13, lineHeight: 20, textAlign: 'center', fontWeight: '500' },

  // Completion
  completeWrap:  { flex: 1, justifyContent: 'center', alignItems: 'center',
                   paddingHorizontal: Spacing.four, gap: Spacing.three },
  completeEmoji: { fontSize: 72 },
  completeTitle: { fontSize: 30, fontWeight: '800', letterSpacing: -0.5, textAlign: 'center' },
  completeBody:  { fontSize: 16, lineHeight: 24, textAlign: 'center', fontWeight: '500', maxWidth: 320 },
});
