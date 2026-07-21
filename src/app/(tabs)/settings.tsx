import { Directory, File, Paths } from 'expo-file-system';
import { router } from 'expo-router';
import * as Sharing from 'expo-sharing';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LANGUAGES } from '@/constants/languages';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useHelp } from '@/context/help-context';
import { useSettings } from '@/context/settings-context';
import { useWellness } from '@/context/wellness-context';
import { ALL_DATA_KEYS } from '@/lib/data-registry';
import { buildClarityAIExport } from '@/lib/clarityai-export';
import { deleteAllData, readAllData } from '@/lib/data-keys';
import {
  cancelDailyReminder,
  requestNotificationPermission,
  scheduleDailyReminder,
} from '@/lib/notifications';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useLocale } from '@/context/language-context';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/useAuthStore';

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

// ── Account (optional sign-in) ──────────────────────────────────────────────────
function AccountSection() {
  const { colors } = useTheme();
  const ta = useTranslation().settingsScreen.account;
  const user = useAuthStore(s => s.user);
  const signOut = useAuthStore(s => s.signOut);
  const [deleting, setDeleting] = useState(false);

  function confirmDelete() {
    Alert.alert(
      ta.deleteConfirm.title,
      ta.deleteConfirm.body,
      [
        { text: ta.deleteConfirm.cancel, style: 'cancel' },
        { text: ta.deleteConfirm.confirm, style: 'destructive', onPress: () => void handleDelete() },
      ],
    );
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const { error } = await supabase.functions.invoke('delete-account');
      if (error) {
        Alert.alert(ta.deleteError.title, error.message);
        return;
      }
      await supabase.auth.signOut();
    } catch {
      Alert.alert(ta.deleteError.title, ta.deleteError.body);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <SectionHeader label={ta.header} />
      <SettingsGroup>
        {user ? (
          <>
            <SettingsRow label={ta.header} value={user.email ?? undefined} />
            <SettingsRow label={ta.signOut} onPress={() => void signOut()} />
            <SettingsRow
              label={ta.deleteAccount}
              onPress={deleting ? undefined : confirmDelete}
              accessory={deleting ? <ActivityIndicator color={colors.primary} /> : undefined}
            />
          </>
        ) : (
          <SettingsRow label={ta.signIn} onPress={() => router.push('/(auth)/sign-in')} />
        )}
      </SettingsGroup>
    </>
  );
}

