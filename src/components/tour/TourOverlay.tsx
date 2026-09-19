/**
 * Screen-agnostic coach-mark overlay: a dimmed backdrop with a spotlight
 * cutout around one measured screen region, plus a fixed dialogue card
 * (title/body/step dots/Skip + Next-or-Done). Pure props in, no state or
 * measurement logic — that lives in the owning screen + useScreenTour.
 *
 * `spotlight: null` renders a centered dialogue with no cutout, for a step
 * whose anchor doesn't exist yet (e.g. content that only appears after a
 * user action) rather than skipping or blocking the tour.
 */
import React from 'react';
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// Rough floor for the card's own height (dots + 2-line title + 3-line body +
// action row) — used only to decide which side of the spotlight has room,
// never to size the card itself.
const CARD_SPACE_ESTIMATE = 220;
const CARD_GAP = Spacing.three;

export interface SpotlightRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface TourOverlayProps {
  visible: boolean;
  spotlight: SpotlightRect | null;
  title: string;
  body: string;
  stepIndex: number;
  totalSteps: number;
  isLast: boolean;
  skipLabel: string;
  nextLabel: string;
  doneLabel: string;
  onNext: () => void;
  onSkip: () => void;
}

const SPOTLIGHT_PAD = 8;

export function TourOverlay({
  visible,
  spotlight,
  title,
  body,
  stepIndex,
  totalSteps,
  isLast,
  skipLabel,
  nextLabel,
  doneLabel,
  onNext,
  onSkip,
}: TourOverlayProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { width: winW, height: winH } = Dimensions.get('window');

  if (!visible) return null;

  const box = spotlight
    ? {
        x: Math.max(spotlight.x - SPOTLIGHT_PAD, 0),
        y: Math.max(spotlight.y - SPOTLIGHT_PAD, 0),
        width: spotlight.width + SPOTLIGHT_PAD * 2,
        height: spotlight.height + SPOTLIGHT_PAD * 2,
      }
    : null;

  // No spotlight: dialogue stays docked to the bottom, as before. With a
  // spotlight, put the card on whichever side has more room so it never
  // covers the thing it's pointing at — e.g. a spotlight near the bottom of
  // the screen (like Journal's "past entries" step) needs the card above it.
  let cardStyle: { top: number } | { bottom: number };
  if (!box) {
    cardStyle = { bottom: insets.bottom + Spacing.four };
  } else {
    const spaceAbove = box.y - insets.top;
    const spaceBelow = winH - insets.bottom - (box.y + box.height);
    cardStyle = spaceBelow >= CARD_SPACE_ESTIMATE || spaceBelow >= spaceAbove
      ? { top: box.y + box.height + CARD_GAP }
      : { bottom: winH - box.y + CARD_GAP };
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onSkip}>
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        {box ? (
          <>
            <View style={[styles.dim, { backgroundColor: colors.overlay, top: 0, left: 0, right: 0, height: box.y }]} />
            <View style={[styles.dim, { backgroundColor: colors.overlay, top: box.y + box.height, left: 0, right: 0, bottom: 0 }]} />
            <View style={[styles.dim, { backgroundColor: colors.overlay, top: box.y, height: box.height, left: 0, width: box.x }]} />
            <View style={[styles.dim, { backgroundColor: colors.overlay, top: box.y, height: box.height, left: box.x + box.width, right: 0 }]} />
            <View
              pointerEvents="none"
              style={[
                styles.spotlightBorder,
                { borderColor: colors.primary, top: box.y, left: box.x, width: box.width, height: box.height },
              ]}
            />
          </>
        ) : (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.overlay }]} />
        )}

        <Animated.View
          key={stepIndex}
          entering={FadeIn.duration(220)}
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              maxWidth: Math.min(winW - Spacing.four * 2, 420),
              ...cardStyle,
            },
          ]}
        >
          <View style={styles.dots}>
            {Array.from({ length: totalSteps }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  { backgroundColor: i === stepIndex ? colors.primary : colors.border },
                ]}
              />
            ))}
          </View>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.body, { color: colors.textSecondary }]}>{body}</Text>
          <View style={styles.actions}>
            <TouchableOpacity onPress={onSkip} accessibilityRole="button" accessibilityLabel={skipLabel}>
              <Text style={[styles.skipText, { color: colors.textSecondary }]}>{skipLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onNext}
              accessibilityRole="button"
              accessibilityLabel={isLast ? doneLabel : nextLabel}
              style={[styles.nextBtn, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.nextText}>{isLast ? doneLabel : nextLabel}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  dim: { position: 'absolute' },
  spotlightBorder: {
    position: 'absolute',
    borderWidth: 2,
    borderRadius: BorderRadius.md,
  },
  card: {
    position: 'absolute',
    alignSelf: 'center',
    left: Spacing.four,
    right: Spacing.four,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  dots: { flexDirection: 'row', gap: 6, marginBottom: Spacing.one },
  dot: { width: 6, height: 6, borderRadius: 3 },
  title: { fontSize: 17, fontWeight: '700', letterSpacing: -0.2 },
  body: { fontSize: 14, lineHeight: 20 },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  skipText: { fontSize: 14, fontWeight: '600' },
  nextBtn: {
    borderRadius: BorderRadius.pill,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
  },
  nextText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});
