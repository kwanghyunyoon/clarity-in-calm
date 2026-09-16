import { File } from 'expo-file-system';
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

import { PassphrasePromptModal } from '@/components/passphrase-prompt-modal';
import { Screen, ScreenHeader } from '@/components/ui/Screen';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useEmotions } from '@/context/emotion-context';
import { useSettings } from '@/context/settings-context';
import { countEntriesInBackup, useWellness } from '@/context/wellness-context';
import { createBackup, isValidBackupEnvelope, restoreBackup } from '@/lib/backup-crypto';
import { ALL_DATA_KEYS } from '@/lib/data-registry';
import { promoteRestoredData, readAllData, writeRestoreToTemp } from '@/lib/data-keys';
import { shareJsonFile } from '@/lib/share-json-file';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';

export default function BackupScreen() {
  const { colors } = useTheme();
  const t = useTranslation();
  const tb = t.backupScreen;
  const { setLastBackupAt, reload: reloadSettings } = useSettings();
  const wellness = useWellness();
  const emotions = useEmotions();

  const [passphrase, setPassphrase] = useState('');
  const [confirmPassphrase, setConfirmPassphrase] = useState('');
  const [creating, setCreating] = useState(false);

  const [pendingEnvelopeJson, setPendingEnvelopeJson] = useState<string | null>(null);
  const [passphraseModalVisible, setPassphraseModalVisible] = useState(false);
  const [passphraseBusy, setPassphraseBusy] = useState(false);
  const [restoring, setRestoring] = useState(false);

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

  async function handleChooseRestoreFile() {
    if (restoring || passphraseModalVisible) return;
    const picked = await File.pickFileAsync({ mimeTypes: 'application/json' });
    if (picked.canceled) return;

    const json = await picked.result.text();
    if (!isValidBackupEnvelope(json)) {
      Alert.alert(tb.invalidFile.title, tb.invalidFile.body);
      return;
    }
    setPendingEnvelopeJson(json);
    setPassphraseModalVisible(true);
  }

  async function handlePassphraseConfirm(enteredPassphrase: string) {
    if (!pendingEnvelopeJson) return;
    setPassphraseBusy(true);
    const result = await restoreBackup(pendingEnvelopeJson, enteredPassphrase);
    setPassphraseBusy(false);

    if (!result.ok) {
      if (result.reason === 'invalid-envelope') {
        setPassphraseModalVisible(false);
        setPendingEnvelopeJson(null);
        Alert.alert(tb.invalidFile.title, tb.invalidFile.body);
      } else {
        Alert.alert(tb.wrongPassphrase.title, tb.wrongPassphrase.body);
      }
      return;
    }

    setPassphraseModalVisible(false);
    setPendingEnvelopeJson(null);

    const body = tb.restoreConfirm.body
      .replace('{currentCount}', String(wellness.entries.length))
      .replace('{backupCount}', String(countEntriesInBackup(result.data)));

    Alert.alert(tb.restoreConfirm.title, body, [
      { text: tb.restoreConfirm.cancel, style: 'cancel' },
      { text: tb.restoreConfirm.confirm, style: 'destructive', onPress: () => performRestore(result.data) },
    ]);
  }

  async function performRestore(data: Record<string, unknown>) {
    if (restoring) return;
    setRestoring(true);
    try {
      await writeRestoreToTemp(ALL_DATA_KEYS, data);
      await promoteRestoredData(ALL_DATA_KEYS, data);
      await Promise.all([wellness.reload(), emotions.reload(), reloadSettings()]);
      Alert.alert(tb.restoreDone.title, tb.restoreDone.body, [{ text: 'OK', onPress: () => router.back() }]);
    } catch (e: any) {
      Alert.alert(tb.restoreFailed.title, e.message ?? tb.restoreFailed.fallbackBody);
    } finally {
      setRestoring(false);
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

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <Text style={[styles.sectionTitle, { color: colors.text }]}>{tb.restoreSectionTitle}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{tb.restoreSectionSubtitle}</Text>

          <TouchableOpacity
            style={[styles.restoreBtn, { borderColor: colors.primary }, restoring && styles.createBtnDisabled]}
            onPress={handleChooseRestoreFile}
            disabled={restoring}
            activeOpacity={0.85}
          >
            {restoring ? (
              <View style={styles.creatingRow}>
                <ActivityIndicator color={colors.primary} />
                <Text style={[styles.restoreBtnText, { color: colors.primary }]}>{tb.restoring}</Text>
              </View>
            ) : (
              <Text style={[styles.restoreBtnText, { color: colors.primary }]}>{tb.chooseFileButton}</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <PassphrasePromptModal
        visible={passphraseModalVisible}
        title={tb.restorePassphrasePrompt.title}
        body={tb.restorePassphrasePrompt.body}
        placeholder={tb.restorePassphrasePrompt.placeholder}
        confirmLabel={tb.restorePassphrasePrompt.confirm}
        cancelLabel={tb.restorePassphrasePrompt.cancel}
        busy={passphraseBusy}
        onCancel={() => { setPassphraseModalVisible(false); setPendingEnvelopeJson(null); }}
        onConfirm={handlePassphraseConfirm}
      />
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
  divider: { height: StyleSheet.hairlineWidth, marginVertical: Spacing.four },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: Spacing.half },
  restoreBtn: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  restoreBtnText: { fontWeight: '700', fontSize: 16 },
});
