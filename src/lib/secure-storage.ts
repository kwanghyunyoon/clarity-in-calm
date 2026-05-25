/**
 * Secure storage — native (iOS / Android)
 * AES-256-CTR via aes-js + expo-secure-store key management.
 *
 * Security model:
 *  • Encryption key:  32-byte random key, stored in expo-secure-store.
 *                     Uses iOS Keychain / Android Keystore (hardware-backed).
 *  • Cipher:          AES-256-CTR, fresh 16-byte IV per write.
 *  • At-rest storage: Encrypted JSON envelope in AsyncStorage.
 *                     Raw plaintext never touches AsyncStorage.
 *  • Access control:  WHEN_UNLOCKED_THIS_DEVICE_ONLY — excluded from backups.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as aesjs from 'aes-js';

const KEY_STORE_ID = 'cic_aes256_key_v1';
const STORE_PREFIX = '@cic_enc:';

// ─── Key management ──────────────────────────────────────────────────────────

function getRandomBytes(n: number): Uint8Array {
  const buf = new Uint8Array(n);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(buf);
  } else {
    for (let i = 0; i < n; i++) buf[i] = Math.floor(Math.random() * 256);
  }
  return buf;
}

let cachedKey: Uint8Array | null = null;

async function getOrCreateKey(): Promise<Uint8Array> {
  if (cachedKey) return cachedKey;

  const stored = await SecureStore.getItemAsync(KEY_STORE_ID, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });

  if (stored) {
    cachedKey = new Uint8Array(stored.split(',').map(Number));
    return cachedKey;
  }

  const key        = getRandomBytes(32);
  const serialized = Array.from(key).join(',');
  await SecureStore.setItemAsync(KEY_STORE_ID, serialized, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
  cachedKey = key;
  return key;
}

// ─── Encryption / Decryption ─────────────────────────────────────────────────

interface EncryptedEnvelope {
  v: 1;
  iv: string;
  ct: string;
}

async function encrypt(plaintext: string): Promise<string> {
  const key       = await getOrCreateKey();
  const iv        = getRandomBytes(16);
  const keyArr    = Array.from(key) as number[];
  const ivArr     = Array.from(iv)  as number[];
  const textBytes = aesjs.utils.utf8.toBytes(plaintext);
  const aesCtr    = new aesjs.ModeOfOperation.ctr(keyArr, new aesjs.Counter(ivArr));
  const ctBytes   = aesCtr.encrypt(textBytes);
  return JSON.stringify({
    v: 1,
    iv: aesjs.utils.hex.fromBytes(ivArr),
    ct: aesjs.utils.hex.fromBytes(Array.from(ctBytes) as number[]),
  } satisfies EncryptedEnvelope);
}

async function decrypt(stored: string): Promise<string> {
  const key      = await getOrCreateKey();
  const env      = JSON.parse(stored) as EncryptedEnvelope;
  const ivArr    = aesjs.utils.hex.toBytes(env.iv);
  const ctBytes  = aesjs.utils.hex.toBytes(env.ct);
  const keyArr   = Array.from(key) as number[];
  const aesCtr   = new aesjs.ModeOfOperation.ctr(keyArr, new aesjs.Counter(ivArr));
  return aesjs.utils.utf8.fromBytes(aesCtr.decrypt(ctBytes));
}

// ─── Public API ──────────────────────────────────────────────────────────────

export async function secureWrite(key: string, data: unknown): Promise<void> {
  try {
    const encrypted = await encrypt(JSON.stringify(data));
    await AsyncStorage.setItem(STORE_PREFIX + key, encrypted);
  } catch (err) {
    // Log so developers can diagnose storage issues; don't crash the caller
    console.error('[secure-storage] write failed for key', key, err);
  }
}

export async function secureRead<T>(key: string): Promise<T | null> {
  try {
    const stored = await AsyncStorage.getItem(STORE_PREFIX + key);
    if (!stored) return null;
    return JSON.parse(await decrypt(stored)) as T;
  } catch {
    return null;
  }
}

export async function secureDelete(key: string): Promise<void> {
  await AsyncStorage.removeItem(STORE_PREFIX + key);
}
