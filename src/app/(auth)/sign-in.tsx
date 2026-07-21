import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import * as AppleAuthentication from 'expo-apple-authentication';
import { supabase } from '../../lib/supabase';
import { signInWithGoogle, signInWithApple } from '../../lib/oauth';
import { theme } from '../../lib/authTheme';
import { useTranslation } from '../../hooks/use-translation';

export default function SignIn() {
  const auth = useTranslation().authScreen;
  const t = auth.signIn;
  const tOauth = auth.oauth;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [appleAvailable, setAppleAvailable] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      void AppleAuthentication.isAvailableAsync().then(setAppleAvailable);
    }
  }, []);

  const handleSignIn = async () => {
    if (!email.trim() || !password) {
      setError(t.errors.missingCredentials);
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (signInError) setError(signInError.message);
      // On success the auth store's onAuthStateChange updates state; this screen is
      // dismissed by the caller (Settings) once a session exists.
      else router.back();
    } catch {
      setError(t.errors.generic);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleSubmitting(true);
    try {
      const errorMessage = await signInWithGoogle(tOauth.googleGenericError);
      if (errorMessage) setError(errorMessage);
      else router.back();
    } catch {
      setError(t.errors.google);
    } finally {
      setGoogleSubmitting(false);
    }
  };

  const handleAppleSignIn = async () => {
    setError(null);
    const errorMessage = await signInWithApple({
      noToken: tOauth.appleNoToken,
      genericError: tOauth.appleGenericError,
    });
    if (errorMessage) setError(errorMessage);
    else router.back();
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
          autoComplete="password"
        />

        <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')} style={styles.forgotLink}>
          <Text style={styles.link}>{t.forgotPassword}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.primaryBtn, submitting && styles.primaryBtnDisabled]}
          onPress={handleSignIn}
          disabled={submitting}
          activeOpacity={0.85}
        >
          {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>{t.submit}</Text>}
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>{t.or}</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={[styles.googleBtn, googleSubmitting && styles.primaryBtnDisabled]}
          onPress={handleGoogleSignIn}
          disabled={googleSubmitting}
          activeOpacity={0.85}
        >
          {googleSubmitting ? (
            <ActivityIndicator color={theme.textPrimary} />
          ) : (
            <Text style={styles.googleBtnText}>{t.continueWithGoogle}</Text>
          )}
        </TouchableOpacity>

        {appleAvailable && (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={theme.radiusButton}
            style={styles.appleBtn}
            onPress={handleAppleSignIn}
          />
        )}

        <TouchableOpacity onPress={() => router.push('/(auth)/sign-up')} style={styles.footer}>
          <Text style={styles.footerText}>
            {t.noAccountPrefix}<Text style={styles.footerLink}>{t.signUpLink}</Text>
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
  subtitle: { fontSize: 15, color: theme.textSecondary, marginBottom: 28 },
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
    marginBottom: 14,
  },
  forgotLink: { alignSelf: 'flex-end', marginBottom: 20 },
  link: { fontSize: 13, color: theme.primary, fontWeight: '600' },
  primaryBtn: {
    backgroundColor: theme.primary,
    borderRadius: theme.radiusButton,
    paddingVertical: 16,
    alignItems: 'center',
    ...theme.shadowFab,
  },
  primaryBtnDisabled: { opacity: 0.7 },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 20, gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: theme.border },
  dividerText: { fontSize: 12, color: theme.textMuted, fontWeight: '600' },
  googleBtn: {
    backgroundColor: theme.bgCard,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: theme.radiusButton,
    paddingVertical: 16,
    alignItems: 'center',
  },
  googleBtnText: { color: theme.textPrimary, fontWeight: '700', fontSize: 16 },
  appleBtn: { width: '100%', height: 54, marginTop: 12 },
  footer: { alignItems: 'center', marginTop: 24 },
  footerText: { fontSize: 14, color: theme.textSecondary },
  footerLink: { color: theme.primary, fontWeight: '700' },
});
