import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
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
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.two, borderBottomColor: colors.border, backgroundColor: colors.background }]}>
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
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}
      >
        {FEELINGS_LIBRARY.map((entry, i) => {
          const expanded = expandedId === entry.id;
          return (
            <Animated.View key={entry.id} entering={FadeInDown.delay(i * 40).springify()}>
              <AnimatedPressable
                onPress={() => setExpandedId(expanded ? null : entry.id)}
                style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
                accessibilityRole="button"
                accessibilityLabel={entry.label}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.iconBadge, { backgroundColor: entry.color + '22' }]}>
                    <Text style={styles.emoji}>{entry.emoji}</Text>
                  </View>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>{entry.label}</Text>
                  <Text style={[styles.chevron, { color: colors.textSecondary }]}>
                    {expanded ? '▲' : '▼'}
                  </Text>
                </View>

                {expanded && (
                  <Animated.View entering={FadeInDown.springify()} style={styles.detail}>
                    <DetailSection label={fl.noticeLabel} body={entry.notice} colors={colors} />
                    <DetailSection label={fl.hearLabel} body={entry.hear} colors={colors} />
                    <DetailSection label={fl.feelLabel} body={entry.feel} colors={colors} />
                    <DetailSection label={fl.easeLabel} body={entry.ease} colors={colors} accent={entry.color} />
                    <View style={styles.exploreSection}>
                      <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>{fl.exploreLabel}</Text>
                      {entry.explore.map((prompt, idx) => (
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
    </View>
  );
}

function DetailSection({
  label, body, colors, accent,
}: { label: string; body: string; colors: { text: string; textSecondary: string }; accent?: string }) {
  return (
    <View style={styles.detailSection}>
      <Text style={[styles.sectionLabel, { color: accent ?? colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.detailBody, { color: colors.text }]}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.two + 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: Spacing.one,
  },
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
  detailSection: { gap: Spacing.half + 2 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  detailBody: {
    fontSize: 14,
    lineHeight: 21,
  },
  exploreSection: { gap: Spacing.two },
  promptText: {
    fontSize: 14,
    lineHeight: 21,
  },
});
