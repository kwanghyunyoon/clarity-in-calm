import { useMemo, useRef, useState } from 'react';
import { PanResponder, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const TRACK_HEIGHT = 8;
const THUMB_SIZE = 28;

interface Props {
  value: number; // 1-10
  onChange: (v: number) => void;
  color: string;
  lowLabel?: string;
  highLabel?: string;
}

export function IntensitySlider({ value, onChange, color, lowLabel = 'mild', highLabel = 'intense' }: Props) {
  const { colors } = useTheme();
  const [trackWidth, setTrackWidth] = useState(260);

  const toX = (v: number) => ((v - 1) / 9) * trackWidth;
  const toValue = (x: number) => Math.round((Math.max(0, Math.min(x, trackWidth)) / trackWidth) * 9) + 1;

  const thumbX = useSharedValue(toX(value));
  const startX = useRef(toX(value));

  // useMemo so PanResponder.create is not called during render on every re-render,
  // and so the linter does not flag .current access at the call site in JSX.
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          startX.current = thumbX.value;
        },
        onPanResponderMove: (_, gestureState) => {
          const newX = Math.max(0, Math.min(startX.current + gestureState.dx, trackWidth));
          thumbX.value = newX;
          onChange(toValue(newX));
        },
        onPanResponderRelease: () => {
          thumbX.value = withSpring(toX(toValue(thumbX.value)), { damping: 18, stiffness: 300 });
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [trackWidth],
  );

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: thumbX.value - THUMB_SIZE / 2 }],
  }));

  const fillStyle = useAnimatedStyle(() => ({
    width: thumbX.value,
  }));

  return (
    <View style={styles.container}>
      <View
        style={styles.track}
        accessibilityRole="adjustable"
        accessibilityValue={{ min: 1, max: 10, now: value }}
        onLayout={e => {
          const w = e.nativeEvent.layout.width;
          if (w > 0 && w !== trackWidth) {
            setTrackWidth(w);
            thumbX.value = toX(value);
          }
        }}
      >
        <View style={[styles.trackBg, { backgroundColor: colors.backgroundElement }]} />
        <Animated.View style={[styles.trackFill, { backgroundColor: color }, fillStyle]} />
        <Animated.View
          style={[styles.thumb, { backgroundColor: color, borderColor: '#fff' }, thumbStyle]}
          {...panResponder.panHandlers}
        >
          <Text style={styles.thumbLabel}>{value}</Text>
        </Animated.View>
      </View>
      <View style={styles.labels}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>{lowLabel}</Text>
        <Text style={[styles.label, { color: colors.textSecondary }]}>{highLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.two },
  track: { height: THUMB_SIZE, justifyContent: 'center', position: 'relative' },
  trackBg: { height: TRACK_HEIGHT, borderRadius: BorderRadius.pill, position: 'absolute', left: 0, right: 0 },
  trackFill: { height: TRACK_HEIGHT, borderRadius: BorderRadius.pill, position: 'absolute', left: 0 },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    borderWidth: 3,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  thumbLabel: { color: '#fff', fontSize: 12, fontWeight: '700' },
  labels: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 2 },
  label: { fontSize: 12, fontWeight: '500' },
});
