import React, { useMemo } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { BorderRadius, EmotionColors, Spacing, TAB_BAR_CLEARANCE } from '@/constants/theme';
import { useEmotions } from '@/context/emotion-context';
import { useWellness } from '@/context/wellness-context';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import {
  computeAvgIntensity,
  computeDayMoods,
  computeMoodDistribution,
  computeTimeOfDay,
  computeTopEmotion,
  computeTriggerCounts,
  getLast7Days,
} from '@/lib/insights-analytics';

export default function InsightsScreen() {
  const { colors } = useTheme();
  const t = useTranslation();
  const ti = t.insightsScreen;
  const insets = useSafeAreaInsets();
  const { entries, streak } = useWellness();
  const { emotionLogs } = useEmotions();

  const bottomPad = TAB_BAR_CLEARANCE + insets.bottom;

  const last7Days = useMemo(() => getLast7Days(), []);

  // ── Stats
  const avgIntensity = useMemo(() => computeAvgIntensity(emotionLogs), [emotionLogs]);

  // ── Top emotion
  const topEmotion = useMemo(
    () => computeTopEmotion(emotionLogs, colors.primary),
    [emotionLogs, colors.primary],
  );

  // ── Top context triggers
  const triggerCounts = useMemo(() => computeTriggerCounts(emotionLogs), [emotionLogs]);

  // ── Time of day distribution
  const timeOfDay = useMemo(() => computeTimeOfDay(emotionLogs), [emotionLogs]);

  const maxTime = Math.max(...Object.values(timeOfDay), 1);

  // ── 7-day mood
  const dayMoods = useMemo(() => computeDayMoods(entries, last7Days), [entries, last7Days]);

  // ── Mood distribution
  const moodDist = useMemo(() => computeMoodDistribution(entries), [entries]);

  const moods = t.moods;

  if (entries.length === 0 && emotionLogs.length === 0) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing.two, borderBottomColor: colors.border, backgroundColor: colors.background }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{ti.title}</Text>
          <Text style={[styles.headerSub, { color: colors.textSecondary }]}>{ti.subtitle}</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>✨</Text>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>{ti.empty.title}</Text>
          <Text style={[styles.emptyBody, { color: colors.textSecondary }]}>{ti.empty.body}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.two, borderBottomColor: colors.border, backgroundColor: colors.background }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{ti.title}</Text>
        <Text style={[styles.headerSub, { color: colors.textSecondary }]}>{ti.subtitle}</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Monthly summary cards ── */}
        <Animated.View entering={FadeInDown.delay(50).springify()} style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.statNum, { color: colors.primary }]}>{entries.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{ti.totalEntries}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.statNum, { color: colors.primary }]}>{emotionLogs.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{ti.totalEmotions}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.statNum, { color: colors.primary }]}>{streak}🔥</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{ti.streakRecord}</Text>
          </View>
          {emotionLogs.length > 0 && (
            <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.statNum, { color: colors.primary }]}>{avgIntensity.toFixed(1)}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{ti.avgIntensity}</Text>
            </View>
          )}
        </Animated.View>

        {/* ── Top emotion ── */}
        {topEmotion && (
          <Animated.View entering={FadeInDown.delay(100).springify()} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.textSecondary }]}>{ti.topEmotion}</Text>
            <View style={styles.topEmotionRow}>
              <View style={[styles.emotionColorDot, { backgroundColor: topEmotion.color }]} />
              <Text style={[styles.topEmotionName, { color: colors.text }]}>{topEmotion.label}</Text>
            </View>
          </Animated.View>
        )}

        {/* ── 7-day mood chart ── */}
        <Animated.View entering={FadeInDown.delay(130).springify()} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.textSecondary }]}>{ti.last7}</Text>
          <View style={styles.chart}>
            {dayMoods.map((mood, i) => {
              const moodDef = mood ? moods.find(m => m.value === Math.round(mood)) : null;
              const barHeight = mood ? (mood / 5) * 60 : 4;
              return (
                <View key={i} style={styles.chartCol}>
                  {mood ? (
                    <View
                      style={[styles.bar, { height: barHeight, backgroundColor: moodDef?.color ?? colors.primary }]}
                    />
                  ) : (
                    <View style={[styles.bar, { height: 4, backgroundColor: colors.backgroundElement }]} />
                  )}
                  <Text style={[styles.chartDayLabel, { color: colors.textSecondary }]}>
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][new Date(last7Days[i]).getDay()]}
                  </Text>
                </View>
              );
            })}
          </View>
          <Text style={[styles.chartLegend, { color: colors.textSecondary }]}>{ti.chartLegend}</Text>
        </Animated.View>

        {/* ── Mood breakdown ── */}
        {entries.length > 0 && (
          <Animated.View entering={FadeInDown.delay(160).springify()} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.textSecondary }]}>{ti.moodBreakdown}</Text>
            <View style={styles.moodDist}>
              {moodDist.map((d, i) => (
                <View key={i} style={styles.moodDistRow}>
                  <Text style={styles.moodDistEmoji}>{moods[i].emoji}</Text>
                  <View style={[styles.moodDistTrack, { backgroundColor: colors.backgroundElement }]}>
                    <View
                      style={[styles.moodDistFill, { width: `${d.pct * 100}%`, backgroundColor: moods[i].color }]}
                    />
                  </View>
                  <Text style={[styles.moodDistCount, { color: colors.textSecondary }]}>{d.count}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        )}

        {/* ── Time of day ── */}
        {emotionLogs.length > 0 && (
          <Animated.View entering={FadeInDown.delay(190).springify()} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.textSecondary }]}>{ti.timeOfDay}</Text>
            <View style={styles.timeChart}>
              {([ 'morning', 'afternoon', 'evening', 'night'] as const).map(period => {
                const count = timeOfDay[period];
                const pct = count / maxTime;
                const labels: Record<string, string> = {
                  morning: ti.morning,
                  afternoon: ti.afternoon,
                  evening: ti.evening,
                  night: ti.night,
                };
                const emojis: Record<string, string> = { morning: '🌅', afternoon: '☀️', evening: '🌆', night: '🌙' };
                return (
                  <View key={period} style={styles.timeCol}>
                    <View style={styles.timeBarWrapper}>
                      <View
                        style={[styles.timeBar, {
                          height: Math.max(pct * 80, 4),
                          backgroundColor: pct > 0 ? colors.primary : colors.backgroundElement,
                        }]}
                      />
                    </View>
                    <Text style={styles.timeEmoji}>{emojis[period]}</Text>
                    <Text style={[styles.timeLabel, { color: colors.textSecondary }]}>{labels[period]}</Text>
                    <Text style={[styles.timeCount, { color: colors.text }]}>{count}</Text>
                  </View>
                );
              })}
            </View>
          </Animated.View>
        )}

        {/* ── Trigger analysis ── */}
        {triggerCounts.length > 0 && (
          <Animated.View entering={FadeInDown.delay(220).springify()} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.textSecondary }]}>{ti.triggers}</Text>
            {triggerCounts.map(([tag, count]) => {
              const pct = count / (triggerCounts[0][1] || 1);
              return (
                <View key={tag} style={styles.triggerRow}>
                  <Text style={[styles.triggerTag, { color: colors.text }]}>{tag}</Text>
                  <View style={[styles.triggerTrack, { backgroundColor: colors.backgroundElement }]}>
                    <View style={[styles.triggerFill, { width: `${pct * 100}%`, backgroundColor: colors.accent }]} />
                  </View>
                  <Text style={[styles.triggerCount, { color: colors.textSecondary }]}>{count}</Text>
                </View>
              );
            })}
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.two + 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 2,
  },
  headerTitle: { fontSize: 24, fontWeight: '700', letterSpacing: -0.5, marginLeft: Spacing.six },
  headerSub: { fontSize: 14, marginLeft: Spacing.six },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: Spacing.three,
  },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  statCard: {
    flex: 1,
    minWidth: '45%',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.three,
    alignItems: 'center',
    gap: 4,
  },
  statNum: { fontSize: 28, fontWeight: '700', letterSpacing: -1 },
  statLabel: { fontSize: 12, textAlign: 'center' },
  card: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.three,
    gap: Spacing.two + 4,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  topEmotionRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  emotionColorDot: { width: 14, height: 14, borderRadius: 7 },
  topEmotionName: { fontSize: 20, fontWeight: '700' },
  chart: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.two, height: 72 },
  chartCol: { flex: 1, alignItems: 'center', gap: 4, justifyContent: 'flex-end' },
  bar: { width: '100%', borderRadius: BorderRadius.sm, minHeight: 4 },
  chartDayLabel: { fontSize: 11, fontWeight: '500' },
  chartLegend: { fontSize: 12, fontStyle: 'italic' },
  moodDist: { gap: Spacing.two },
  moodDistRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  moodDistEmoji: { fontSize: 18, width: 24, textAlign: 'center' },
  moodDistTrack: { flex: 1, height: 8, borderRadius: BorderRadius.pill, overflow: 'hidden' },
  moodDistFill: { height: '100%', borderRadius: BorderRadius.pill },
  moodDistCount: { fontSize: 12, width: 24, textAlign: 'right' },
  timeChart: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.two },
  timeCol: { flex: 1, alignItems: 'center', gap: 4 },
  timeBarWrapper: { height: 88, justifyContent: 'flex-end' },
  timeBar: { width: 28, borderRadius: BorderRadius.md },
  timeEmoji: { fontSize: 16 },
  timeLabel: { fontSize: 11, textAlign: 'center' },
  timeCount: { fontSize: 13, fontWeight: '700' },
  triggerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  triggerTag: { fontSize: 13, fontWeight: '500', width: 100 },
  triggerTrack: { flex: 1, height: 8, borderRadius: BorderRadius.pill, overflow: 'hidden' },
  triggerFill: { height: '100%', borderRadius: BorderRadius.pill },
  triggerCount: { fontSize: 12, width: 20, textAlign: 'right' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.two, padding: Spacing.six },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { fontSize: 18, fontWeight: '600', textAlign: 'center' },
  emptyBody: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
});
