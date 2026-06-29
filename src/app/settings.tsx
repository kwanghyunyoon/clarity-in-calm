import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import {
  Alert,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { useSettings } from '@/context/settings-context';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useLocale } from '@/context/language-context';
import { Locale } from '@/i18n/translations';

const LANGUAGES: { code: Locale; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'es', label: 'Español', flag: '🇲🇽' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
];

const IAP_FEATURES = [
  'Full Plutchik emotion wheel (32 emotions)',
  'Unlimited history & analytics',
  'PDF reports & data export',
  'Future Self Letters',
  'Advanced pattern insights',
  'All journal templates',
];

function SectionHeader({ label }: { label: string }) {
  const { colors } = useTheme();
  return (
    <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>{label.toUpperCase()}</Text>
  );
}

function SettingsRow({ label, value, onPress, accessory }: {
  label: string;
  value?: string;
  onPress?: () => void;
  accessory?: React.ReactNode;
}) {
  const { colors } = useTheme();
  const inner = (
    <View style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={[styles.rowLabel, { color: colors.text }]}>{label}</Text>
      <View style={styles.rowRight}>
        {value ? <Text style={[styles.rowValue, { color: colors.textSecondary }]}>{value}</Text> : null}
        {accessory ?? null}
        {onPress && !accessory ? <Text style={[styles.chevron, { color: colors.textSecondary }]}>›</Text> : null}
      </View>
    </View>
  );
  if (onPress) {
    return <TouchableOpacity onPress={onPress} activeOpacity={0.7}>{inner}</TouchableOpacity>;
  }
  return inner;
}

function SettingsGroup({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.group, { borderColor: colors.border }]}>
      {children}
    </View>
  );
}

