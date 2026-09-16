/**
 * Tests for src/lib/backup-crypto.ts — the pure encrypted-backup-envelope
 * module (issue #59). expo-crypto is jest-mocked (see __mocks__/) with real
 * WebCrypto AES-GCM, so encrypt/decrypt/tamper-detection behavior is genuine.
 */
import { createBackup, isValidBackupEnvelope, restoreBackup } from '@/lib/backup-crypto';

// A genuine 300,000+ iteration PBKDF2 derivation is, by design, slow (the
// parent spec calls for "up to a few seconds"); each test below does two.
jest.setTimeout(30_000);

const SAMPLE_DATA = {
  journal_entries: [{ id: '1', note: 'Today I felt calm and grateful.' }],
  settings: { language: 'en' },
};

describe('BackupCrypto', () => {
  test('roundtrips the original data with the same passphrase', async () => {
    const envelope = await createBackup(SAMPLE_DATA, 'correct horse battery staple');
    const result = await restoreBackup(JSON.stringify(envelope), 'correct horse battery staple');

    expect(result).toEqual({ ok: true, data: SAMPLE_DATA });
  });

  test('envelope carries a plaintext magic/formatVersion header and no plaintext data', async () => {
    const envelope = await createBackup(SAMPLE_DATA, 'a passphrase');
    const json = JSON.stringify(envelope);

    expect(envelope.magic).toBe('clarity-in-calm-backup');
    expect(typeof envelope.formatVersion).toBe('number');
    expect(envelope.iterations).toBeGreaterThanOrEqual(300_000);
    expect(json).not.toContain('Today I felt calm');
  });

  test('rejects a wrong passphrase with a decryption-specific failure', async () => {
    const envelope = await createBackup(SAMPLE_DATA, 'right passphrase');
    const result = await restoreBackup(JSON.stringify(envelope), 'wrong passphrase');

    expect(result).toEqual({ ok: false, reason: 'decryption-failed' });
  });

  test('rejects tampered ciphertext without ever returning partial or garbage plaintext', async () => {
    const envelope = await createBackup(SAMPLE_DATA, 'a passphrase');
    // Flip one character in the middle (not the base64-padding-sensitive tail)
    // so the tamper stays valid base64 and actually reaches GCM auth.
    const mid = Math.floor(envelope.ciphertext.length / 2);
    const flippedChar = envelope.ciphertext[mid] === 'A' ? 'B' : 'A';
    const tampered = {
      ...envelope,
      ciphertext: envelope.ciphertext.slice(0, mid) + flippedChar + envelope.ciphertext.slice(mid + 1),
    };

    const result = await restoreBackup(JSON.stringify(tampered), 'a passphrase');

    expect(result).toEqual({ ok: false, reason: 'decryption-failed' });
  });

  test('rejects a file missing the expected magic/formatVersion header before decrypting', async () => {
    const notABackup = JSON.stringify({ hello: 'world' });

    const result = await restoreBackup(notABackup, 'any passphrase');

    expect(result).toEqual({ ok: false, reason: 'invalid-envelope' });
  });

  test('rejects a wrong formatVersion as an invalid envelope, distinct from a decryption failure', async () => {
    const envelope = await createBackup(SAMPLE_DATA, 'a passphrase');
    const wrongVersion = JSON.stringify({ ...envelope, formatVersion: 99 });

    const result = await restoreBackup(wrongVersion, 'a passphrase');

    expect(result).toEqual({ ok: false, reason: 'invalid-envelope' });
  });

  test('rejects non-JSON input as an invalid envelope', async () => {
    const result = await restoreBackup('not json at all', 'any passphrase');

    expect(result).toEqual({ ok: false, reason: 'invalid-envelope' });
  });

  test('rejects a structurally corrupt envelope (non-base64 ciphertext) as invalid, not a decryption failure', async () => {
    const envelope = await createBackup(SAMPLE_DATA, 'a passphrase');
    const corrupted = JSON.stringify({ ...envelope, ciphertext: 'not-valid-base64!!!' });

    const result = await restoreBackup(corrupted, 'a passphrase');

    expect(result).toEqual({ ok: false, reason: 'invalid-envelope' });
  });

  test('isValidBackupEnvelope recognizes a genuine envelope header without decrypting', async () => {
    const envelope = await createBackup(SAMPLE_DATA, 'a passphrase');
    expect(isValidBackupEnvelope(JSON.stringify(envelope))).toBe(true);
  });

  test('isValidBackupEnvelope rejects an unrecognized file', () => {
    expect(isValidBackupEnvelope(JSON.stringify({ hello: 'world' }))).toBe(false);
    expect(isValidBackupEnvelope('not json at all')).toBe(false);
  });
});
