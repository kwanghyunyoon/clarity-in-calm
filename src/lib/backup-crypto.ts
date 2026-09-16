/**
 * Encrypted backup envelope — pure crypto module (issue #59, part of #58).
 *
 * createBackup/restoreBackup take and return plain data: no AsyncStorage, no
 * React, no I/O. Callers (Settings backup/restore screens) own reading the
 * data-registry dump and writing the resulting file.
 *
 * Key derivation: passphrase -> PBKDF2-HMAC-SHA256 (@noble/hashes, pure JS,
 * no native module) -> AES-256-GCM key. Encryption reuses the same
 * expo-crypto AES-256-GCM primitives as src/lib/secure-storage.ts.
 *
 * The envelope's `magic`/`formatVersion` fields are plaintext so a file can
 * be recognized (or rejected) as a genuine backup before ever asking for a
 * passphrase. `iterations` is stored per-backup so a later increase to
 * MIN_ITERATIONS never breaks restoring older backups. A wrong passphrase
 * and a tampered ciphertext both fail GCM authentication and are
 * indistinguishable by design (that's the point of an authenticated
 * cipher) — both are reported as 'decryption-failed', distinct from
 * 'invalid-envelope' which is caught before decryption is ever attempted.
 */
import { AESEncryptionKey, AESSealedData, aesDecryptAsync, aesEncryptAsync, getRandomBytes } from 'expo-crypto';
import { pbkdf2Async } from '@noble/hashes/pbkdf2.js';
import { sha256 } from '@noble/hashes/sha2.js';

const MAGIC = 'clarity-in-calm-backup';
const FORMAT_VERSION = 1;
const PAYLOAD_VERSION = 1;

const KEY_LENGTH = 32;
const SALT_LENGTH = 16;
const IV_LENGTH = 12;
const MIN_ITERATIONS = 300_000;
const BENCHMARK_ITERATIONS = 10_000;
const TARGET_DURATION_MS = 500;
const ITERATION_ROUNDING = 1_000;

export interface BackupEnvelope {
  magic: string;
  formatVersion: number;
  salt: string;
  iterations: number;
  iv: string;
  ciphertext: string;
}

export type RestoreResult =
  | { ok: true; data: Record<string, unknown> }
  | { ok: false; reason: 'invalid-envelope' }
  | { ok: false; reason: 'decryption-failed' };

// ─── Encoding helpers ─────────────────────────────────────────────────────────

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function fromBase64(b64: string): Uint8Array {
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}

// ─── Key derivation ───────────────────────────────────────────────────────────

async function deriveKey(passphrase: string, salt: Uint8Array, iterations: number): Promise<AESEncryptionKey> {
  const keyBytes = await pbkdf2Async(sha256, passphrase, salt, { c: iterations, dkLen: KEY_LENGTH });
  return AESEncryptionKey.import(keyBytes);
}

/** Times a small PBKDF2 run and extrapolates an iteration count aiming for
 * TARGET_DURATION_MS on this device, never below MIN_ITERATIONS. */
async function benchmarkIterations(): Promise<number> {
  const start = Date.now();
  await pbkdf2Async(sha256, 'clarity-in-calm-benchmark', new Uint8Array(SALT_LENGTH), {
    c: BENCHMARK_ITERATIONS,
    dkLen: KEY_LENGTH,
  });
  const elapsedMs = Math.max(Date.now() - start, 1);
  const msPerIteration = elapsedMs / BENCHMARK_ITERATIONS;
  const scaled = Math.round(TARGET_DURATION_MS / msPerIteration / ITERATION_ROUNDING) * ITERATION_ROUNDING;
  return Math.max(scaled, MIN_ITERATIONS);
}

// ─── Envelope validation ──────────────────────────────────────────────────────

const BASE64_PATTERN = /^[A-Za-z0-9+/]*={0,2}$/;

function parseEnvelope(raw: string): BackupEnvelope | null {
  let candidate: unknown;
  try {
    candidate = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof candidate !== 'object' || candidate === null) return null;

  const env = candidate as Record<string, unknown>;
  if (env.magic !== MAGIC || env.formatVersion !== FORMAT_VERSION) return null;
  if (typeof env.salt !== 'string' || typeof env.iv !== 'string' || typeof env.ciphertext !== 'string') return null;
  if (![env.salt, env.iv, env.ciphertext].every((field) => BASE64_PATTERN.test(field))) return null;
  if (typeof env.iterations !== 'number' || !Number.isFinite(env.iterations) || env.iterations <= 0) return null;

  return {
    magic: env.magic,
    formatVersion: env.formatVersion,
    salt: env.salt,
    iterations: env.iterations,
    iv: env.iv,
    ciphertext: env.ciphertext,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Checks the plaintext magic/formatVersion header only — no passphrase, no
 * decryption. Lets restore flows reject an unrecognized file immediately,
 * before ever asking the user for a passphrase. */
export function isValidBackupEnvelope(raw: string): boolean {
  return parseEnvelope(raw) !== null;
}

/** Throws on failure (crypto/randomness errors) — unlike restoreBackup, there
 * is no expected-failure mode to model as a typed result; callers show it. */
export async function createBackup(data: Record<string, unknown>, passphrase: string): Promise<BackupEnvelope> {
  const salt = getRandomBytes(SALT_LENGTH);
  const iterations = await benchmarkIterations();
  const key = await deriveKey(passphrase, salt, iterations);

  const payload = JSON.stringify({ version: PAYLOAD_VERSION, data });
  const sealed = await aesEncryptAsync(new TextEncoder().encode(payload), key);
  const combined = (await sealed.combined('bytes')) as Uint8Array;

  return {
    magic: MAGIC,
    formatVersion: FORMAT_VERSION,
    salt: toBase64(salt),
    iterations,
    iv: toBase64(combined.slice(0, IV_LENGTH)),
    ciphertext: toBase64(combined.slice(IV_LENGTH)),
  };
}

export async function restoreBackup(envelopeJson: string, passphrase: string): Promise<RestoreResult> {
  const envelope = parseEnvelope(envelopeJson);
  if (!envelope) return { ok: false, reason: 'invalid-envelope' };

  try {
    const salt = fromBase64(envelope.salt);
    const key = await deriveKey(passphrase, salt, envelope.iterations);

    const iv = fromBase64(envelope.iv);
    const ciphertext = fromBase64(envelope.ciphertext);
    const combined = new Uint8Array(iv.length + ciphertext.length);
    combined.set(iv, 0);
    combined.set(ciphertext, iv.length);

    const sealed = AESSealedData.fromCombined(combined);
    const plaintext = (await aesDecryptAsync(sealed, key, { output: 'bytes' })) as Uint8Array;
    const payload = JSON.parse(new TextDecoder().decode(plaintext)) as { version: number; data: Record<string, unknown> };

    return { ok: true, data: payload.data };
  } catch {
    // GCM auth failure (wrong passphrase or tampered ciphertext) or a payload
    // that failed to parse after decryption — never surface partial plaintext.
    return { ok: false, reason: 'decryption-failed' };
  }
}
