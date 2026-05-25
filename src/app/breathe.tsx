import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useWellness } from '@/context/wellness-context';

const PHASE_DURATIONS = [4000, 4000, 4000, 4000] as const;
const PHASE_END_SCALES = [1.00, 1.00, 0.58, 0.58] as const;
const PHASE_IDS = ['inhale', 'hold1', 'exhale', 'rest'] as const;

const CYCLE_MS = PHASE_DURATIONS.reduce((s, d) => s + d, 0); // 16 000 ms

export default function BreatheScreen() {
  const colors = useTheme();
  const t = useTranslation();
  const { addBreathingSession } = useWellness();

  // Build PHASES from translations so labels/hints are localised
  const PHASES = [
    { id: 'inhale', label: t.breathe.phases.inhale.label, hint: t.breathe.phases.inhale.hint, duration: PHASE_DURATIONS[0] },
    { id: 'hold1',  label: t.breathe.phases.hold1.label,  hint: t.breathe.phases.hold1.hint,  duration: PHASE_DURATIONS[1] },
    { id: 'exhale', label: t.breathe.phases.exhale.label, hint: t.breathe.phases.exhale.hint, duration: PHASE_DURATIONS[2] },
    { id: 'rest',   label: t.breathe.phases.rest.label,   hint: t.breathe.phases.rest.hint,   duration: PHASE_DURATIONS[3] },
  ];

  const [isRunning,  setIsRunning]  = useState(false);
  const [phaseLabel, setPhaseLabel] = useState<string>(t.breathe.ready);
  const [phaseHint,  setPhaseHint]  = useState<string>(t.breathe.tapToStart);
  const [countdown,  setCountdown]  = useState(4);
  const [rounds,     setRounds]     = useState(0);

  const scale      = useSharedValue(0.58);
  const ringScale  = useSharedValue(0.60);
  const glowOpacity = useSharedValue(0.25);

  const startTimeRef = useRef<number>(0);

  /* ── Reanimated animation ── */
  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now();

      scale.value = withRepeat(
        withSequence(
          withTiming(1.00, { duration: 4000, easing: Easing.inOut(Easing.cubic) }),
          withTiming(1.00, { duration: 4000 }),
          withTiming(0.58, { duration: 4000, easing: Easing.inOut(Easing.cubic) }),
          withTiming(0.58, { duration: 4000 }),
        ),
        -1, false,
      );

      ringScale.value = withRepeat(
        withSequence(
          withTiming(1.08, { duration: 4000, easing: Easing.inOut(Easing.cubic) }),
          withTiming(1.08, { duration: 4000 }),
          withTiming(0.62, { duration: 4000, easing: Easing.inOut(Easing.cubic) }),
          withTiming(0.62, { duration: 4000 }),
        ),
        -1, false,
      );

      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.70, { duration: 4000 }),
          withTiming(0.70, { duration: 4000 }),
          withTiming(0.25, { duration: 4000 }),
          withTiming(0.25, { duration: 4000 }),
        ),
        -1, false,
      );
    } else {
      cancelAnimation(scale);
      cancelAnimation(ringScale);
      cancelAnimation(glowOpacity);
      scale.value      = withTiming(0.58, { duration: 600 });
      ringScale.value  = withTiming(0.60, { duration: 600 });
      glowOpacity.value = withTiming(0.25, { duration: 600 });
    }

    return () => {
      cancelAnimation(scale);
      cancelAnimation(ringScale);
      cancelAnimation(glowOpacity);
    };
  }, [isRunning]);

  /* ── JS-side phase tracker ── */
  useEffect(() => {
    if (!isRunning) {
      setPhaseLabel(t.breathe.ready);
      setPhaseHint(t.breathe.tapToStart);
      setCountdown(4);
      return;
    }

    const interval = setInterval(() => {
      const elapsed  = (Date.now() - startTimeRef.current) % CYCLE_MS;
      const totalMs  = Date.now() - startTimeRef.current;

      setRounds(Math.floor(totalMs / CYCLE_MS));

      let cum = 0;
      for (const phase of PHASES) {
        cum += phase.duration;
        if (elapsed < cum) {
          setPhaseLabel(phase.label);
          setPhaseHint(phase.hint);
          setCountdown(Math.max(1, Math.ceil((cum - elapsed) / 1000)));
          break;
        }
      }
    }, 80);

    return () => clearInterval(interval);
  }, [isRunning]);

  /* ── Animated styles ── */
  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: glowOpacity.value,
  }));

  const outerGlowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value * 1.18 }],
    opacity: glowOpacity.value * 0.35,
  }));

  /* ── Toggle ── */
  const handleToggle = () => {
    if (isRunning && rounds > 0) {
      addBreathingSession();
    }
    if (isRunning) setRounds(0);
    setIsRunning((v) => !v);
  };

  return (
    <SafeAreaView edges={['top']} style={[s.root, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={s.header}>
        <Text style={[s.title,    { color: colors.text }]}>{t.breathe.title}</Text>
        <Text style={[s.subtitle, { color: colors.textSecondary }]}>{t.breathe.subtitle}</Text>
      </View>

      {/* Circle */}
      <View style={s.circleWrap}>
        {/* Outer glow */}
        <Animated.View
          style={[s.outerGlow, { borderColor: colors.accent, borderWidth: 1 }, outerGlowStyle]}
        />
        {/* Ring */}
        <Animated.View
          style={[s.ring, { borderColor: colors.primary }, ringStyle]}
        />
        {/* Main disc */}
        <Animated.View
          style={[s.disc, { backgroundColor: colors.primary }, circleStyle]}
        >
          <Text style={s.phaseText}>{phaseLabel}</Text>
          {isRunning && (
            <Text style={s.countdownText}>{countdown}</Text>
          )}
        </Animated.View>
      </View>

      {/* "Follow the circle" instruction — only before session starts */}
      {!isRunning && (
        <Text style={[s.followCircle, { color: colors.primary }]}>
          {t.breathe.followCircle}
        </Text>
      )}

      {/* Hint */}
      <Text style={[s.hint, { color: colors.textSecondary }]}>
        {isRunning ? phaseHint : t.breathe.naturalBreath}
      </Text>

      {/* Rounds counter */}
      {rounds > 0 && (
        <Text style={[s.rounds, { color: colors.textSecondary }]}>
          {t.breathe.round} {rounds + 1}
        </Text>
      )}

      {/* Button */}
      <TouchableOpacity
        style={[
          s.button,
          { backgroundColor: isRunning ? colors.backgroundElement : colors.primary },
        ]}
        onPress={handleToggle}
        activeOpacity={0.8}
      >
        <Text style={[s.buttonText, { color: isRunning ? colors.text : '#ffffff' }]}>
          {isRunning ? t.breathe.endSession : t.breathe.startBreathing}
        </Text>
      </TouchableOpacity>

      {/* Info card */}
      <View style={[s.infoCard, { backgroundColor: colors.backgroundElement }]}>
        <Text style={[s.infoText, { color: colors.textSecondary }]}>
          {t.breathe.infoText}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const DISC_SIZE  = 200;
const RING_SIZE  = DISC_SIZE + 32;
const GLOW_SIZE  = DISC_SIZE + 72;

const s = StyleSheet.create({
  root:          { flex: 1, alignItems: 'center', paddingHorizontal: Spacing.three },
  header:        { alignItems: 'center', paddingTop: Spacing.four, paddingBottom: Spacing.three, gap: Spacing.half },
  title:         { fontSize: 28, fontWeight: '700', letterSpacing: -0.5 },
  subtitle:      { fontSize: 14, fontWeight: '500' },

  circleWrap:    { width: GLOW_SIZE, height: GLOW_SIZE, alignItems: 'center', justifyContent: 'center', marginVertical: Spacing.five },

  outerGlow:     { position: 'absolute', width: GLOW_SIZE, height: GLOW_SIZE, borderRadius: GLOW_SIZE / 2 },
  ring:          { position: 'absolute', width: RING_SIZE, height: RING_SIZE, borderRadius: RING_SIZE / 2, borderWidth: 2 },
  disc:          { width: DISC_SIZE,  height: DISC_SIZE, borderRadius: DISC_SIZE / 2,
                   alignItems: 'center', justifyContent: 'center', gap: 6 },

  phaseText:     { fontSize: 18, fontWeight: '700', color: '#ffffff', letterSpacing: 0.5 },
  countdownText: { fontSize: 42, fontWeight: '300', color: 'rgba(255,255,255,0.85)', lineHeight: 46 },

  followCircle:  { fontSize: 13, fontWeight: '600', textAlign: 'center',
                   marginTop: -Spacing.three, marginBottom: Spacing.two,
                   paddingHorizontal: Spacing.four },
  hint:          { fontSize: 14, fontWeight: '500', marginTop: -Spacing.three },
  rounds:        { fontSize: 13, fontWeight: '600', marginTop: Spacing.two },

  button:        { marginTop: Spacing.four, paddingHorizontal: Spacing.five, paddingVertical: Spacing.two + 4,
                   borderRadius: 50, minWidth: 180, alignItems: 'center' },
  buttonText:    { fontSize: 16, fontWeight: '700' },

  infoCard:      { marginTop: Spacing.four, borderRadius: 16, padding: Spacing.three,
                   marginHorizontal: Spacing.three },
  infoText:      { fontSize: 13, lineHeight: 20, textAlign: 'center', fontWeight: '500' },
});
