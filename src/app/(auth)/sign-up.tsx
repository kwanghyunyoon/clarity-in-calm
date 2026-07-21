import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import * as Linking from 'expo-linking';
import Constants from 'expo-constants';
import { supabase } from '../../lib/supabase';
import { theme } from '../../lib/authTheme';
import { useTranslation } from '../../hooks/use-translation';

const PRIVACY_URL =
  (Constants.expoConfig?.extra?.privacyPolicyUrl as string | undefined) ??
  'https://kwanghyunyoon.github.io/clarity-in-calm-privacy/';

export default function SignUp() {
  const t = useTranslation().authScreen.signUp;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSignUp = async () => {
    if (!email.trim() || !password) {
      setError(t.errors.missing);
      return;
    }
    if (password.length < 8) {
      setError(t.errors.passwordTooShort);
      return;
    }
    if (!consent) {
      setError(t.errors.consentRequired);
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        // consented_at flows into raw_user_meta_data and is copied into `profiles`
        // by the handle_new_user() trigger (see supabase/migrations/0001_profiles.sql).
        options: { data: { consented_at: new Date().toISOString() } },
      });
      if (signUpError) {
        setError(signUpError.message);
        return;
      }
      if (data.session) {
        // Email confirmation is disabled for this project — already signed in.
        router.back();
        return;
      }
      setNotice(t.confirmEmailNotice);
      setTimeout(() => router.replace('/(auth)/sign-in'), 1500);
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
        <Text style={styles.subtitle}>{t.subtitle}</Text>

        {error && <Text style={styles.error}>{error}</Text>}
        {notice && <Text style={styles.notice}>{notice}</Text>}

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

        <Text style={styles.label}>{t.passwordLabel}</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder={t.passwordPlaceholder}
          placeholderTextColor={theme.textPlaceholder}
          secureTextEntry
          autoComplete="password-new"
        />

        <TouchableOpacity
          style={styles.consentRow}
          onPress={() => setConsent(c => !c)}
          activeOpacity={0.7}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: consent }}
        >
          <View style={[styles.checkbox, consent && styles.checkboxChecked]}>
            {consent && <Text style={styles.checkboxMark}>✓</Text>}
          </View>
          <Text style={styles.consentText}>
            {t.consentPrefix}
            <Text style={styles.link} onPress={() => void Linking.openURL(PRIVACY_URL)}>
              {t.consentLink}
            </Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.primaryBtn, submitting && styles.primaryBtnDisabled]}
          onPress={handleSignUp}
          disabled={submitting}
          activeOpacity={0.85}
        >
          {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>{t.submit}</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(auth)/sign-in')} style={styles.footer}>
          <Text style={styles.footerText}>
            {t.hasAccountPrefix}<Text style={styles.footerLink}>{t.signInLink}</Text>
          </Text>
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
  notice: { fontSize: 14, color: theme.primary, marginBottom: 16, fontWeight: '600' },
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
    marginBottom: 14,
  },
  consentRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20, gap: 10 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: theme.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxChecked: { backgroundColor: theme.primary, borderColor: theme.primary },
  checkboxMark: { color: '#fff', fontSize: 13, fontWeight: '700' },
  consentText: { flex: 1, fontSize: 13, color: theme.textSecondary, lineHeight: 19 },
  link: { color: theme.primary, fontWeight: '600' },
  primaryBtn: {
    backgroundColor: theme.primary,
    borderRadius: theme.radiusButton,
    paddingVertical: 16,
    alignItems: 'center',
    ...theme.shadowFab,
  },
  primaryBtnDisabled: { opacity: 0.7 },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  footer: { alignItems: 'center', marginTop: 24 },
  footerText: { fontSize: 14, color: theme.textSecondary },
  footerLink: { color: theme.primary, fontWeight: '700' },
});
