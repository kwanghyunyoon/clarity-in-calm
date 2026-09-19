import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AccountSection } from '@/components/settings/AccountSection';
import { MoreFromUsSection } from '@/components/settings/MoreFromUsSection';
import { TimePicker, formatTime12h } from '@/components/settings/TimePicker';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Screen, ScreenHeader } from '@/components/ui/Screen';
import { SettingsGroup } from '@/components/ui/SettingsGroup';
import { SettingsRow } from '@/components/ui/SettingsRow';
import { LANGUAGES } from '@/constants/languages';
import { BorderRadius, Spacing, TAB_BAR_CLEARANCE } from '@/constants/theme';
import { useHelp } from '@/context/help-context';
import { useSettings } from '@/context/settings-context';
import { ALL_DATA_KEYS } from '@/lib/data-registry';
import { deleteAllData } from '@/lib/data-keys';
import {
  cancelDailyReminder,
  requestNotificationPermission,
  scheduleDailyReminder,
} from '@/lib/notifications';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useLocale } from '@/context/language-context';

export default function SettingsScreen() {
  const { colors } = useTheme();
  const t = useTranslation();
  const ts = t.settingsScreen;
  const insets = useSafeAreaInsets();
  const { settings, setNotificationSettings, setThemeOverride } = useSettings();
  const { locale, setLocale } = useLocale();
  const { showHelp } = useHelp();

  const [showTimePicker, setShowTimePicker] = useState(false);

  const notifEnabled = settings.notifications.enabled;
  const bottomPad = TAB_BAR_CLEARANCE + insets.bottom;

  // ── Notifications ──────────────────────────────────────────────────────────

  async function toggleNotifications(value: boolean) {
    if (value) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        Alert.alert(ts.notifPermission.title, ts.notifPermission.body);
        return;
      }
      await scheduleDailyReminder(
        settings.notifications.hour,
        settings.notifications.minute,
        t.dailyContent.reminderTitle,
        t.dailyContent.reminderBodies,
        settings.notifications.days,
      );
    } else {
      await cancelDailyReminder();
    }
    setNotificationSettings({ ...settings.notifications, enabled: value });
  }

  async function handleTimeConfirm(h: number, m: number) {
    setShowTimePicker(false);
    await scheduleDailyReminder(
      h,
      m,
      t.dailyContent.reminderTitle,
      t.dailyContent.reminderBodies,
      settings.notifications.days,
    );
    setNotificationSettings({ ...settings.notifications, hour: h, minute: m });
  }

  async function toggleReminderDay(day: number) {
    const current = settings.notifications.days;
    const days = current.includes(day)
      ? current.filter(d => d !== day)
      : [...current, day].sort((a, b) => a - b);
    await scheduleDailyReminder(
      settings.notifications.hour,
      settings.notifications.minute,
      t.dailyContent.reminderTitle,
      t.dailyContent.reminderBodies,
      days,
    );
    setNotificationSettings({ ...settings.notifications, days });
  }

  // ── Data ───────────────────────────────────────────────────────────────────

  function handleDeleteAll() {
    Alert.alert(
      ts.deleteConfirm.title,
      ts.deleteConfirm.body,
      [
        { text: ts.deleteConfirm.cancel, style: 'cancel' },
        {
          text: ts.deleteConfirm.confirm,
          style: 'destructive',
          onPress: async () => {
            await deleteAllData(ALL_DATA_KEYS);
            Alert.alert(ts.dataDeleted.title, ts.dataDeleted.body);
          },
        },
      ],
    );
  }

  function openPrivacy() {
    WebBrowser.openBrowserAsync('https://kwanghyunyoon.github.io/clarity-in-calm-privacy/');
  }

  function openYoutube() {
    WebBrowser.openBrowserAsync('https://www.youtube.com/@ClarityinCalm');
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <Screen>
      <ScreenHeader>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{ts.title}</Text>
      </ScreenHeader>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Account ── */}
        <AccountSection />

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
            <>
              <SettingsRow
                label={ts.reminderTime}
                value={formatTime12h(
                  settings.notifications.hour,
                  settings.notifications.minute,
                  ts.timePicker.am,
                  ts.timePicker.pm,
                )}
                onPress={() => setShowTimePicker(true)}
              />
              <View style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.rowLabel, { color: colors.text }]}>{ts.reminderDays}</Text>
                <View style={styles.dayToggle}>
                  {ts.weekdayShort.map((label, day) => {
                    const isSelected = settings.notifications.days.includes(day);
                    return (
                      <TouchableOpacity
                        key={day}
                        onPress={() => toggleReminderDay(day)}
                        style={[
                          styles.dayOption,
                          { backgroundColor: isSelected ? colors.primary : colors.backgroundElement },
                        ]}
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: isSelected }}
                        accessibilityLabel={label}
                      >
                        <Text style={[styles.dayOptionText, { color: isSelected ? '#fff' : colors.textSecondary }]}>
                          {label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
              <Text style={[styles.cadenceHint, { color: colors.textSecondary }]}>{ts.reminderCadenceHint}</Text>
            </>
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
              key={lang.locale}
              onPress={() => setLocale(lang.locale)}
              style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}
              accessibilityRole="radio"
              accessibilityState={{ selected: locale === lang.locale }}
            >
              <Text style={styles.langFlag}>{lang.flag}</Text>
              <Text style={[styles.rowLabel, { color: colors.text }]}>{lang.nativeName}</Text>
              {locale === lang.locale && (
                <Text style={[styles.checkmark, { color: colors.primary }]}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </SettingsGroup>

        {/* ── Data ── */}
        <SectionHeader label={ts.data} />
        <SettingsGroup>
          <SettingsRow
            label={ts.backupRestore}
            onPress={() => router.push('/backup')}
          />
          <SettingsRow
            label={ts.deleteData}
            onPress={handleDeleteAll}
          />
        </SettingsGroup>

        {/* ── More from us ── */}
        <MoreFromUsSection />

        {/* ── About ── */}
        <SectionHeader label={ts.about} />
        <SettingsGroup>
          <SettingsRow label={t.onboarding.replayOnboarding} onPress={showHelp} />
          <SettingsRow label={ts.privacy} onPress={openPrivacy} />
          <SettingsRow label={ts.youtube} onPress={openYoutube} />
          <SettingsRow label={ts.version} value="1.0.0" />
        </SettingsGroup>

        <Text style={[styles.aboutBody, { color: colors.textSecondary }]}>
          {ts.aboutBody}
        </Text>
      </ScrollView>

      <TimePicker
        visible={showTimePicker}
        hour={settings.notifications.hour}
        minute={settings.notifications.minute}
        onConfirm={handleTimeConfirm}
        onClose={() => setShowTimePicker(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerTitle: { fontSize: 24, fontWeight: '700', letterSpacing: -0.5 },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: Spacing.two,
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
  themeToggle: { flexDirection: 'row', gap: Spacing.one, flexShrink: 0 },
  themeOption: {
    borderRadius: BorderRadius.md,
    paddingVertical: 6,
    paddingHorizontal: Spacing.two + 2,
  },
  themeOptionText: { fontSize: 13, fontWeight: '600' },
  dayToggle: { flexDirection: 'row', gap: Spacing.one, flexShrink: 0 },
  dayOption: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayOptionText: { fontSize: 12, fontWeight: '600' },
  cadenceHint: {
    fontSize: 12,
    lineHeight: 16,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  langFlag: { fontSize: 20 },
  checkmark: { fontSize: 16, fontWeight: '700' },
  aboutBody: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    paddingVertical: Spacing.three,
  },
});