// ── Time picker modal ──────────────────────────────────────────────────────────
function TimePicker({
  visible,
  hour,
  minute,
  onConfirm,
  onClose,
}: {
  visible: boolean;
  hour: number;
  minute: number;
  onConfirm: (h: number, m: number) => void;
  onClose: () => void;
}) {
  const { colors } = useTheme();
  const tt = useTranslation().settingsScreen.timePicker;
  const [h, setH] = useState(hour);
  const [m, setM] = useState(minute);

  const HOURS = Array.from({ length: 24 }, (_, i) => i);
  const MINUTES = [0, 15, 30, 45];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={tp.overlay}>
        <View style={[tp.sheet, { backgroundColor: colors.surface }]}>
          <Text style={[tp.title, { color: colors.text }]}>{tt.title}</Text>

          <View style={tp.row}>
            {/* Hour picker */}
            <View style={tp.col}>
              <Text style={[tp.colLabel, { color: colors.textSecondary }]}>{tt.hourLabel}</Text>
              <ScrollView style={tp.scroll} showsVerticalScrollIndicator={false}>
                {HOURS.map(hh => (
                  <TouchableOpacity
                    key={hh}
                    onPress={() => setH(hh)}
                    style={[tp.item, hh === h && { backgroundColor: colors.primary + '22' }]}
                  >
                    <Text style={[tp.itemText, { color: hh === h ? colors.primary : colors.text }]}>
                      {String(hh).padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <Text style={[tp.colon, { color: colors.text }]}>:</Text>

            {/* Minute picker */}
            <View style={tp.col}>
              <Text style={[tp.colLabel, { color: colors.textSecondary }]}>{tt.minuteLabel}</Text>
              <ScrollView style={tp.scroll} showsVerticalScrollIndicator={false}>
                {MINUTES.map(mm => (
                  <TouchableOpacity
                    key={mm}
                    onPress={() => setM(mm)}
                    style={[tp.item, mm === m && { backgroundColor: colors.primary + '22' }]}
                  >
                    <Text style={[tp.itemText, { color: mm === m ? colors.primary : colors.text }]}>
                      {String(mm).padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <TouchableOpacity
            style={[tp.btn, { backgroundColor: colors.primary }]}
            onPress={() => onConfirm(h, m)}
          >
            <Text style={tp.btnText}>{tt.confirm}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={tp.cancel}>
            <Text style={[tp.cancelText, { color: colors.textSecondary }]}>{tt.cancel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function SettingsScreen() {
  const { colors } = useTheme();
  const t = useTranslation();
  const ts = t.settingsScreen;
  const insets = useSafeAreaInsets();
  const { settings, setNotificationSettings, setThemeOverride } = useSettings();
  const { locale, setLocale } = useLocale();
  const { showHelp } = useHelp();
  const { entries, breathingSessions } = useWellness();

  const [showTimePicker, setShowTimePicker] = useState(false);

  const notifEnabled = settings.notifications.enabled;
  const bottomPad = 88 + insets.bottom;

  // ── Notifications ──────────────────────────────────────────────────────────

  async function toggleNotifications(value: boolean) {
    if (value) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        Alert.alert(ts.notifPermission.title, ts.notifPermission.body);
        return;
      }
      await scheduleDailyReminder(settings.notifications.hour, settings.notifications.minute);
    } else {
      await cancelDailyReminder();
    }
    setNotificationSettings({ ...settings.notifications, enabled: value });
  }

  async function handleTimeConfirm(h: number, m: number) {
    setShowTimePicker(false);
    await scheduleDailyReminder(h, m);
    setNotificationSettings({ ...settings.notifications, hour: h, minute: m });
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

  async function handleExport() {
    try {
      const payload: Record<string, unknown> = {
        exportedAt: new Date().toISOString(),
        ...(await readAllData(ALL_DATA_KEYS)),
      };
      const json = JSON.stringify(payload, null, 2);
      const filename = `clarity-export-${new Date().toISOString().slice(0, 10)}.json`;
      const file = new File(new Directory(Paths.cache), filename);
      file.write(json);
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(file.uri, { mimeType: 'application/json', dialogTitle: 'Export data' });
      } else {
        Alert.alert(ts.exportSaved.title, `${ts.exportSaved.bodyPrefix}${file.uri}`);
      }
    } catch (e: any) {
      Alert.alert(ts.exportFailed.title, e.message ?? ts.exportFailed.fallbackBody);
    }
  }

  async function handleShareClarityAI() {
    try {
      const payload = buildClarityAIExport(entries, breathingSessions);
      const json = JSON.stringify(payload, null, 2);
      const filename = `clarity-clarityai-${new Date().toISOString().slice(0, 10)}.json`;
      const file = new File(new Directory(Paths.cache), filename);
      file.write(json);
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(file.uri, { mimeType: 'application/json', dialogTitle: 'Share data with ClarityAI' });
      } else {
        Alert.alert(ts.exportSaved.title, `${ts.exportSaved.bodyPrefix}${file.uri}`);
      }
    } catch (e: any) {
      Alert.alert(ts.exportFailed.title, e.message ?? ts.exportFailed.fallbackBody);
    }
  }

  function openPrivacy() {
    WebBrowser.openBrowserAsync('https://kwanghyunyoon.github.io/clarity-in-calm-privacy/');
  }

  function openYoutube() {
    WebBrowser.openBrowserAsync('https://www.youtube.com/@ClarityinCalm');
  }

  // ── Render ─────────────────────────────────────────────────────────────────

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
            <SettingsRow
              label={ts.reminderTime}
              value={`${String(settings.notifications.hour).padStart(2, '0')}:${String(settings.notifications.minute).padStart(2, '0')}`}
              onPress={() => setShowTimePicker(true)}
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
            label={ts.exportData}
            onPress={handleExport}
          />
          <SettingsRow
            label={ts.shareClarityAI}
            onPress={handleShareClarityAI}
          />
          <SettingsRow
            label={ts.deleteData}
            onPress={handleDeleteAll}
          />
        </SettingsGroup>

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

const tp = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: Spacing.four },
  sheet: { borderRadius: BorderRadius.xl, padding: Spacing.four, gap: Spacing.three },
  title: { fontSize: 18, fontWeight: '700', textAlign: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.four },
  col: { alignItems: 'center', gap: Spacing.two },
  colLabel: { fontSize: 12, fontWeight: '600', letterSpacing: 0.5 },
  scroll: { height: 180 },
  item: { paddingVertical: 10, paddingHorizontal: Spacing.three, borderRadius: BorderRadius.md, minWidth: 56, alignItems: 'center' },
  itemText: { fontSize: 18, fontWeight: '600' },
  colon: { fontSize: 24, fontWeight: '700', marginTop: 28 },
  btn: { borderRadius: BorderRadius.xl, paddingVertical: Spacing.three, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  cancel: { alignItems: 'center', paddingVertical: Spacing.two },
  cancelText: { fontSize: 14 },
});
