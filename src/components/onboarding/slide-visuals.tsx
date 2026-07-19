/**
 * Per-slide onboarding visuals. Each slide (see t.onboarding.slides) has a
 * tailored illustration in addition to its title/body text; SlideVisual is
 * the router that picks the right one by page index.
 */
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { BASIC_EMOTIONS } from '@/constants/emotions';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemeColors = ReturnType<typeof useTheme>['colors'];

// Slide 0 — Welcome: gently pulsing lotus
function WelcomeVisual() {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.1, duration: 1400, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1,   duration: 1400, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <Animated.View style={[s.welcomeOrb, { transform: [{ scale }] }]}>
      <Text style={s.welcomeEmoji}>🌿</Text>
    </Animated.View>
  );
}

// Slide 1 — Today: mini streak card + shortcut pills
function TodayVisual({ colors }: { colors: ThemeColors }) {
  return (
    <View style={s.todayWrap}>
      <View style={[s.streakCard, { backgroundColor: colors.backgroundElement }]}>
        <Text style={s.streakFlame}>🔥</Text>
        <Text style={[s.streakNum, { color: colors.text }]}>7</Text>
        <Text style={[s.streakLabel, { color: colors.textSecondary }]}>day streak</Text>
      </View>
      <View style={s.pillRow}>
        <View style={[s.pill, { backgroundColor: colors.primary + '22' }]}>
          <Text style={[s.pillText, { color: colors.primary }]}>📖 Journal</Text>
        </View>
        <View style={[s.pill, { backgroundColor: colors.primary + '22' }]}>
          <Text style={[s.pillText, { color: colors.primary }]}>🎭 Emotions</Text>
        </View>
      </View>
    </View>
  );
}

// Slide 2 — Journal: template cards
const TEMPLATE_LABELS = [
  { icon: '✏️', label: 'Free Write' },
  { icon: '🙏', label: 'Gratitude' },
  { icon: '🔄', label: 'Reframe' },
];
function JournalVisual({ colors }: { colors: ThemeColors }) {
  return (
    <View style={s.templateWrap}>
      {TEMPLATE_LABELS.map((t, i) => (
        <View
          key={i}
          style={[s.templateCard, { backgroundColor: colors.backgroundElement }]}
        >
          <Text style={s.templateIcon}>{t.icon}</Text>
          <Text style={[s.templateLabel, { color: colors.text }]}>{t.label}</Text>
        </View>
      ))}
    </View>
  );
}

// Slide 3 — Emotions: mini preview of the emotion pill selector
function EmotionsVisual() {
  return (
    <View style={s.pillPreviewWrap}>
      {BASIC_EMOTIONS.map((emotion) => (
        <View
          key={emotion.id}
          style={[s.pillPreview, { backgroundColor: emotion.color + '22', borderColor: emotion.color }]}
        >
          <Text style={[s.pillPreviewText, { color: emotion.color }]}>{emotion.label}</Text>
        </View>
      ))}
    </View>
  );
}

// Slide 4 — Insights: mini bar chart
const BAR_HEIGHTS = [40, 60, 30, 80, 55, 70, 45];
const BAR_LABELS  = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
function InsightsVisual({ colors }: { colors: ThemeColors }) {
  return (
    <View style={s.chartWrap}>
      {BAR_HEIGHTS.map((h, i) => (
        <View key={i} style={s.barCol}>
          <View
            style={[
              s.bar,
              { height: h, backgroundColor: colors.primary, opacity: 0.6 + i * 0.06 },
            ]}
          />
          <Text style={[s.barLabel, { color: colors.textSecondary }]}>{BAR_LABELS[i]}</Text>
        </View>
      ))}
    </View>
  );
}

