import React, { useState } from 'react';
import {
  Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import * as Linking from 'expo-linking';
import { supabase } from '../../lib/supabase';
import { theme } from '../../lib/authTheme';
import { useTranslation } from '../../hooks/use-translation';

export default function ForgotPassword() {
  const t = useTranslation().authScreen.forgotPassword;
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError(t.errors.missingEmail);
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      // Deep link that Supabase's recovery email redirects back to — handled by reset-password.tsx.
      const redirectTo = Linking.createURL('reset-password');
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });
      if (resetError) {
        setError(resetError.message);
        return;
      }
      setSent(true);
    } catch {
      setError(t.errors.generic);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{t.title}</Text>

        {error && <Text style={styles.error}>{error}</Text>}

        {sent ? (
          <>
            <Text style={styles.subtitle}>
              {t.sentBodyPrefix}{email.trim()}{t.sentBodySuffix}
            </Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => router.replace('/(auth)/sign-in')} activeOpacity={0.85}>
              <Text style={styles.primaryBtnText}>{t.backToSignIn}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.subtitle}>{t.subtitle}</Text>

            <Text style={styles.label}>{t.emailLabel}</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder={t.emailPlaceholder}
              placeholderTextColor={theme.textPlaceholder}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />

            <TouchableOpacity
              style={[styles.primaryBtn, submitting && styles.primaryBtnDisabled]}
              onPress={handleSubmit}
              disabled={submitting}
              activeOpacity={0.85}
            >
              {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>{t.submit}</Text>}
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity onPress={() => router.back()} style={styles.footer}>
          <Text style={styles.footerText}>{t.cancel}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bgScreen },
  content: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: '800', color: theme.textPrimary, marginBottom: 8 },
  subtitle: { fontSize: 15, color: theme.textSecondary, marginBottom: 28, lineHeight: 21 },
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
  footer: { alignItems: 'center', marginTop: 20 },
  footerText: { fontSize: 14, color: theme.textMuted, fontWeight: '500' },
});
