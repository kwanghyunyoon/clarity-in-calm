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

const PRIVACY_URL =
  (Constants.expoConfig?.extra?.privacyPolicyUrl as string | undefined) ??
  'https://kwanghyunyoon.github.io/clarity-in-calm-privacy/';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSignUp = async () => {
    if (!email.trim() || !password) {
      setError('Enter an email and password');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (!consent) {
      setError('Please agree to the Privacy Policy to continue');
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
      setNotice('Check your email to confirm your account');
      setTimeout(() => router.replace('/(auth)/sign-in'), 1500);
    } catch {
      setError('Could not create account. Please try again.');
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
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>Sign up to start using Clarity in Calm.</Text>

        {error && <Text style={styles.error}>{error}</Text>}
        {notice && <Text style={styles.notice}>{notice}</Text>}

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="email@example.com"
          placeholderTextColor={theme.textPlaceholder}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />

        <Text style={styles.label}>Password</Text>
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
            I agree to the{' '}
            <Text style={styles.link} onPress={() => void Linking.openURL(PRIVACY_URL)}>
              Privacy Policy
            </Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.primaryBtn, submitting && styles.primaryBtnDisabled]}
          onPress={handleSignUp}
          disabled={submitting}
          activeOpacity={0.85}
        >
          {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Sign Up</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(auth)/sign-in')} style={styles.footer}>
          <Text style={styles.footerText}>
            Already have an account? <Text style={styles.footerLink}>Sign in</Text>
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
