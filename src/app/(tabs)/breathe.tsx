import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { Screen, ScreenHeader } from '@/components/ui/Screen';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useWellness } from '@/context/wellness-context';
import {
  CYCLE_MS,
  DISC_SCALE,
  getOpennessAtTime,
  getPhaseAtTime,
  getPhaseCountdownAtTime,
  getTickAtTime,
  GLOW_OPACITY,
  PHASE_DURATIONS,
  RING_SCALE,
} from '@/lib/breathing';


export default function BreatheScreen() {
  const { colors } = useTheme();
  const t = useTranslation();
  const { addBreathingSession } = useWellness();

  // Build PHASES from translations so labels/hints are localised
    const PHASES = [
    { id: 'inhale', label: t.breathe.phases.inhale.label, hint: t.breathe.phases.inhale.hint, duration: PHASE_DURATIONS[0] },
    { id: 'hold1',  label: t.breathe.phases.hold1.label,  hint: t.breathe.phases.hold1.hint,  duration: PHASE_DURATIONS[1] },
    { id: 'exhale', label: t.breathe.phases.exhale.label, hint: t.breathe.phases.exhale.hint, duration: PHASE_DURATIONS[2] },
    { id: 'rest',   label: t.breathe.phases.rest.label,   hint: t.breathe.phases.rest.hint,   duration: PHASE_DURATIONS[3] },
  ];

  const [isRunning, setIsRunning] = useState(false);
  const [rounds,    setRounds]    = useState(0);
  // Whole second of the cycle, 0…15. The single source of truth for the label,
  // the hint and the countdown — all three are derived from it below.
  const [tick,      setTick]      = useState(0);

  /* ── The one clock ──
   * `progress` runs 0 → CYCLE_MS linearly and repeats. The disc, ring, glow and
   * label are every one of them derived from it, so they cannot drift apart.
   * `restBlend` (0 = breathing, 1 = settled) eases the circle back to its resting
   * size when the session stops, without needing a second animation of its own.
   */
  const progress  = useSharedValue(0);
  const restBlend = useSharedValue(1);

  const prevTickRef = useRef(-1);

  const handleTick = useCallback((next: number) => {
    // The clock wrapped past the end of a cycle: one more round completed.
    if (prevTickRef.current > next) setRounds((r) => r + 1);
    prevTickRef.current = next;
    setTick(next);
  }, []);

  useEffect(() => {
    if (isRunning) {
      progress.value = 0;
      restBlend.value = withTiming(0, { duration: 400 });
      progress.value = withRepeat(
        withTiming(CYCLE_MS, { duration: CYCLE_MS, easing: Easing.linear }),
        -1,
        false,
      );
    } else {
      cancelAnimation(progress);
      restBlend.value = withTiming(1, { duration: 600 });
    }

    return () => {
      cancelAnimation(progress);
    };
  }, [isRunning, progress, restBlend]);

  /* ── Label tracker ──
   * Reads the same clock the animation does, and only crosses to the JS thread
   * when the whole second changes — once a second, not once a frame.
   */
  useAnimatedReaction(
    () => getTickAtTime(progress.value),
    (current, previous) => {
      if (current !== previous) runOnJS(handleTick)(current);
    },
  );

  /* ── Derived from the clock ── */
  const phase = PHASES.find((p) => p.id === getPhaseAtTime(tick * 1000))!;
  const phaseLabel = isRunning ? phase.label : t.breathe.ready;
  const phaseHint  = isRunning ? phase.hint  : t.breathe.tapToStart;
  const countdown  = getPhaseCountdownAtTime(tick * 1000);

  /* ── Animated styles ── */
  const circleStyle = useAnimatedStyle(() => {
    const openness = getOpennessAtTime(progress.value) * (1 - restBlend.value);
    return {
      transform: [{ scale: interpolate(openness, [0, 1], [DISC_SCALE.min, DISC_SCALE.max]) }],
    };
  });

  const ringStyle = useAnimatedStyle(() => {
    const openness = getOpennessAtTime(progress.value) * (1 - restBlend.value);
    return {
      transform: [{ scale: interpolate(openness, [0, 1], [RING_SCALE.min, RING_SCALE.max]) }],
      opacity: interpolate(openness, [0, 1], [GLOW_OPACITY.min, GLOW_OPACITY.max]),
    };
  });

  const outerGlowStyle = useAnimatedStyle(() => {
    const openness = getOpennessAtTime(progress.value) * (1 - restBlend.value);
    return {
      transform: [
        { scale: interpolate(openness, [0, 1], [RING_SCALE.min, RING_SCALE.max]) * 1.18 },
      ],
      opacity: interpolate(openness, [0, 1], [GLOW_OPACITY.min, GLOW_OPACITY.max]) * 0.35,
    };
  });

  /* ── Toggle ── */
  const handleToggle = () => {
    if (isRunning && rounds > 0) {
      addBreathingSession();
    }
    setRounds(0);
    if (!isRunning) {
      // Rewind the label to the top of the cycle before the clock restarts.
      prevTickRef.current = -1;
      setTick(0);
    }
    setIsRunning((v) => !v);
  };

  return (
    <Screen style={s.root}>
      <ScreenHeader variant="immersive">
        <Text style={[s.title,    { color: colors.text }]}>{t.breathe.title}</Text>
        <Text style={[s.subtitle, { color: colors.textSecondary }]}>{t.breathe.subtitle}</Text>
      </ScreenHeader>

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

      <View style={s.textStack}>
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
      </View>

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
    </Screen>
  );
}