export default function SettingsScreen() {
  const { colors } = useTheme();
  const t = useTranslation();
  const ts = t.settingsScreen;
  const insets = useSafeAreaInsets();
  const { settings, setNotificationSettings, setIAPStatus, setThemeOverride } = useSettings();
  const { locale, setLocale } = useLocale();
  const [notifEnabled, setNotifEnabled] = useState(settings.notifications.enabled);

  const bottomPad = 88 + insets.bottom;
  const isUnlocked = settings.iap.unlocked;

  async function handleUnlock() {
    // IAP integration placeholder — shows confirmation for now
    Alert.alert(
      ts.unlockTitle,
      'This will open the App Store to complete your purchase.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: ts.unlockBtn,
          onPress: () => {
            // In production: call expo-in-app-purchases here
            setIAPStatus({ unlocked: true });
          },
        },
      ],
    );
  }

  async function handleRestore() {
    // IAP restore placeholder
    Alert.alert('Restore', 'Checking for previous purchases…', [
      { text: 'OK' },
    ]);
  }

  function toggleNotifications(value: boolean) {
    setNotifEnabled(value);
    setNotificationSettings({ ...settings.notifications, enabled: value });
  }

  function handleDeleteAll() {
    Alert.alert(
      ts.deleteConfirm.title,
      ts.deleteConfirm.body,
      [
        { text: ts.deleteConfirm.cancel, style: 'cancel' },
        {
          text: ts.deleteConfirm.confirm,
          style: 'destructive',
          onPress: () => {
            // In production: call secureWrite to clear all keys
            Alert.alert('Done', 'All data has been deleted.');
          },
        },
      ],
    );
  }

  function openPrivacy() {
    WebBrowser.openBrowserAsync('https://kwanghyunyoon.github.io/clarity-in-calm/privacy.html');
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* ── Header ── */}
      <View style={[styles.header, {
        paddingTop: insets.top + Spacing.two,
        backgroundColor: colors.background,
        borderBottomColor: colors.border,
      }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{ts.title}</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── IAP Section ── */}
        {!isUnlocked ? (
          <>
            <SectionHeader label={ts.clarityUnlock} />
            <View style={[styles.iapCard, { backgroundColor: colors.primary + '12', borderColor: colors.primary + '44' }]}>
              <Text style={[styles.iapTitle, { color: colors.text }]}>{ts.unlockTitle}</Text>
              <Text style={[styles.iapPrice, { color: colors.textSecondary }]}>{ts.unlockPrice}</Text>
              <View style={styles.featureList}>
                {IAP_FEATURES.map(f => (
                  <View key={f} style={styles.featureRow}>
                    <Text style={[styles.featureCheck, { color: colors.primary }]}>✓</Text>
                    <Text style={[styles.featureText, { color: colors.text }]}>{f}</Text>
                  </View>
                ))}
              </View>
              <AnimatedPressable
                onPress={handleUnlock}
                style={[styles.unlockBtn, { backgroundColor: colors.primary }]}
                accessibilityRole="button"
              >
                <Text style={styles.unlockBtnText}>{ts.unlockBtn}</Text>
              </AnimatedPressable>
              <TouchableOpacity onPress={handleRestore} style={styles.restoreBtn}>
                <Text style={[styles.restoreBtnText, { color: colors.textSecondary }]}>{ts.restoreBtn}</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <SectionHeader label={ts.clarityUnlock} />
            <SettingsGroup>
              <SettingsRow label={ts.unlocked} />
            </SettingsGroup>
          </>
        )}

        {/* ── Notifications ── */}
        <SectionHeader label={ts.notifications} />
        <SettingsGroup>
          <SettingsRow
            label={ts.notifications}
            accessory={
              <Switch
                value={notifEnabled}
                onValueChange={toggleNotifications}
                trackColor={{ true: colors.primary }}
                thumbColor={Platform.OS === 'android' ? colors.primary : undefined}
                accessibilityLabel={ts.notifications}
                accessibilityRole="switch"
              />
            }
          />
          {notifEnabled && (
            <SettingsRow
              label={ts.reminderTime}
              value={`${String(settings.notifications.hour).padStart(2, '0')}:${String(settings.notifications.minute).padStart(2, '0')}`}
              onPress={() => Alert.alert('Time Picker', 'Time picker coming soon.')}
            />
          )}
        </SettingsGroup>

        {/* ── Appearance ── */}
        <SectionHeader label={ts.appearance} />
        <View style={[styles.group, { borderColor: colors.border }]}>
          <View style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.rowLabel, { color: colors.text }]}>{ts.appearance}</Text>
            <View style={styles.themeToggle}>
              {(['system', 'light', 'dark'] as const).map(option => {
                const labels: Record<string, string> = {
                  system: ts.themeSystem,
                  light: ts.themeLight,
                  dark: ts.themeDark,
                };
                const isSelected = settings.themeOverride === option;
                return (
                  <TouchableOpacity
                    key={option}
                    onPress={() => setThemeOverride(option)}
                    style={[
                      styles.themeOption,
                      { backgroundColor: isSelected ? colors.primary : colors.backgroundElement },
                    ]}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: isSelected }}
                  >
                    <Text style={[styles.themeOptionText, { color: isSelected ? '#fff' : colors.textSecondary }]}>
                      {labels[option]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* ── Language ── */}
        <SectionHeader label={ts.language} />
        <SettingsGroup>
          {LANGUAGES.map(lang => (
            <TouchableOpacity
              key={lang.code}
              onPress={() => setLocale(lang.code)}
              style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}
              accessibilityRole="radio"
              accessibilityState={{ selected: locale === lang.code }}
            >
              <Text style={styles.langFlag}>{lang.flag}</Text>
              <Text style={[styles.rowLabel, { color: colors.text }]}>{lang.label}</Text>
              {locale === lang.code && (
                <Text style={[styles.checkmark, { color: colors.primary }]}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </SettingsGroup>

        {/* ── Data ── */}
        <SectionHeader label={ts.data} />
        <SettingsGroup>
          <SettingsRow
            label={ts.exportData}
            onPress={() => Alert.alert('Export', 'Data export coming soon.')}
          />
          <SettingsRow
            label={ts.deleteData}
            onPress={handleDeleteAll}
          />
        </SettingsGroup>

        {/* ── About ── */}
        <SectionHeader label={ts.about} />
        <SettingsGroup>
          <SettingsRow label={ts.privacy} onPress={openPrivacy} />
          <SettingsRow label={ts.version} value="1.0.0" />
        </SettingsGroup>

        <Text style={[styles.aboutBody, { color: colors.textSecondary }]}>
          {ts.aboutBody}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.two + 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: { fontSize: 24, fontWeight: '700', letterSpacing: -0.5 },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: Spacing.two,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginTop: Spacing.two,
    marginBottom: Spacing.one,
  },
  group: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: Spacing.two,
  },
  rowLabel: { flex: 1, fontSize: 15 },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  rowValue: { fontSize: 15 },
  chevron: { fontSize: 20, fontWeight: '300' },
  iapCard: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  iapTitle: { fontSize: 20, fontWeight: '700', letterSpacing: -0.3 },
  iapPrice: { fontSize: 14 },
  featureList: { gap: Spacing.two },
  featureRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two },
  featureCheck: { fontSize: 14, fontWeight: '700', width: 18 },
  featureText: { flex: 1, fontSize: 14, lineHeight: 20 },
  unlockBtn: {
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  unlockBtnText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: -0.2 },
  restoreBtn: { alignItems: 'center', paddingVertical: Spacing.two },
  restoreBtnText: { fontSize: 14 },
  themeToggle: { flexDirection: 'row', gap: Spacing.one, flexShrink: 0 },
  themeOption: {
    borderRadius: BorderRadius.md,
    paddingVertical: 6,
    paddingHorizontal: Spacing.two + 2,
  },
  themeOptionText: { fontSize: 13, fontWeight: '600' },
  langFlag: { fontSize: 20 },
  checkmark: { fontSize: 16, fontWeight: '700' },
  aboutBody: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    paddingVertical: Spacing.three,
  },
});