// Slide 5 — Settings: gear + toggle rows
function SettingsVisual({ colors }: { colors: ThemeColors }) {
  return (
    <View style={s.settingsWrap}>
      <Text style={s.settingsGear}>⚙️</Text>
      <View style={s.settingsRows}>
        {['🔔 Reminders', '🌐 Language', '🎨 Theme'].map((label) => (
          <View key={label} style={[s.settingsRow, { backgroundColor: colors.backgroundElement }]}>
            <Text style={[s.settingsRowText, { color: colors.text }]}>{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// Slide 6 — Privacy shield: big green shield icon
function ShieldVisual() {
  return (
    <View style={s.shieldWrap}>
      <Svg width={72} height={80} viewBox="0 0 24 26">
        <Path
          d="M12 1 L22 5 V12 C22 18.5 17.8 23.3 12 25 C6.2 23.3 2 18.5 2 12 V5 Z"
          fill="#34A853"
        />
        <Path
          d="M7.5 12.8 L10.5 15.8 L16.8 9.2"
          stroke="#ffffff"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
    </View>
  );
}

export function SlideVisual({ page, colors }: { page: number; colors: ThemeColors }) {
  switch (page) {
    case 0: return <WelcomeVisual />;
    case 1: return <TodayVisual colors={colors} />;
    case 2: return <JournalVisual colors={colors} />;
    case 3: return <EmotionsVisual />;
    case 4: return <InsightsVisual colors={colors} />;
    case 5: return <SettingsVisual colors={colors} />;
    case 6: return <ShieldVisual />;
    default: return null;
  }
}

const s = StyleSheet.create({
  // Welcome
  welcomeOrb:   { width: 120, height: 120, borderRadius: 60,
                  backgroundColor: 'rgba(130,190,130,0.15)',
                  alignItems: 'center', justifyContent: 'center' },
  welcomeEmoji: { fontSize: 64 },

  // Today
  todayWrap:     { alignItems: 'center', gap: Spacing.two },
  streakCard:    { borderRadius: 18, paddingHorizontal: Spacing.five, paddingVertical: Spacing.two,
                   alignItems: 'center', flexDirection: 'row', gap: Spacing.two },
  streakFlame:   { fontSize: 28 },
  streakNum:     { fontSize: 36, fontWeight: '800', lineHeight: 42 },
  streakLabel:   { fontSize: 12, fontWeight: '600' },
  pillRow:       { flexDirection: 'row', gap: Spacing.two },
  pill:          { borderRadius: 50, paddingHorizontal: Spacing.three, paddingVertical: Spacing.one + 2 },
  pillText:      { fontSize: 13, fontWeight: '700' },

  // Journal templates
  templateWrap:  { gap: Spacing.one + 2 },
  templateCard:  { flexDirection: 'row', alignItems: 'center', gap: Spacing.two,
                   borderRadius: 12, paddingHorizontal: Spacing.three,
                   paddingVertical: Spacing.one + 4, width: 180 },
  templateIcon:  { fontSize: 20 },
  templateLabel: { fontSize: 14, fontWeight: '600' },

  // Emotions pill preview
  pillPreviewWrap:  { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two,
                      justifyContent: 'center', maxWidth: 280 },
  pillPreview:      { borderRadius: 50, borderWidth: 1.5,
                      paddingHorizontal: Spacing.three, paddingVertical: Spacing.one + 4 },
  pillPreviewText:  { fontSize: 14, fontWeight: '700' },

  // Insights chart
  chartWrap:     { flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: 90 },
  barCol:        { alignItems: 'center', gap: 4 },
  bar:           { width: 20, borderRadius: 5 },
  barLabel:      { fontSize: 10, fontWeight: '600' },

  // Settings
  settingsWrap:     { alignItems: 'center', gap: Spacing.two },
  settingsGear:     { fontSize: 40 },
  settingsRows:     { gap: Spacing.one + 2 },
  settingsRow:      { borderRadius: 12, paddingHorizontal: Spacing.three,
                      paddingVertical: Spacing.one + 4, width: 180 },
  settingsRowText:  { fontSize: 14, fontWeight: '600' },

  // Privacy shield
  shieldWrap:   { width: 120, height: 120, borderRadius: 60,
                  backgroundColor: 'rgba(52,168,83,0.15)',
                  alignItems: 'center', justifyContent: 'center' },
});
