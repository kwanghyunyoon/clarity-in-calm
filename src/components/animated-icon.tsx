import { Image } from 'expo-image';
import { useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, Keyframe } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

const INITIAL_SCALE_FACTOR = Dimensions.get('screen').height / 90;
const DURATION = 1800;

const fadeOutKeyframe = new Keyframe({
  0:   { opacity: 1 },
  60:  { opacity: 1 },
  100: { opacity: 0, easing: Easing.out(Easing.ease) },
});

const iconKeyframe = new Keyframe({
  0:   { opacity: 0, transform: [{ scale: 0.8 }] },
  30:  { opacity: 1, transform: [{ scale: 1.05 }], easing: Easing.out(Easing.ease) },
  50:  { opacity: 1, transform: [{ scale: 1 }] },
  100: { opacity: 1 },
});

const textKeyframe = new Keyframe({
  0:   { opacity: 0, transform: [{ translateY: 12 }] },
  40:  { opacity: 0, transform: [{ translateY: 12 }] },
  70:  { opacity: 1, transform: [{ translateY: 0 }], easing: Easing.out(Easing.ease) },
  100: { opacity: 1 },
});

export function AnimatedSplashOverlay() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <Animated.View
      entering={fadeOutKeyframe.duration(DURATION).withCallback((finished) => {
        'worklet';
        if (finished) scheduleOnRN(setVisible, false);
      })}
      style={styles.root}
    >
      <Animated.View entering={iconKeyframe.duration(DURATION)} style={styles.iconWrap}>
        <Image
          source={require('@/assets/images/icon.png')}
          style={styles.icon}
          contentFit="contain"
        />
      </Animated.View>

      <Animated.View entering={textKeyframe.duration(DURATION)} style={styles.textWrap}>
        <Text style={styles.title}>Clarity in Calm</Text>
        <Text style={styles.tagline}>Breathe. Journal. Grow.</Text>
      </Animated.View>
    </Animated.View>
  );
}

const keyframe = new Keyframe({
  0: {
    transform: [{ scale: INITIAL_SCALE_FACTOR }],
  },
  100: {
    transform: [{ scale: 1 }],
    easing: Easing.elastic(0.7),
  },
});

const logoKeyframe = new Keyframe({
  0: {
    transform: [{ scale: 1.3 }],
    opacity: 0,
  },
  40: {
    transform: [{ scale: 1.3 }],
    opacity: 0,
    easing: Easing.elastic(0.7),
  },
  100: {
    opacity: 1,
    transform: [{ scale: 1 }],
    easing: Easing.elastic(0.7),
  },
});

const glowKeyframe = new Keyframe({
  0: {
    transform: [{ rotateZ: '0deg' }],
  },
  100: {
    transform: [{ rotateZ: '7200deg' }],
  },
});

export function AnimatedIcon() {
  return (
    <View style={styles.iconContainer}>
      <Animated.View entering={glowKeyframe.duration(60 * 1000 * 4)} style={styles.glow}>
        <Image style={styles.glow} source={require('@/assets/images/logo-glow.png')} />
      </Animated.View>

      <Animated.View entering={keyframe.duration(DURATION)} style={styles.background} />
      <Animated.View style={styles.imageContainer} entering={logoKeyframe.duration(DURATION)}>
        <Image style={styles.image} source={require('@/assets/images/expo-logo.png')} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#EDEAE5',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  iconWrap: {
    marginBottom: 24,
  },
  icon: {
    width: 120,
    height: 120,
    borderRadius: 28,
  },
  textWrap: {
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a2b3c',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 15,
    color: '#6b7f8f',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    width: 201,
    height: 201,
    position: 'absolute',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 128,
    height: 128,
    zIndex: 100,
  },
  image: {
    position: 'absolute',
    width: 76,
    height: 71,
  },
  background: {
    borderRadius: 40,
    experimental_backgroundImage: `linear-gradient(180deg, #3C9FFE, #0274DF)`,
    width: 128,
    height: 128,
    position: 'absolute',
  },
});
