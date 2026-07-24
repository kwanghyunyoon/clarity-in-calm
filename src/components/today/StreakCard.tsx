import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Card } from '@/components/ui/Card';
import { IconChip } from '@/components/ui/IconChip';
import { Colors, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface Props {
  streak: number;
  streakLabel: string;
  streakStart: string;
  totalEntries: number;
  totalEmotions: number;
  entriesLabel: string;
  emotionsLabel: string;
}

export function StreakCard({ streak, streakLabel, streakStart, totalEntries, totalEmotions, entriesLabel, emotionsLabel }: Props) {
  const { colors } = useTheme();
  const flameScale = useSharedValue(1);

  useEffect(() => {
    if (streak > 0) {
      flameScale.value = withRepeat(
        withSequence(
          withTiming(1.15, { duration: 700 }),
          withTiming(0.95, { duration: 700 }),
        ),
        -1,
        true,
      );
    }
  }, [streak]);

  const flameStyle = useAnimatedStyle(() => ({
    transform: [{ scale: flameScale.value }],
  }));

  return (
    <Card style={styles.card}>
      <View style={styles.streakRow}>
        <Animated.View style={flameStyle}>
          <IconChip
            name={streak > 0 ? 'flame' : 'leaf'}
            color={colors.primary}
            size={26}
            chipSize={52}
          />
        </Animated.View>
        <View>
          {streak > 0 ? (
            <>
              <Text style={[styles.streakNum, { color: colors.primary }]}>
                {streak}
              </Text>
              <Text style={[styles.streakLabel, { color: colors.textSecondary }]}>
                {streakLabel}
              </Text>
            </>
          ) : (
            <Text style={[styles.streakStart, { color: colors.textSecondary }]}>
              {streakStart}
            </Text>
          )}
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
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  streakNum: {
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: -1,
    lineHeight: 40,
  },
  streakLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  streakStart: {
    fontSize: 13,
    lineHeight: 18,
    maxWidth: 200,
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
