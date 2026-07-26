/**
 * Per-slide onboarding visuals. Each slide (see t.onboarding.slides) has a
 * tailored illustration in addition to its title/body text; SlideVisual is
 * the router that picks the right one by page index.
 */
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { BASIC_EMOTIONS } from '@/constants/emotions';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';

export type ThemeColors = ReturnType<typeof useTheme>['colors'];
type Translation = ReturnType<typeof useTranslation>;

// Slide 0 — Welcome: gently pulsing lotus
function WelcomeVisual({ colors }: { colors: ThemeColors }) {
  const scale = useState(new Animated.Value(1)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.1, duration: 1400, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1,   duration: 1400, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [scale]);

  return (
    <Animated.View style={[s.welcomeOrb, { transform: [{ scale }] }]}>
      <Ionicons name="leaf-outline" size={64} color={colors.primary} />
    </Animated.View>
  );
}

// Slide 1 — Today: mini streak card + shortcut pills
function TodayVisual({ colors, t }: { colors: ThemeColors; t: Translation }) {
  return (
    <View style={s.todayWrap}>
      <View style={[s.streakCard, { backgroundColor: colors.backgroundElement }]}>
        <Ionicons name="flame" size={28} color={colors.primary} />
        <Text style={[s.streakNum, { color: colors.text }]}>7</Text>
        <Text style={[s.streakLabel, { color: colors.textSecondary }]}>{t.home.progress.streak}</Text>
      </View>
      <View style={s.pillRow}>
        <View style={[s.pill, s.pillRowInner, { backgroundColor: colors.primary + '22' }]}>
          <Ionicons name="book-outline" size={13} color={colors.primary} />
          <Text style={[s.pillText, { color: colors.primary }]}>{t.tabs.journal}</Text>
        </View>
        <View style={[s.pill, s.pillRowInner, { backgroundColor: colors.primary + '22' }]}>
          <Ionicons name="happy-outline" size={13} color={colors.primary} />
          <Text style={[s.pillText, { color: colors.primary }]}>{t.tabs.emotions}</Text>
        </View>
      </View>
    </View>
  );
}

// Slide 2 — Journal: template cards (mirrors 3 of the real JOURNAL_TEMPLATES)
function JournalVisual({ colors, t }: { colors: ThemeColors; t: Translation }) {
  const templates: { icon: React.ComponentProps<typeof Ionicons>['name']; label: string }[] = [
    { icon: 'create-outline', label: t.journalExtended.templateFreeWrite },
    { icon: 'sparkles-outline', label: t.journalExtended.templateGratitude },
    { icon: 'search-outline', label: t.journalExtended.templateCBT },
  ];
  return (
    <View style={s.templateWrap}>
      {templates.map((tmpl, i) => (
        <View
          key={i}
          style={[s.templateCard, { backgroundColor: colors.backgroundElement }]}
        >
          <Ionicons name={tmpl.icon} size={20} color={colors.text} />
          <Text style={[s.templateLabel, { color: colors.text }]}>{tmpl.label}</Text>
        </View>
      ))}
    </View>
  );
}

// Slide 3 — Emotions: mini preview of the emotion pill selector
function EmotionsVisual({ t }: { t: Translation }) {
  return (
    <View style={s.pillPreviewWrap}>
      {BASIC_EMOTIONS.map((emotion) => (
        <View
          key={emotion.id}
          style={[s.pillPreview, { backgroundColor: emotion.color + '22', borderColor: emotion.color }]}
        >
          <Text style={[s.pillPreviewText, { color: emotion.color }]}>
            {t.emotionsCatalog.basicEmotions[emotion.id as keyof typeof t.emotionsCatalog.basicEmotions] ?? emotion.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

// Slide 4 — Insights: mini bar chart
const BAR_HEIGHTS = [40, 60, 30, 80, 55, 70, 45];
function InsightsVisual({ colors, t }: { colors: ThemeColors; t: Translation }) {
  const barLabels = t.settingsScreen.daysShort;
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
          <Text style={[s.barLabel, { color: colors.textSecondary }]}>{barLabels[i]}</Text>
        </View>
      ))}
    </View>
  );
}

// Slide 5 — Settings: gear + toggle rows
function SettingsVisual({ colors, t }: { colors: ThemeColors; t: Translation }) {
  const rows: { icon: React.ComponentProps<typeof Ionicons>['name']; label: string }[] = [
    { icon: 'notifications-outline', label: t.settingsScreen.notifications },
    { icon: 'globe-outline', label: t.settingsScreen.language },
    { icon: 'color-palette-outline', label: t.settingsScreen.appearance },
  ];
  return (
    <View style={s.settingsWrap}>
      <Ionicons name="settings-outline" size={40} color={colors.text} />
      <View style={s.settingsRows}>
        {rows.map((row) => (
          <View key={row.label} style={[s.settingsRow, s.settingsRowInner, { backgroundColor: colors.backgroundElement }]}>
            <Ionicons name={row.icon} size={16} color={colors.text} />
            <Text style={[s.settingsRowText, { color: colors.text }]}>{row.label}</Text>
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

export function SlideVisual({ page, colors, t }: { page: number; colors: ThemeColors; t: Translation }) {
  switch (page) {
    case 0: return <WelcomeVisual colors={colors} />;
    case 1: return <TodayVisual colors={colors} t={t} />;
    case 2: return <JournalVisual colors={colors} t={t} />;
    case 3: return <EmotionsVisual t={t} />;
    case 4: return <InsightsVisual colors={colors} t={t} />;
    case 5: return <SettingsVisual colors={colors} t={t} />;
    case 6: return <ShieldVisual />;
    default: return null;
  }
}

const s = StyleSheet.create({
  // Welcome
  welcomeOrb:   { width: 120, height: 120, borderRadius: 60,
                  backgroundColor: 'rgba(130,190,130,0.15)',
                  alignItems: 'center', justifyContent: 'center' },
  // Today
  todayWrap:     { alignItems: 'center', gap: Spacing.two },
  streakCard:    { borderRadius: 18, paddingHorizontal: Spacing.five, paddingVertical: Spacing.two,
                   alignItems: 'center', flexDirection: 'row', gap: Spacing.two },
  streakNum:     { fontSize: 36, fontWeight: '800', lineHeight: 42 },
  streakLabel:   { fontSize: 12, fontWeight: '600' },
  pillRow:       { flexDirection: 'row', gap: Spacing.two },
  pill:          { borderRadius: 50, paddingHorizontal: Spacing.three, paddingVertical: Spacing.one + 2 },
  pillRowInner:  { flexDirection: 'row', alignItems: 'center', gap: 6 },
  pillText:      { fontSize: 13, fontWeight: '700' },

  // Journal templates
  templateWrap:  { gap: Spacing.one + 2 },
  templateCard:  { flexDirection: 'row', alignItems: 'center', gap: Spacing.two,
                   borderRadius: 12, paddingHorizontal: Spacing.three,
                   paddingVertical: Spacing.one + 4, width: 180 },
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
  settingsRows:     { gap: Spacing.one + 2 },
  settingsRow:      { borderRadius: 12, paddingHorizontal: Spacing.three,
                      paddingVertical: Spacing.one + 4, width: 180 },
  settingsRowInner: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  settingsRowText:  { fontSize: 14, fontWeight: '600' },

  // Privacy shield
  shieldWrap:   { width: 120, height: 120, borderRadius: 60,
                  backgroundColor: 'rgba(52,168,83,0.15)',
                  alignItems: 'center', justifyContent: 'center' },
});