const DISC_SIZE  = 200;
const RING_SIZE  = DISC_SIZE + 32;
const GLOW_SIZE  = DISC_SIZE + 72;

const s = StyleSheet.create({
  root:          { alignItems: 'center', justifyContent: 'center' },
  title:         { fontSize: 28, fontWeight: '700', letterSpacing: -0.5 },
  subtitle:      { fontSize: 16, fontWeight: '500' },

  circleWrap:    { width: GLOW_SIZE, height: GLOW_SIZE, alignItems: 'center', justifyContent: 'center', marginVertical: Spacing.five },

  outerGlow:     { position: 'absolute', width: GLOW_SIZE, height: GLOW_SIZE, borderRadius: GLOW_SIZE / 2 },
  ring:          { position: 'absolute', width: RING_SIZE, height: RING_SIZE, borderRadius: RING_SIZE / 2, borderWidth: 2 },
  disc:          { width: DISC_SIZE,  height: DISC_SIZE, borderRadius: DISC_SIZE / 2,
                   alignItems: 'center', justifyContent: 'center', gap: 6 },

  phaseText:     { fontSize: 18, fontWeight: '700', color: '#ffffff', letterSpacing: 0.5 },
  countdownText: { fontSize: 42, fontWeight: '300', color: 'rgba(255,255,255,0.85)', lineHeight: 46 },

  textStack:     { alignItems: 'center', gap: Spacing.two, marginTop: -Spacing.two },
  followCircle:  { fontSize: 15, fontWeight: '600', textAlign: 'center',
                   paddingHorizontal: Spacing.four },
  hint:          { fontSize: 16, fontWeight: '500', textAlign: 'center' },
  rounds:        { fontSize: 15, fontWeight: '600' },

  button:        { marginTop: Spacing.four, paddingHorizontal: Spacing.five, paddingVertical: Spacing.two + 4,
                   borderRadius: 50, minWidth: 180, alignItems: 'center' },
  buttonText:    { fontSize: 16, fontWeight: '700' },

  infoCard:      { marginTop: Spacing.four, borderRadius: 16, padding: Spacing.three,
                   marginHorizontal: Spacing.three },
  infoText:      { fontSize: 15, lineHeight: 22, textAlign: 'center', fontWeight: '500' },
});
