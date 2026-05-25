import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Spacing } from '@/constants/theme';
import { useLocale } from '@/context/language-context';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useWellness } from '@/context/wellness-context';


function last7Days(): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });
}

function toFixed1OrDash(val: number | null) {
  return val !== null ? val.toFixed(1) : '—';
}

export default function ProgressScreen() {
  const colors = useTheme();
  const t = useTranslation();
  const { locale } = useLocale();
  const { entries, breathingSessions, streak } = useWellness();
  const moods = t.moods;

  const week = last7Days();

  const avgMood =
    entries.length > 0
      ? entries.reduce((s, e) => s + e.mood, 0) / entries.length
      : null;

  // Mood distribution (highest to lowest) — clamp index to [0,4] to prevent crashes
  const moodDist = [5, 4, 3, 2, 1].map((v) => {
    const count = entries.filter((e) => e.mood === v).length;
    const idx = Math.max(0, Math.min(4, v - 1));
    return { ...moods[idx], count };
  });
  const maxCount = Math.max(...moodDist.map((m) => m.count), 1);

  // YYYY-MM-DD helper — consistent local-timezone date key (mirrors wellness-context)
  const toLocalDateStr = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  // Weekly activity
  const weekActivity = week.map((day) => {
    const dayKey = toLocalDateStr(day);
    const dayEntries = entries.filter(
      (e) => toLocalDateStr(new Date(e.date)) === dayKey
    );
    // Clamp moodAvg to [1,5] so moods[moodAvg-1] never goes out of bounds
    const rawAvg = dayEntries.length > 0
      ? Math.round(dayEntries.reduce((s, e) => s + e.mood, 0) / dayEntries.length)
      : 0;
    const moodAvg = rawAvg > 0 ? Math.max(1, Math.min(5, rawAvg)) : 0;
    const isToday = toLocalDateStr(day) === toLocalDateStr(new Date());
    return {
      dayShort: day.toLocaleDateString(locale, { weekday: 'short' }),
      dayNum:   day.getDate(),
      moodAvg,
      hasEntry: dayEntries.length > 0,
      isToday,
    };
  });

  const isEmpty = entries.length === 0;

  return (
    <SafeAreaView edges={['top']} style={[s.root, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* Header */}
        <View style={s.header}>
          <Text style={[s.title,    { color: colors.text }]}>{t.progress.title}</Text>
          <Text style={[s.subtitle, { color: colors.textSecondary }]}>{t.progress.subtitle}</Text>
        </View>

        {/* ── Main stats ── */}
        <View style={s.statsGrid}>
          {/* Streak */}
          <View style={[s.streakCard, { backgroundColor: colors.backgroundElement }]}>
            <Text style={s.streakFlame}>🔥</Text>
            <Text style={[s.streakNum, { color: colors.text }]}>{streak}</Text>
            <Text style={[s.streakLbl, { color: colors.textSecondary }]}>
              {t.home.progress.streak}
            </Text>
            {streak === 0 && (
              <Text style={[s.streakHow, { color: colors.textSecondary }]}>
                {t.progress.streakHow}
              </Text>
            )}
          </View>

          {/* Mini stats */}
          <View style={s.miniCol}>
            {[
              { emoji: '📝', value: entries.length,         label: t.progress.stats.entries  },
              { emoji: '🫁', value: breathingSessions,      label: t.progress.stats.sessions },
              { emoji: '😊', value: toFixed1OrDash(avgMood),label: t.progress.stats.avgMood  },
            ].map((stat) => (
              <View key={stat.label} style={[s.miniCard, { backgroundColor: colors.backgroundElement }]}>
                <Text style={s.miniEmoji}>{stat.emoji}</Text>
                <Text style={[s.miniValue, { color: colors.text }]}>{stat.value}</Text>
                <Text style={[s.miniLabel, { color: colors.textSecondary }]}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Last 7 days ── */}
        <View style={[s.card, { backgroundColor: colors.backgroundElement }]}>
          <Text style={[s.cardTitle, { color: colors.text }]}>{t.progress.last7}</Text>
          <View style={s.weekRow}>
            {weekActivity.map((day, i) => {
              const mood = day.moodAvg > 0 ? moods[day.moodAvg - 1] : null;
              return (
                <View key={i} style={s.dayCol}>
                  <Text style={[s.dayShort, { color: colors.textSecondary }]}>{day.dayShort}</Text>

                  <View
                    style={[
                      s.dayDot,
                      {
                        backgroundColor: mood ? mood.color : colors.backgroundSelected,
                        borderWidth: day.isToday ? 2 : 0,
                        borderColor: colors.primary,
                      },
                    ]}
                  >
                    {mood && <Text style={s.dayEmoji}>{mood.emoji}</Text>}
                    {!mood && (
                      <View style={[s.dotEmpty, { borderColor: colors.border }]} />
                    )}
                  </View>

                  <Text style={[s.dayNum, { color: colors.textSecondary }]}>{day.dayNum}</Text>
                </View>
              );
            })}
          </View>
          {/* Chart legend */}
          <Text style={[s.chartLegend, { color: colors.textSecondary }]}>
            {t.progress.chartLegend}
          </Text>
        </View>

        {/* ── Mood distribution ── */}
        {!isEmpty && (
          <View style={[s.card, { backgroundColor: colors.backgroundElement }]}>
            <Text style={[s.cardTitle, { color: colors.text }]}>{t.progress.moodBreakdown}</Text>
            {moodDist.map((m) => (
              <View key={m.value} style={s.barRow}>
                <Text style={s.barEmoji}>{m.emoji}</Text>
                <View style={[s.barTrack, { backgroundColor: colors.backgroundSelected }]}>
                  <View
                    style={[
                      s.barFill,
                      {
                        width: `${(m.count / maxCount) * 100}%`,
                        backgroundColor: m.color,
                      },
                    ]}
                  />
                </View>
                <Text style={[s.barCount, { color: colors.textSecondary, minWidth: 20, textAlign: 'right' }]}>
                  {m.count}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* ── Streak motivation ── */}
        {streak >= 3 && (
          <View style={[s.card, { backgroundColor: colors.primary + '22' }]}>
            <Text style={s.motivEmoji}>🎉</Text>
            <Text style={[s.motivTitle, { color: colors.text }]}>
              {streak >= 7 ? t.progress.streakMotiv.week : `${streak} ${t.progress.streakMotiv.days}`}
            </Text>
            <Text style={[s.motivSub, { color: colors.textSecondary }]}>{t.progress.streakMotiv.sub}</Text>
          </View>
        )}

        {/* ── Insights ── */}
        {!isEmpty && (() => {
          const ins = t.progress.insights;

          // Most common mood
          const topEntry = [...moodDist].sort((a, b) => b.count - a.count)[0];
          const topMoodInfo = topEntry && topEntry.count > 0 ? topEntry : null;

          // Mood trend: avg of last 7 days vs avg of previous 7 days
          const now = new Date();
          const last7Start  = new Date(now); last7Start.setDate(now.getDate() - 6);
          const prev7Start  = new Date(now); prev7Start.setDate(now.getDate() - 13);
          const prev7End    = new Date(now); prev7End.setDate(now.getDate() - 7);

          const isInRange = (d: Date, from: Date, to: Date) => d >= from && d <= to;
          const last7Entries = entries.filter((e) => isInRange(new Date(e.date), last7Start, now));
          const prev7Entries = entries.filter((e) => isInRange(new Date(e.date), prev7Start, prev7End));

          const avg = (arr: typeof entries) =>
            arr.length > 0 ? arr.reduce((s, e) => s + e.mood, 0) / arr.length : null;
          const last7Avg = avg(last7Entries);
          const prev7Avg = avg(prev7Entries);

          let trendText = ins.trend.none;
          if (last7Avg !== null && prev7Avg !== null) {
            const diff = last7Avg - prev7Avg;
            trendText = diff >  0.2 ? ins.trend.up
                      : diff < -0.2 ? ins.trend.down
                      : ins.trend.flat;
          }

          // Best day of week
          const dayTotals: Record<number, { sum: number; count: number }> = {};
          entries.forEach((e) => {
            const dow = new Date(e.date).getDay(); // 0=Sun … 6=Sat
            if (!dayTotals[dow]) dayTotals[dow] = { sum: 0, count: 0 };
            dayTotals[dow].sum   += e.mood;
            dayTotals[dow].count += 1;
          });
          const dayAvgs = Object.entries(dayTotals).map(([dow, v]) => ({
            dow: Number(dow),
            avg: v.sum / v.count,
          }));
          const bestDow = dayAvgs.length >= 2
            ? dayAvgs.reduce((best, d) => d.avg > best.avg ? d : best)
            : null;
          const bestDayName = bestDow
            ? new Date(2024, 0, bestDow.dow + 7).toLocaleDateString(locale, { weekday: 'long' })
            : null;

          return (
            <View style={[s.card, { backgroundColor: colors.backgroundElement }]}>
              <Text style={[s.cardTitle, { color: colors.text }]}>{ins.title}</Text>

              {/* Top mood */}
              {topMoodInfo && (
                <View style={s.insightRow}>
                  <Text style={s.insightEmoji}>{topMoodInfo.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[s.insightLabel, { color: colors.textSecondary }]}>{ins.topMood}</Text>
                    <Text style={[s.insightValue, { color: colors.text }]}>{topMoodInfo.label}</Text>
                  </View>
                </View>
              )}

              {/* Trend */}
              <View style={s.insightRow}>
                <Text style={s.insightEmoji}>📈</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[s.insightLabel, { color: colors.textSecondary }]}>{ins.trend.label}</Text>
                  <Text style={[s.insightValue, { color: colors.text }]}>{trendText}</Text>
                </View>
              </View>

              {/* Best day */}
              <View style={s.insightRow}>
                <Text style={s.insightEmoji}>📅</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[s.insightLabel, { color: colors.textSecondary }]}>{ins.bestDay}</Text>
                  <Text style={[s.insightValue, { color: colors.text }]}>
                    {bestDayName ?? ins.noPattern}
                  </Text>
                </View>
              </View>
            </View>
          );
        })()}

        {/* ── Empty state ── */}
        {isEmpty && (
          <View style={[s.card, { backgroundColor: colors.backgroundElement, alignItems: 'center', paddingVertical: Spacing.five }]}>
            <Text style={{ fontSize: 40, marginBottom: Spacing.two }}>🌱</Text>
            <Text style={[s.motivTitle, { color: colors.text, textAlign: 'center' }]}>
              {t.progress.empty.title}
            </Text>
            <Text style={[s.motivSub, { color: colors.textSecondary, textAlign: 'center' }]}>
              {t.progress.empty.body}
            </Text>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root:         { flex: 1 },
  scroll:       { paddingHorizontal: Spacing.three, paddingBottom: Spacing.six },

  header:       { paddingTop: Spacing.three, paddingBottom: Spacing.two, gap: Spacing.half },
  title:        { fontSize: 28, fontWeight: '700', letterSpacing: -0.5 },
  subtitle:     { fontSize: 14, fontWeight: '500' },

  statsGrid:    { flexDirection: 'row', gap: Spacing.two, marginBottom: Spacing.two },
  streakCard:   { flex: 1, borderRadius: 18, padding: Spacing.three, alignItems: 'center', gap: Spacing.half },
  streakFlame:  { fontSize: 36 },
  streakNum:    { fontSize: 48, fontWeight: '800', lineHeight: 52 },
  streakLbl:    { fontSize: 12, fontWeight: '600' },
  streakHow:    { fontSize: 11, fontWeight: '500', textAlign: 'center',
                  lineHeight: 16, marginTop: Spacing.half },

  miniCol:      { flex: 1, gap: Spacing.one },
  miniCard:     { borderRadius: 14, paddingHorizontal: Spacing.two, paddingVertical: Spacing.one + 4,
                  flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  miniEmoji:    { fontSize: 18, width: 24, textAlign: 'center' },
  miniValue:    { fontSize: 18, fontWeight: '700', flex: 1 },
  miniLabel:    { fontSize: 11, fontWeight: '500' },

  card:         { borderRadius: 18, padding: Spacing.three, marginBottom: Spacing.two, gap: Spacing.two },
  cardTitle:    { fontSize: 15, fontWeight: '700', marginBottom: Spacing.one },

  weekRow:      { flexDirection: 'row', justifyContent: 'space-between' },
  dayCol:       { alignItems: 'center', gap: 5 },
  dayShort:     { fontSize: 11, fontWeight: '600' },
  dayDot:       { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  dayEmoji:     { fontSize: 20 },
  dotEmpty:     { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5 },
  dayNum:       { fontSize: 11, fontWeight: '500' },
  chartLegend:  { fontSize: 11, fontWeight: '500', textAlign: 'center',
                  marginTop: Spacing.one },

  barRow:       { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  barEmoji:     { fontSize: 18, width: 24 },
  barTrack:     { flex: 1, height: 10, borderRadius: 5, overflow: 'hidden' },
  barFill:      { height: '100%', borderRadius: 5 },
  barCount:     { fontSize: 12, fontWeight: '600' },

  insightRow:   { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  insightEmoji: { fontSize: 20, width: 28, textAlign: 'center' },
  insightLabel: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  insightValue: { fontSize: 15, fontWeight: '700', marginTop: 1 },

  motivEmoji:   { fontSize: 32, textAlign: 'center' },
  motivTitle:   { fontSize: 16, fontWeight: '700' },
  motivSub:     { fontSize: 13, lineHeight: 19, fontWeight: '500' },
});
