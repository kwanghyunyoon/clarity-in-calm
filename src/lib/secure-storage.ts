/**
 * Secure storage — AES-256-CTR + expo-secure-store key management
 *
 * Security model (2026 standard):
 *  • Encryption key:  32-byte (256-bit) random key generated on first launch,
 *                     stored in expo-secure-store which uses Android Keystore /
 *                     iOS Keychain (hardware-backed where available).
 *  • Cipher:          AES-256-CTR via aes-js (pure JS, Hermes-safe).
 *                     A fresh 16-byte IV is generated for every write.
 *  • Storage:         Encrypted JSON envelope stored in AsyncStorage.
 *                     Raw plaintext never touches AsyncStorage.
 *  • Access control:  Key only accessible while device is unlocked
 *                     (WHEN_UNLOCKED_THIS_DEVICE_ONLY — not migrated in backups).
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as aesjs from 'aes-js';
import { Platform } from 'react-native';

// ─── Constants ───────────────────────────────────────────────────────────────

const KEY_STORE_ID  = 'cic_aes256_key_v1';
const STORE_PREFIX  = '@cic_enc:';

// ─── Key management ──────────────────────────────────────────────────────────

function getRandomBytes(n: number): Uint8Array {
  const buf = new Uint8Array(n);
  // crypto.getRandomValues is available in RN 0.73+ / Hermes New Arch
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(buf);
  } else {
    // Extremely unlikely fallback on old environments
    for (let i = 0; i < n; i++) buf[i] = Math.floor(Math.random() * 256);
  }
  return buf;
}

let cachedKey: Uint8Array | null = null;

// ─── Web key storage (localStorage fallback) ─────────────────────────────────
// expo-secure-store is native-only. On web we fall back to localStorage.
// This is less secure than a hardware keystore but is the best available
// option in a browser context — the AES layer still protects data at rest
// in AsyncStorage (IndexedDB under the hood).
async function webGetKey(): Promise<string | null> {
  try { return localStorage.getItem(KEY_STORE_ID); } catch { return null; }
}
async function webSetKey(value: string): Promise<void> {
  try { localStorage.setItem(KEY_STORE_ID, value); } catch { /* ignore */ }
}

async function getOrCreateKey(): Promise<Uint8Array> {
  if (cachedKey) return cachedKey;

  let stored: string | null;

  if (Platform.OS === 'web') {
    stored = await webGetKey();
  } else {
    stored = await SecureStore.getItemAsync(KEY_STORE_ID, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
  }

  if (stored) {
    cachedKey = new Uint8Array(stored.split(',').map(Number));
    return cachedKey;
  }

  // First launch — generate and persist a new key
  const key = getRandomBytes(32); // 256 bits
  const serialized = Array.from(key).join(',');

  if (Platform.OS === 'web') {
    await webSetKey(serialized);
  } else {
    await SecureStore.setItemAsync(KEY_STORE_ID, serialized, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
  }

  cachedKey = key;
  return key;
}

// ─── Encryption / Decryption ─────────────────────────────────────────────────

interface EncryptedEnvelope {
  v: 1;
  iv: string;  // hex-encoded 16-byte IV
  ct: string;  // hex-encoded ciphertext
}

async function encrypt(plaintext: string): Promise<string> {
  const key      = await getOrCreateKey();
  const iv       = getRandomBytes(16);
  const keyArr   = Array.from(key) as number[];
  const ivArr    = Array.from(iv)  as number[];
  const textBytes = aesjs.utils.utf8.toBytes(plaintext);

  const aesCtr    = new aesjs.ModeOfOperation.ctr(keyArr, new aesjs.Counter(ivArr));
  const cipherBytes = aesCtr.encrypt(textBytes);

  const envelope: EncryptedEnvelope = {
    v: 1,
    iv: aesjs.utils.hex.fromBytes(ivArr),
    ct: aesjs.utils.hex.fromBytes(Array.from(cipherBytes) as number[]),
  };
  return JSON.stringify(envelope);
}

async function decrypt(stored: string): Promise<string> {
  const key      = await getOrCreateKey();
  const envelope = JSON.parse(stored) as EncryptedEnvelope;
  const ivArr    = aesjs.utils.hex.toBytes(envelope.iv);
  const cipherBytes = aesjs.utils.hex.toBytes(envelope.ct);
  const keyArr   = Array.from(key) as number[];

  const aesCtr    = new aesjs.ModeOfOperation.ctr(keyArr, new aesjs.Counter(ivArr));
  const textBytes = aesCtr.decrypt(cipherBytes);
  return aesjs.utils.utf8.fromBytes(textBytes);
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Encrypt `data` and persist to AsyncStorage under `key`. */
export async function secureWrite(key: string, data: unknown): Promise<void> {
  const json      = JSON.stringify(data);
  const encrypted = await encrypt(json);
  await AsyncStorage.setItem(STORE_PREFIX + key, encrypted);
}

/** Read and decrypt the value stored under `key`. Returns `null` if absent or corrupt. */
export async function secureRead<T>(key: string): Promise<T | null> {
  try {
    const stored = await AsyncStorage.getItem(STORE_PREFIX + key);
    if (!stored) return null;
    const json = await decrypt(stored);
    return JSON.parse(json) as T;
  } catch {
    // Corrupt or unreadable — treat as empty
    return null;
  }
}

/** Remove the encrypted value stored under `key`. */
export async function secureDelete(key: string): Promise<void> {
  await AsyncStorage.removeItem(STORE_PREFIX + key);
}
