import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import * as Linking from 'expo-linking';
import * as QueryParams from 'expo-auth-session/build/QueryParams';
import { supabase } from '../../lib/supabase';
import { theme } from '../../lib/authTheme';
import { useTranslation } from '../../hooks/use-translation';

// Supabase's recovery email links land here as clarityincalm://reset-password#access_token=...&refresh_token=...&type=recovery
function parseRecoveryTokens(url: string): { access_token: string; refresh_token: string } | null {
  const { params } = QueryParams.getQueryParams(url);
  const { access_token, refresh_token } = params;
  if (!access_token || !refresh_token) return null;
  return { access_token, refresh_token };
}

// Auth is disabled (see @/lib/auth-flag) — this screen is currently
// unreferenced. src/app/reset-password.tsx renders a Redirect stub instead
// of importing this file, so supabase.ts is never required by that
// always-mounted route. To re-enable: import and render ResetPasswordScreen
// from src/app/reset-password.tsx again.
export function ResetPasswordScreen() {
  const t = useTranslation().authScreen.resetPassword;
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    const establishRecoverySession = async (url: string | null) => {
      const tokens = url ? parseRecoveryTokens(url) : null;
      if (tokens) {
        const { error: sessionError } = await supabase.auth.setSession(tokens);
        if (sessionError) setError(t.errors.expiredLink);
      }
      setReady(true);
    };

    void Linking.getInitialURL().then(establishRecoverySession);
    const sub = Linking.addEventListener('url', (e) => void establishRecoverySession(e.url));
    return () => sub.remove();
  }, [t.errors.expiredLink]);

  const handleReset = async () => {
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        setError(updateError.message);
        return;
      }
      setTimeout(() => router.replace('/'), 1200);
    } catch {
      setError('Could not update password. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Set a new password</Text>

        {error && <Text style={styles.error}>{error}</Text>}

        <Text style={styles.label}>New Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="At least 8 characters"
          placeholderTextColor={theme.textPlaceholder}
          secureTextEntry
          autoComplete="password-new"
        />

        <TouchableOpacity
          style={[styles.primaryBtn, submitting && styles.primaryBtnDisabled]}
          onPress={handleReset}
          disabled={submitting}
          activeOpacity={0.85}
        >
          {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Update Password</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bgScreen },
  loading: { flex: 1, backgroundColor: theme.bgScreen, alignItems: 'center', justifyContent: 'center' },
  content: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: '800', color: theme.textPrimary, marginBottom: 24 },
  error: { fontSize: 14, color: '#dc2626', marginBottom: 16, fontWeight: '600' },
  label: { fontSize: 13, fontWeight: '600', color: theme.textSecondary, marginBottom: 6 },
  input: {
    backgroundColor: theme.bgSubtle,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: theme.radiusInput,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: theme.textPrimary,
    marginBottom: 20,
  },
  primaryBtn: {
    backgroundColor: theme.primary,
    borderRadius: theme.radiusButton,
    paddingVertical: 16,
    alignItems: 'center',
    ...theme.shadowFab,
  },
  primaryBtnDisabled: { opacity: 0.7 },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
