/**
 * Shared restore-a-backup flow (issue #61): file-pick → header validation →
 * passphrase → decrypt/validate → confirm → write-then-swap → reload. Used
 * by the Backup & Restore settings screen and, unmodified, by the
 * first-launch "Already have a backup? Restore it" entry point (#62) so
 * both call sites run the exact same validation ordering and error
 * handling rather than maintaining two implementations.
 */
import { File } from 'expo-file-system';
import { useState } from 'react';
import { Alert } from 'react-native';

import { useEmotions } from '@/context/emotion-context';
import { useSettings } from '@/context/settings-context';
import { countEntriesInBackup, useWellness } from '@/context/wellness-context';
import { isValidBackupEnvelope, restoreBackup } from '@/lib/backup-crypto';
import { ALL_DATA_KEYS } from '@/lib/data-registry';
import { promoteRestoredData, writeRestoreToTemp } from '@/lib/data-keys';
import { useTranslation } from '@/hooks/use-translation';

export function useRestoreFlow(onRestored: () => void) {
  const t = useTranslation();
  const tb = t.backupScreen;
  const { reload: reloadSettings } = useSettings();
  const wellness = useWellness();
  const emotions = useEmotions();

  const [pendingEnvelopeJson, setPendingEnvelopeJson] = useState<string | null>(null);
  const [passphraseModalVisible, setPassphraseModalVisible] = useState(false);
  const [passphraseBusy, setPassphraseBusy] = useState(false);
  const [restoring, setRestoring] = useState(false);

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
      Alert.alert(tb.restoreDone.title, tb.restoreDone.body, [{ text: 'OK', onPress: onRestored }]);
    } catch (e: any) {
      Alert.alert(tb.restoreFailed.title, e.message ?? tb.restoreFailed.fallbackBody);
    } finally {
      setRestoring(false);
    }
  }

  function cancelPassphrase() {
    setPassphraseModalVisible(false);
    setPendingEnvelopeJson(null);
  }

  return {
    tb,
    passphraseModalVisible,
    passphraseBusy,
    restoring,
    handleChooseRestoreFile,
    handlePassphraseConfirm,
    cancelPassphrase,
  };
}
