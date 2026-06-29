import { router } from 'expo-router';
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

import { StreakCard } from '@/components/today/StreakCard';
import { ToolCard } from '@/components/today/ToolCard';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { QUOTES } from '@/constants/quotes';
import { BorderRadius, EmotionColors, Spacing } from '@/constants/theme';
import { EMOTIONS_BY_ID } from '@/constants/emotions';
import { useEmotions } from '@/context/emotion-context';
import { useHelp } from '@/context/help-context';
import { useWellness } from '@/context/wellness-context';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';

function getGreeting(t: ReturnType<typeof useTranslation>): string {
  const h = new Date().getHours();
  if (h < 12) return t.home.greeting.morning;
  if (h < 18) return t.home.greeting.afternoon;
  return t.home.greeting.evening;
}

function getDailyQuote() {
  const day = Math.floor(Date.now() / 86400000);
  return QUOTES[day % QUOTES.length];
}

export default function TodayScreen() {
  const { colors } = useTheme();
  const t = useTranslation();
  const insets = useSafeAreaInsets();
  const { entries, streak } = useWellness();
  const { todayEmotions, emotionLogs } = useEmotions();
  const { showHelp } = useHelp();

  const quote = useMemo(getDailyQuote, []);
  const greeting = getGreeting(t);

  // Bottom padding = tab bar height (approx 80) + safe area bottom
  const bottomPad = 88 + insets.bottom;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* ── Header — sits below system status bar ── */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + Spacing.two,
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.greeting, { color: colors.text }]}>{greeting}</Text>
        <TouchableOpacity
          onPress={showHelp}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityLabel="Help"
          accessibilityRole="button"
        >
          <Text style={[styles.helpBtn, { color: colors.textSecondary }]}>?</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Emotion check-in prompt ── */}
        <Animated.View entering={FadeInDown.delay(50).springify()}>
          <AnimatedPressable
            onPress={() => router.push('/emotions')}
            style={[styles.checkInCard, {
              backgroundColor: colors.primary + '18',
              borderColor: colors.primary + '44',
            }]}
            accessibilityRole="button"
            accessibilityLabel={t.today.checkIn}
          >
            <Text style={[styles.checkInLabel, { color: colors.text }]}>
              {t.today.checkIn}
            </Text>
            <View style={[styles.checkInBtn, { backgroundColor: colors.primary }]}>
              <Text style={styles.checkInBtnText}>{t.today.logEmotion} →</Text>
            </View>
          </AnimatedPressable>
        </Animated.View>

        {/* ── Today's emotions row ── */}
        {todayEmotions.length > 0 && (
          <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
              {t.today.todayEmotions}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.emotionRow}
            >
              {todayEmotions.map(log => {
                const emotion = EMOTIONS_BY_ID[log.emotionId];
                const color = emotion?.color ?? colors.primary;
                return (
                  <View
                    key={log.id}
                    style={[styles.emotionPill, {
                      backgroundColor: color + '22',
                      borderColor: color + '66',
                    }]}
                  >
                    <Text style={[styles.emotionPillText, { color }]}>{log.emotionLabel}</Text>
                    <Text style={[styles.emotionIntensity, { color: colors.textSecondary }]}>
                      {' '}·{log.intensity}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </Animated.View>
        )}

        {/* ── Streak & stats ── */}
        <Animated.View entering={FadeInDown.delay(150).springify()} style={styles.section}>
          <StreakCard
            streak={streak}
            streakLabel={t.today.streakDays}
            streakStart={t.today.streakStart}
            totalEntries={entries.length}
            totalEmotions={emotionLogs.length}
          />
        </Animated.View>

        {/* ── Tool cards ── */}
        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
            {t.today.tools}
          </Text>
          <View style={styles.toolsGrid}>
            <ToolCard
              emoji="🌬️"
              title={t.today.breatheTitle}
              subtitle={t.today.breatheSub}
              accentColor={EmotionColors.fear}
              onPress={() => router.push('/breathe')}
            />
            <ToolCard
              emoji="🌿"
              title={t.today.groundTitle}
              subtitle={t.today.groundSub}
              accentColor={EmotionColors.trust}
              onPress={() => router.push('/ground')}
            />
          </View>
        </Animated.View>

        {/* ── Daily quote ── */}
        <Animated.View entering={FadeInDown.delay(250).springify()} style={styles.section}>
          <View style={[styles.quoteCard, {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }]}>
            <Text style={[styles.quoteLabel, { color: colors.textSecondary }]}>
              {t.today.quote}
            </Text>
            <Text style={[styles.quoteText, { color: colors.text }]}>
              "{quote.text}"
            </Text>
            <Text style={[styles.quoteAuthor, { color: colors.textSecondary }]}>
              — {quote.author}
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.two + 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  helpBtn: {
    fontSize: 18,
    fontWeight: '700',
    width: 32,
    height: 32,
    textAlign: 'center',
    lineHeight: 32,
    borderRadius: 16,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: Spacing.three,
  },
  section: {
    gap: Spacing.two,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  checkInCard: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    padding: Spacing.four,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  checkInLabel: {
    fontSize: 17,
    fontWeight: '500',
    flex: 1,
  },
  checkInBtn: {
    borderRadius: BorderRadius.pill,
    paddingVertical: 10,
    paddingHorizontal: Spacing.three,
  },
  checkInBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  emotionRow: {
    gap: Spacing.two,
    paddingBottom: 2,
  },
  emotionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: Spacing.two + 4,
  },
  emotionPillText: {
    fontSize: 13,
    fontWeight: '600',
  },
  emotionIntensity: {
    fontSize: 12,
  },
  toolsGrid: {
    flexDirection: 'row',
    gap: Spacing.two + 4,
  },
  quoteCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  quoteLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  quoteText: {
    fontSize: 16,
    lineHeight: 25,
    fontStyle: 'italic',
    fontFamily: Platform.select({ ios: 'Georgia', default: 'serif' }),
  },
  quoteAuthor: {
    fontSize: 13,
    fontWeight: '500',
  },
});
