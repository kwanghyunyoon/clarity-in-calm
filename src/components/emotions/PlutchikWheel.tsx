import React, { useCallback } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Svg, { Circle, G, Path, Text as SvgText } from 'react-native-svg';
import { EMOTIONS, PlutchikEmotion } from '@/constants/emotions';
import { useTheme } from '@/hooks/use-theme';

const SIZE = 280;
const CENTER = SIZE / 2;
// Ring radii: ring 1 = inner/intense, ring 2 = primary, ring 3 = mild/outer
const RING_RADII = { inner: 40, ring1: 75, ring2: 118, ring3: 138 };
const NUM_SECTORS = 8;
const SECTOR_ANGLE = (2 * Math.PI) / NUM_SECTORS; // 45° each

function polarToXY(angleDeg: number, r: number) {
  // 0° = top, clockwise
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return { x: CENTER + r * Math.cos(rad), y: CENTER + r * Math.sin(rad) };
}

function describeWedge(
  angleDeg: number,
  innerR: number,
  outerR: number,
): string {
  const half = 360 / NUM_SECTORS / 2;
  const startDeg = angleDeg - half;
  const endDeg = angleDeg + half;

  const p1 = polarToXY(startDeg, innerR);
  const p2 = polarToXY(endDeg, innerR);
  const p3 = polarToXY(endDeg, outerR);
  const p4 = polarToXY(startDeg, outerR);

  const largeArc = 0; // always < 180°

  return [
    `M ${p1.x} ${p1.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 1 ${p2.x} ${p2.y}`,
    `L ${p3.x} ${p3.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 0 ${p4.x} ${p4.y}`,
    'Z',
  ].join(' ');
}

function labelPosition(angleDeg: number, innerR: number, outerR: number) {
  const midR = (innerR + outerR) / 2;
  return polarToXY(angleDeg, midR);
}

interface Props {
  selectedId: string | null;
  onSelect: (emotion: PlutchikEmotion) => void;
}

export function PlutchikWheel({ selectedId, onSelect }: Props) {
  const { colors } = useTheme();

  const rings: Array<{ ring: 1 | 2 | 3; innerR: number; outerR: number }> = [
    { ring: 1, innerR: RING_RADII.inner, outerR: RING_RADII.ring1 },
    { ring: 2, innerR: RING_RADII.ring1, outerR: RING_RADII.ring2 },
    { ring: 3, innerR: RING_RADII.ring2, outerR: RING_RADII.ring3 },
  ];

  const emotionsByRingAndAngle = EMOTIONS.reduce<Record<string, PlutchikEmotion>>(
    (acc, e) => { acc[`${e.ring}-${e.angle}`] = e; return acc; }, {},
  );

  return (
    <View style={styles.container} accessibilityLabel="Emotion wheel">
      <Svg width={SIZE} height={SIZE}>
        {/* Background circle */}
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={RING_RADII.ring3}
          fill={colors.backgroundElement}
          opacity={0.4}
        />

        {rings.map(({ ring, innerR, outerR }) =>
          EMOTIONS.filter(e => e.ring === ring).map(emotion => {
            const isSelected = emotion.id === selectedId;
            const path = describeWedge(emotion.angle, innerR, outerR);
            const lp = labelPosition(emotion.angle, innerR, outerR);
            const fontSize = ring === 1 ? 7 : ring === 2 ? 8 : 7;

            return (
              <G key={emotion.id}>
                <Path
                  d={path}
                  fill={emotion.color}
                  opacity={isSelected ? 1 : 0.72}
                  stroke={isSelected ? '#fff' : colors.background}
                  strokeWidth={isSelected ? 2 : 0.8}
                  onPress={() => onSelect(emotion)}
                  accessibilityLabel={emotion.label}
                />
                <SvgText
                  x={lp.x}
                  y={lp.y + fontSize / 2.5}
                  fontSize={fontSize}
                  textAnchor="middle"
                  fill={ring === 1 ? '#fff' : '#1a1a1a'}
                  fontWeight="600"
                  pointerEvents="none"
                >
                  {emotion.label}
                </SvgText>
              </G>
            );
          }),
        )}

        {/* Center circle */}
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={RING_RADII.inner}
          fill={colors.surface}
          stroke={colors.border}
          strokeWidth={1}
        />

        {/* Center label */}
        <SvgText
          x={CENTER}
          y={CENTER - 4}
          textAnchor="middle"
          fontSize={10}
          fill={colors.textSecondary}
          fontWeight="500"
        >
          {selectedId ? '✓' : 'tap'}
        </SvgText>
        <SvgText
          x={CENTER}
          y={CENTER + 10}
          textAnchor="middle"
          fontSize={9}
          fill={colors.textSecondary}
        >
          {selectedId ? 'selected' : 'emotion'}
        </SvgText>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
