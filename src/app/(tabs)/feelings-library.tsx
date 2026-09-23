import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { Screen, ScreenHeader } from '@/components/ui/Screen';
import { FEELINGS_LIBRARY } from '@/constants/feelings-library';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';

export default function FeelingsLibraryScreen() {
  const { colors } = useTheme();
  const t = useTranslation();
  const fl = t.feelingsLibraryScreen;
  const insets = useSafeAreaInsets();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const bottomPad = 88 + insets.bottom;

  return (
    <Screen>
      <ScreenHeader style={styles.headerGap}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityLabel={fl.back}
          accessibilityRole="button"
        >
          <Text style={[styles.backBtn, { color: colors.textSecondary }]}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{fl.title}</Text>
          <Text style={[styles.headerSub, { color: colors.textSecondary }]}>{fl.subtitle}</Text>
        </View>
      </ScreenHeader>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}
      >
        {FEELINGS_LIBRARY.map((entry, i) => {
          const expanded = expandedId === entry.id;
          const content = t.feelingsLibraryContent[entry.id as keyof typeof t.feelingsLibraryContent] ?? entry;
          const ease = (t.dailyContent.feelingsEase as Record<string, string>)[entry.id] ?? entry.ease;
          return (
            <Animated.View key={entry.id} entering={FadeInDown.delay(i * 40).springify()}>
              <AnimatedPressable
                onPress={() => setExpandedId(expanded ? null : entry.id)}
                style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
                accessibilityRole="button"
                accessibilityLabel={content.label}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.iconBadge, { backgroundColor: entry.color + '22' }]}>
                    <Text style={styles.emoji}>{entry.emoji}</Text>
                  </View>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>{content.label}</Text>
                  <Text style={[styles.chevron, { color: colors.textSecondary }]}>
                    {expanded ? '▲' : '▼'}
                  </Text>
                </View>

                {expanded && (
                  <Animated.View entering={FadeInDown.springify()} style={styles.detail}>
                    <DetailSection label={fl.noticeLabel} body={content.notice} colors={colors} />
                    <DetailSection label={fl.hearLabel} body={content.hear} colors={colors} />
                    <DetailSection label={fl.feelLabel} body={content.feel} colors={colors} />
                    <DetailSection label={fl.easeLabel} body={ease} colors={colors} accent={entry.color} />
                    <View style={styles.exploreSection}>
                      <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>{fl.exploreLabel}</Text>
                      {content.explore.map((prompt, idx) => (
                        <Text key={idx} style={[styles.promptText, { color: colors.text }]}>
                          · {prompt}
                        </Text>
                      ))}
                    </View>
                  </Animated.View>
                )}
              </AnimatedPressable>
            </Animated.View>
          );
        })}
      </ScrollView>
    </Screen>
  );
}

function splitToLines(body: string): string[] {
  return body
    .split(/(?<=[.!?।])\s+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function DetailSection({
  label, body, colors, accent,
}: { label: string; body: string; colors: { text: string; textSecondary: string }; accent?: string }) {
  return (
    <View style={styles.detailSection}>
      <Text style={[styles.sectionLabel, { color: accent ?? colors.textSecondary }]}>{label}</Text>
      <View style={styles.bulletList}>
        {splitToLines(body).map((line, idx) => (
          <Text key={idx} style={[styles.detailBody, { color: colors.text }]}>
            · {line}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerGap: { gap: Spacing.one },
  backBtn: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: Spacing.one,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 14,
  },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: Spacing.two + 4,
  },
  card: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.three,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two + 4,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 22 },
  cardTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  chevron: { fontSize: 12 },
  detail: {
    marginTop: Spacing.three,
    gap: Spacing.three,
  },
  detailSection: { gap: Spacing.half + 4 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  bulletList: { gap: Spacing.half + 2 },
  detailBody: {
    fontSize: 14,
    lineHeight: 22,
  },
  exploreSection: { gap: Spacing.two },
  promptText: {
    fontSize: 14,
    lineHeight: 22,
  },
});
