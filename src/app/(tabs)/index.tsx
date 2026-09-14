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
import { Screen, ScreenHeader } from '@/components/ui/Screen';
import { BorderRadius, EmotionColors, Spacing, TAB_BAR_CLEARANCE } from '@/constants/theme';
import { BASIC_EMOTIONS_BY_ID } from '@/constants/emotions';
import { FEELINGS_LIBRARY_BY_ID, FeelingsLibraryEntry } from '@/constants/feelings-library';
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

function getDailyQuote(t: ReturnType<typeof useTranslation>) {
  const quotes = t.dailyContent?.quotes;
  if (!Array.isArray(quotes) || quotes.length === 0) return null;
  const day = Math.floor(Date.now() / 86400000);
  return quotes[day % quotes.length];
}

// Deliberately partial: only emotion ids with an honest, non-forced match to a
// Feelings Library category are included. Everything else (happiness, disgust,
// contempt, surprise, and any free-typed custom emotion) falls back to the
// generic QUOTES rotation.
const EMOTION_TO_FEELINGS_CATEGORY: Partial<Record<string, FeelingsLibraryEntry['id']>> = {
  anger: 'anger',
  fear: 'fear',
  sadness: 'sadness',
};

export default function TodayScreen() {
  const { colors } = useTheme();
  const t = useTranslation();
  const insets = useSafeAreaInsets();
  const { entries, streak } = useWellness();
  const { todayEmotions, emotionLogs } = useEmotions();
  const { showHelp } = useHelp();

  const quote = useMemo(() => getDailyQuote(t), [t]);
  const greeting = getGreeting(t);

  const affirmation = useMemo(() => {
    const mostRecentEmotionId = emotionLogs[0]?.emotionId;
    const libraryId = mostRecentEmotionId ? EMOTION_TO_FEELINGS_CATEGORY[mostRecentEmotionId] : undefined;
    return libraryId ? FEELINGS_LIBRARY_BY_ID[libraryId] : undefined;
  }, [emotionLogs]);

  // Bottom padding = tab bar height (approx 80) + safe area bottom
  const bottomPad = TAB_BAR_CLEARANCE + insets.bottom;

  return (
    <Screen>
      <ScreenHeader style={styles.header}>
        <Text style={[styles.greeting, { color: colors.text }]}>{greeting}</Text>
        <TouchableOpacity
          onPress={showHelp}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityLabel="Help"
          accessibilityRole="button"
        >
          <Text style={[styles.helpBtn, { color: colors.textSecondary }]}>?</Text>
        </TouchableOpacity>
      </ScreenHeader>

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
                const emotion = BASIC_EMOTIONS_BY_ID[log.emotionId];
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
            entriesLabel={t.today.journalEntries}
            emotionsLabel={t.today.emotionsLogged}
          />
        </Animated.View>

        {/* ── Tool cards ── */}
        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
            {t.today.tools}
          </Text>
          <View style={styles.toolsGrid}>
            <ToolCard
              icon="cloud-outline"
              title={t.today.breatheTitle}
              subtitle={t.today.breatheSub}
              accentColor={EmotionColors.fear}
              onPress={() => router.push('/breathe')}
            />
            <ToolCard
              icon="leaf-outline"
              title={t.today.groundTitle}
              subtitle={t.today.groundSub}
              accentColor={EmotionColors.trust}
              onPress={() => router.push('/ground')}
            />
            <ToolCard
              icon="book-outline"
              title={t.feelingsLibraryScreen.cardTitle}
              subtitle={t.feelingsLibraryScreen.cardSub}
              accentColor={EmotionColors.disgust}
              onPress={() => router.push('/feelings-library')}
            />
          </View>
        </Animated.View>

        {/* ── Daily quote / affirmation ── */}
        <Animated.View entering={FadeInDown.delay(250).springify()} style={styles.section}>
          {affirmation ? (
            <AnimatedPressable
              onPress={() => router.push('/feelings-library')}
              style={[styles.quoteCard, {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              }]}
              accessibilityRole="button"
              accessibilityLabel={affirmation.ease}
            >
              <Text style={[styles.quoteLabel, { color: colors.textSecondary }]}>
                {t.feelingsLibraryScreen.affirmationLabel}
              </Text>
              <Text style={[styles.quoteText, { color: colors.text, fontStyle: 'normal' }]}>
                {affirmation.emoji} {(t.dailyContent.feelingsEase as Record<string, string>)[affirmation.id] ?? affirmation.ease}
              </Text>
            </AnimatedPressable>
          ) : quote ? (
            <View style={[styles.quoteCard, {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            }]}>
              <Text style={[styles.quoteLabel, { color: colors.textSecondary }]}>
                {t.today.quote}
              </Text>
              <Text style={[styles.quoteText, { color: colors.text }]}>
                &ldquo;{quote.text}&rdquo;
              </Text>
              <Text style={[styles.quoteAuthor, { color: colors.textSecondary }]}>
                — {quote.author}
              </Text>
            </View>
          ) : null}
        </Animated.View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginLeft: Spacing.six, // reserve room for the floating LanguagePill
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
