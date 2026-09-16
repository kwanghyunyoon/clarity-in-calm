import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Screen, ScreenHeader } from '@/components/ui/Screen';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useSettings } from '@/context/settings-context';
import { createBackup } from '@/lib/backup-crypto';
import { ALL_DATA_KEYS } from '@/lib/data-registry';
import { readAllData } from '@/lib/data-keys';
import { shareJsonFile } from '@/lib/share-json-file';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';

export default function BackupScreen() {
  const { colors } = useTheme();
  const t = useTranslation();
  const tb = t.backupScreen;
  const { setLastBackupAt } = useSettings();

  const [passphrase, setPassphrase] = useState('');
  const [confirmPassphrase, setConfirmPassphrase] = useState('');
  const [creating, setCreating] = useState(false);

  const mismatch = confirmPassphrase.length > 0 && passphrase !== confirmPassphrase;
  const canCreate = passphrase.length > 0 && passphrase === confirmPassphrase && !creating;

  async function handleCreateBackup() {
    if (!canCreate) return;
    setCreating(true);
    try {
      const data = await readAllData(ALL_DATA_KEYS);
      const envelope = await createBackup(data, passphrase);
      const json = JSON.stringify(envelope);
      const filename = `clarity-backup-${new Date().toISOString().slice(0, 10)}.json`;
      const { shared, uri } = await shareJsonFile(json, filename, tb.title);

      setLastBackupAt(new Date().toISOString());

      if (shared) {
        Alert.alert(tb.backupDone.title, tb.backupDone.body, [{ text: 'OK', onPress: () => router.back() }]);
      } else {
        Alert.alert(
          t.settingsScreen.exportSaved.title,
          `${t.settingsScreen.exportSaved.bodyPrefix}${uri}`,
          [{ text: 'OK', onPress: () => router.back() }],
        );
      }
      setPassphrase('');
      setConfirmPassphrase('');
    } catch (e: any) {
      Alert.alert(tb.backupFailed.title, e.message ?? tb.backupFailed.fallbackBody);
    } finally {
      setCreating(false);
    }
  }

  return (
    <Screen>
      <ScreenHeader style={styles.headerGap}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityLabel={tb.back}
          accessibilityRole="button"
        >
          <Text style={[styles.backBtn, { color: colors.textSecondary }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{tb.title}</Text>
      </ScreenHeader>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{tb.subtitle}</Text>

          <View style={[styles.warningBox, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
            <Text style={[styles.warningTitle, { color: colors.text }]}>{tb.warningTitle}</Text>
            <Text style={[styles.warningBody, { color: colors.textSecondary }]}>{tb.warningBody}</Text>
          </View>

          <Text style={[styles.label, { color: colors.textSecondary }]}>{tb.passphraseLabel}</Text>
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
            value={passphrase}
            onChangeText={setPassphrase}
            placeholder={tb.passphrasePlaceholder}
            placeholderTextColor={colors.textSecondary}
            secureTextEntry
            autoCapitalize="none"
            editable={!creating}
          />

          <Text style={[styles.label, { color: colors.textSecondary }]}>{tb.confirmPassphraseLabel}</Text>
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
            value={confirmPassphrase}
            onChangeText={setConfirmPassphrase}
            placeholder={tb.confirmPassphrasePlaceholder}
            placeholderTextColor={colors.textSecondary}
            secureTextEntry
            autoCapitalize="none"
            editable={!creating}
          />
          {mismatch && <Text style={styles.errorText}>{tb.mismatchError}</Text>}

          <TouchableOpacity
            style={[
              styles.createBtn,
              { backgroundColor: colors.primary },
              !canCreate && styles.createBtnDisabled,
            ]}
            onPress={handleCreateBackup}
            disabled={!canCreate}
            activeOpacity={0.85}
          >
            {creating ? (
              <View style={styles.creatingRow}>
                <ActivityIndicator color="#fff" />
                <Text style={styles.createBtnText}>{tb.creating}</Text>
              </View>
            ) : (
              <Text style={styles.createBtnText}>{tb.createButton}</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  headerGap: { gap: Spacing.one, flexDirection: 'row', alignItems: 'center' },
  backBtn: { fontSize: 20, fontWeight: '600' },
  headerTitle: { fontSize: 20, fontWeight: '700', letterSpacing: -0.5, marginLeft: Spacing.two },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.six,
    gap: Spacing.two,
  },
  subtitle: { fontSize: 14, lineHeight: 20, marginBottom: Spacing.one },
  warningBox: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.three,
    gap: Spacing.one,
    marginBottom: Spacing.two,
  },
  warningTitle: { fontSize: 14, fontWeight: '700' },
  warningBody: { fontSize: 13, lineHeight: 19 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: Spacing.half },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + 4,
    fontSize: 15,
    marginBottom: Spacing.two,
  },
  errorText: { color: '#dc2626', fontSize: 13, fontWeight: '600', marginTop: -Spacing.one, marginBottom: Spacing.one },
  createBtn: {
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  createBtnDisabled: { opacity: 0.5 },
  createBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  creatingRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
});
