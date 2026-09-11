import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert } from 'react-native';

import { SectionHeader } from '@/components/ui/SectionHeader';
import { SettingsGroup } from '@/components/ui/SettingsGroup';
import { SettingsRow } from '@/components/ui/SettingsRow';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/useAuthStore';

export function AccountSectionAuth() {
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
