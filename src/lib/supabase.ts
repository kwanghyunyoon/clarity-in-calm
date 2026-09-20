import 'react-native-url-polyfill/auto';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import * as aesjs from 'aes-js';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Expo's SecureStore rejects values over ~2048 bytes, and a Supabase session
// (access + refresh token) routinely exceeds that. So the session itself is
// kept in AsyncStorage, encrypted with an AES-256 key that lives in SecureStore.
class LargeSecureStore {
  private async encrypt(key: string, value: string): Promise<string> {
    const encryptionKey = await Crypto.getRandomBytesAsync(32);
    const cipher = new aesjs.ModeOfOperation.ctr(encryptionKey, new aesjs.Counter(1));
    const encryptedBytes = cipher.encrypt(aesjs.utils.utf8.toBytes(value));

    await SecureStore.setItemAsync(key, aesjs.utils.hex.fromBytes(encryptionKey));

    return aesjs.utils.hex.fromBytes(encryptedBytes);
  }

  private async decrypt(key: string, value: string): Promise<string | null> {
    const encryptionKeyHex = await SecureStore.getItemAsync(key);
    if (!encryptionKeyHex) return null;

    const cipher = new aesjs.ModeOfOperation.ctr(aesjs.utils.hex.toBytes(encryptionKeyHex), new aesjs.Counter(1));
    const decryptedBytes = cipher.decrypt(aesjs.utils.hex.toBytes(value));

    return aesjs.utils.utf8.fromBytes(decryptedBytes);
  }

  async getItem(key: string): Promise<string | null> {
    const encrypted = await AsyncStorage.getItem(key);
    if (!encrypted) return null;
    return this.decrypt(key, encrypted);
  }

  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
    await SecureStore.deleteItemAsync(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    const encrypted = await this.encrypt(key, value);
    await AsyncStorage.setItem(key, encrypted);
  }
}

// Lazily constructed: AUTH_ENABLED is false for this release, so the (auth)
// routes that import this module are never reached from the UI, but Expo
// Router still eagerly requires every file under src/app/ to build its route
// table — a top-level throw here used to crash the app at startup whenever
// EXPO_PUBLIC_SUPABASE_URL/_ANON_KEY weren't set (e.g. CI builds with no
// .env). Deferring construction to first actual use means the missing-env
// error only surfaces if auth code is genuinely invoked (re-enabling
// AUTH_ENABLED requires a real .env anyway).
let cachedClient: SupabaseClient | undefined;

function getSupabaseClient(): SupabaseClient {
  if (cachedClient) return cachedClient;

  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY. Copy .env.example to .env and fill in your Supabase project values.'
    );
  }

  cachedClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      // Native gets the encrypted SecureStore-backed storage. On web, expo-secure-store
      // isn't a real target and LargeSecureStore touches AsyncStorage/`window`, which
      // crashes the static SSR prerender — so let supabase-js fall back to its default
      // localStorage adapter (which is SSR-guarded internally).
      storage: Platform.OS === 'web' ? undefined : new LargeSecureStore(),
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
  return cachedClient;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop, _receiver) {
    const client = getSupabaseClient();
    return Reflect.get(client, prop, client);
  },
});
