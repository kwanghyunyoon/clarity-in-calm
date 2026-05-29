/**
 * Secure storage — native (iOS / Android)
 * AES-256-GCM via platform crypto.subtle (Hermes built-in, RN 0.71+).
 * Key stored as base64 in expo-secure-store (Keychain / Keystore).
 *
 * Security model:
 *  • Encryption key:  32-byte random key, stored as base64 in expo-secure-store.
 *                     iOS Keychain / Android Keystore (hardware-backed where available).
 *                     WHEN_UNLOCKED_THIS_DEVICE_ONLY — excluded from iCloud / ADB backups.
 *  • Cipher:          AES-256-GCM with a fresh 12-byte IV per write.
 *                     GCM is authenticated: any ciphertext tampering is detected and
 *                     rejected at decrypt time (throws, caught → returns null).
 *  • Platform primitive: crypto.subtle (Hermes). No third-party crypto library for v2 data.
 *
 * Migration:
 *  v1 entries used AES-256-CTR via aes-js (unauthenticated). On the first read of a
 *  v1 entry, it is decrypted with the old CTR key and immediately re-saved as v2 GCM.
 *  aes-js is kept as a migration-only dependency; once all installed clients have read
 *  their entries at least once it can be removed along with decryptV1 / OLD_KEY_STORE_ID.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as aesjs from 'aes-js'; // migration only — safe to remove after v1 entries are gone

const KEY_STORE_ID     = 'cic_aes256gcm_key_v2';
const OLD_KEY_STORE_ID = 'cic_aes256_key_v1';   // v1 CTR key — read-only for migration
const STORE_PREFIX     = '@cic_enc:';
const SECURE_OPTS      = { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY } as const;

// ─── Shared helpers ───────────────────────────────────────────────────────────

function toBase64(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

function fromBase64(b64: string): Uint8Array {
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}

// ─── Key management ───────────────────────────────────────────────────────────

let cachedKey: CryptoKey | null = null;

async function getOrCreateKey(): Promise<CryptoKey> {
  if (cachedKey) return cachedKey;

  const stored = await SecureStore.getItemAsync(KEY_STORE_ID, SECURE_OPTS);
  if (stored) {
    const raw = fromBase64(stored);
    cachedKey = await crypto.subtle.importKey(
      'raw', raw.buffer as ArrayBuffer,
      { name: 'AES-GCM' }, false, ['encrypt', 'decrypt'],
    );
    return cachedKey;
  }

  // First run: generate, persist, import
  const raw = new Uint8Array(32);
  crypto.getRandomValues(raw);
  await SecureStore.setItemAsync(KEY_STORE_ID, toBase64(raw.buffer as ArrayBuffer), SECURE_OPTS);
  cachedKey = await crypto.subtle.importKey(
    'raw', raw.buffer as ArrayBuffer,
    { name: 'AES-GCM' }, false, ['encrypt', 'decrypt'],
  );
  return cachedKey;
}

// ─── v1 migration (AES-256-CTR via aes-js) ───────────────────────────────────
// REMOVE this section + the aes-js import once all installed clients have migrated.

interface EnvelopeV1 { v: 1; iv: string; ct: string; }

async function decryptV1(stored: string): Promise<string> {
  const oldKeyRaw = await SecureStore.getItemAsync(OLD_KEY_STORE_ID, SECURE_OPTS);
  if (!oldKeyRaw) throw new Error('[secure-storage] v1 key not found — cannot migrate');
  const key    = Array.from(new Uint8Array(oldKeyRaw.split(',').map(Number))) as number[];
  const env    = JSON.parse(stored) as EnvelopeV1;
  const iv     = aesjs.utils.hex.toBytes(env.iv);
  const ct     = aesjs.utils.hex.toBytes(env.ct);
  const aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(Array.from(iv) as number[]));
  return aesjs.utils.utf8.fromBytes(aesCtr.decrypt(ct));
}

// ─── v2 encryption (AES-256-GCM via crypto.subtle) ───────────────────────────

interface EnvelopeV2 { v: 2; iv: string; ct: string; }

async function encryptV2(plaintext: string): Promise<string> {
  const key  = await getOrCreateKey();
  const iv   = new Uint8Array(12);
  crypto.getRandomValues(iv);
  const data = new TextEncoder().encode(plaintext);
  const ct   = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv.buffer as ArrayBuffer },
    key,
    data.buffer as ArrayBuffer,
  );
  return JSON.stringify({
    v: 2,
    iv: toBase64(iv.buffer as ArrayBuffer),
    ct: toBase64(ct),
  } satisfies EnvelopeV2);
}

async function decryptV2(stored: string): Promise<string> {
  const key = await getOrCreateKey();
  const env = JSON.parse(stored) as EnvelopeV2;
  const iv  = fromBase64(env.iv).buffer as ArrayBuffer;
  const ct  = fromBase64(env.ct).buffer as ArrayBuffer;
  // GCM authentication failure throws — caught by the caller, returns null
  const pt  = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ct);
  return new TextDecoder().decode(pt);
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function secureWrite(key: string, data: unknown): Promise<boolean> {
  try {
    const encrypted = await encryptV2(JSON.stringify(data));
    await AsyncStorage.setItem(STORE_PREFIX + key, encrypted);
    return true;
  } catch (err) {
    console.error('[secure-storage] write failed for key', key, err);
    return false;
  }
}

export async function secureRead<T>(key: string): Promise<T | null> {
  try {
    const stored = await AsyncStorage.getItem(STORE_PREFIX + key);
    if (!stored) return null;

    const { v } = JSON.parse(stored) as { v: number };

    if (v === 1) {
      // Migrate: decrypt with old CTR key, re-save as GCM
      const plaintext = await decryptV1(stored);
      const reEncrypted = await encryptV2(plaintext);
      await AsyncStorage.setItem(STORE_PREFIX + key, reEncrypted);
      return JSON.parse(plaintext) as T;
    }

    return JSON.parse(await decryptV2(stored)) as T;
  } catch {
    // Covers: missing key, corrupt ciphertext, GCM auth tag failure (tampered data)
    return null;
  }
}

export async function secureDelete(key: string): Promise<void> {
  await AsyncStorage.removeItem(STORE_PREFIX + key);
}
