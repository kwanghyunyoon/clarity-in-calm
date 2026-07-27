import React from 'react';
import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const AnimatedPressableBase = Animated.createAnimatedComponent(Pressable);

interface Props extends PressableProps {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  scale?: number;
}

export function AnimatedPressable({ style, children, scale = 0.96, ...rest }: Props) {
  const sv = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sv.value }],
  }));

  return (
    <AnimatedPressableBase
      style={[style, animStyle]}
      // eslint-disable-next-line react-hooks/immutability
      onPressIn={() => { sv.value = withSpring(scale, { damping: 15, stiffness: 400 }); }}
      // eslint-disable-next-line react-hooks/immutability
      onPressOut={() => { sv.value = withSpring(1, { damping: 15, stiffness: 400 }); }}
      {...rest}
    >
      {children}
    </AnimatedPressableBase>
  );
}
