import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/ui/Card';
import { IconChip } from '@/components/ui/IconChip';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface Props {
  entriesThisMonth: number;
  entriesThisMonthLabel: string;
  totalEntries: number;
  totalEmotions: number;
  entriesLabel: string;
  emotionsLabel: string;
}

export function EngagementCard({
  entriesThisMonth, entriesThisMonthLabel, totalEntries, totalEmotions, entriesLabel, emotionsLabel,
}: Props) {
  const { colors } = useTheme();

  return (
    <Card style={styles.card}>
      <View style={styles.monthRow}>
        <IconChip name="leaf" color={colors.primary} size={26} chipSize={52} />
        <View>
          <Text style={[styles.monthNum, { color: colors.primary }]}>{entriesThisMonth}</Text>
          <Text style={[styles.monthLabel, { color: colors.textSecondary }]}>{entriesThisMonthLabel}</Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={[styles.statNum, { color: colors.text }]}>{totalEntries}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{entriesLabel}</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.stat}>
          <Text style={[styles.statNum, { color: colors.text }]}>{totalEmotions}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{emotionsLabel}</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.three,
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  monthNum: {
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: -1,
    lineHeight: 40,
  },
  monthLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: Spacing.three,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statNum: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 2,
    lineHeight: 14,
  },
  statDivider: {
    width: 1,
    height: 36,
    marginHorizontal: Spacing.three,
  },
});
