import * as QueryParams from 'expo-auth-session/build/QueryParams';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import * as AppleAuthentication from 'expo-apple-authentication';
import { supabase } from './supabase';

// Required once per app so the in-app browser closes itself after redirecting back.
WebBrowser.maybeCompleteAuthSession();

async function createSessionFromUrl(url: string): Promise<string | null> {
  const { params, errorCode } = QueryParams.getQueryParams(url);
  if (errorCode) return errorCode;

  const { access_token, refresh_token } = params;
  if (!access_token || !refresh_token) return null;

  const { error } = await supabase.auth.setSession({ access_token, refresh_token });
  return error?.message ?? null;
}

// Returns an error message on failure, or null on success/user-cancellation.
// On success, useAuthStore's onAuthStateChange listener picks up the new
// session and the Settings account section reflects it automatically.
// `genericError` is the caller's translated fallback for the "couldn't start" case.
export async function signInWithGoogle(genericError: string): Promise<string | null> {
  const redirectTo = Linking.createURL('/');
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo, skipBrowserRedirect: true },
  });
  if (error || !data.url) return error?.message ?? genericError;

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  if (result.type !== 'success' || !result.url) return null;

  return createSessionFromUrl(result.url);
}

// Required alongside Google Sign-In by App Store Guideline 4.8. Returns an error
// message on failure, or null on success/user-cancellation. `messages` are the
// caller's translated fallbacks for the two failure cases below.
export async function signInWithApple(
  messages: { noToken: string; genericError: string },
): Promise<string | null> {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });
    if (!credential.identityToken) return messages.noToken;

    const { error } = await supabase.auth.signInWithIdToken({
      provider: 'apple',
      token: credential.identityToken,
    });
    return error?.message ?? null;
  } catch (e: unknown) {
    const err = e as { code?: string };
    if (err.code === 'ERR_REQUEST_CANCELED') return null;
    return messages.genericError;
  }
}
