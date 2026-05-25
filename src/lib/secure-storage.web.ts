/**
 * Secure storage — web
 * Uses the browser's built-in Web Crypto API with a non-extractable key
 * stored in IndexedDB.
 *
 * Security model:
 *  • Encryption key:  AES-256-GCM CryptoKey, generated once and marked
 *                     `extractable: false`.  The raw key bytes are NEVER
 *                     exposed to JavaScript — not even via DevTools.
 *                     The browser stores it as a protected opaque object.
 *  • Key storage:     IndexedDB (same origin only, not accessible cross-origin).
 *                     Browsers treat stored CryptoKey objects as opaque —
 *                     they cannot be read out of IDB as raw bytes.
 *  • Cipher:          AES-256-GCM.  Each write gets a fresh 12-byte IV.
 *                     GCM includes an authentication tag so any tampering
 *                     of the ciphertext is detected and rejected on decrypt.
 *  • At-rest storage: Base64-encoded envelope in AsyncStorage (IndexedDB).
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const DB_NAME    = 'cic_keystore';
const STORE_NAME = 'keys';
const KEY_ID     = 'cic_aes256gcm_v2';
const STORE_PREFIX = '@cic_enc:';

// ─── IndexedDB helpers ───────────────────────────────────────────────────────

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE_NAME);
    req.onsuccess       = () => resolve(req.result);
    req.onerror         = () => reject(req.error);
  });
}

async function idbGet(id: string): Promise<CryptoKey | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).get(id);
    req.onsuccess = () => resolve((req.result as CryptoKey | undefined) ?? null);
    req.onerror   = () => reject(req.error);
  });
}

async function idbSet(id: string, key: CryptoKey): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).put(key, id);
    req.onsuccess = () => resolve();
    req.onerror   = () => reject(req.error);
  });
}

// ─── Key management ──────────────────────────────────────────────────────────

let cachedKey: CryptoKey | null = null;

async function getOrCreateKey(): Promise<CryptoKey> {
  if (cachedKey) return cachedKey;

  let key = await idbGet(KEY_ID);

  if (!key) {
    // extractable: false — raw bytes are permanently inaccessible to JS
    key = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt'],
    );
    await idbSet(KEY_ID, key);
  }

  cachedKey = key;
  return key;
}

// ─── Encryption / Decryption ─────────────────────────────────────────────────

interface Envelope {
  v: 2;
  iv: string;   // base64 — 12-byte GCM nonce
  ct: string;   // base64 — ciphertext + 16-byte GCM auth tag
}

function toBase64(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

function fromBase64(b64: string): Uint8Array {
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}

async function encrypt(plaintext: string): Promise<string> {
  const key  = await getOrCreateKey();
  const iv   = crypto.getRandomValues(new Uint8Array(12));
  const data = new TextEncoder().encode(plaintext);
  const ct   = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv.buffer as ArrayBuffer },
    key,
    data.buffer as ArrayBuffer,
  );
  return JSON.stringify({ v: 2, iv: toBase64(iv.buffer as ArrayBuffer), ct: toBase64(ct) } satisfies Envelope);
}

async function decrypt(stored: string): Promise<string> {
  const key    = await getOrCreateKey();
  const env    = JSON.parse(stored) as Envelope;
  const ivBuf  = fromBase64(env.iv).buffer as ArrayBuffer;
  const ctBuf  = fromBase64(env.ct).buffer as ArrayBuffer;
  const pt     = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: ivBuf },
    key,
    ctBuf,
  );
  return new TextDecoder().decode(pt);
}

// ─── Public API ──────────────────────────────────────────────────────────────

export async function secureWrite(key: string, data: unknown): Promise<void> {
  try {
    const encrypted = await encrypt(JSON.stringify(data));
    await AsyncStorage.setItem(STORE_PREFIX + key, encrypted);
  } catch (err) {
    // Log so developers can diagnose storage issues; don't crash the caller
    console.error('[secure-storage/web] write failed for key', key, err);
  }
}

export async function secureRead<T>(key: string): Promise<T | null> {
  try {
    const stored = await AsyncStorage.getItem(STORE_PREFIX + key);
    if (!stored) return null;
    return JSON.parse(await decrypt(stored)) as T;
  } catch {
    // Covers: missing key, corrupt ciphertext, GCM auth failure (tampered data)
    return null;
  }
}

export async function secureDelete(key: string): Promise<void> {
  await AsyncStorage.removeItem(STORE_PREFIX + key);
}
