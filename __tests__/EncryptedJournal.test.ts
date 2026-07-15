/**
 * Tests for src/lib/secure-storage.ts — the AES-256-GCM read/write/delete
 * path journal entries actually go through. expo-crypto / expo-secure-store /
 * AsyncStorage are jest-mocked (see __mocks__/); the mocked AES is real
 * WebCrypto AES-GCM, so encrypt/decrypt/tamper-detection behavior is genuine.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { secureDelete, secureRead, secureWrite } from '@/lib/secure-storage';

describe('EncryptedJournal (secure-storage)', () => {
  test('write/read roundtrip returns the original value', async () => {
    const original = { note: 'Today I felt calm and grateful.' };
    expect(await secureWrite('journal_entry_1', original)).toBe(true);
    expect(await secureRead('journal_entry_1')).toEqual(original);
  });

  test('stored ciphertext does not contain the plaintext', async () => {
    const secret = 'private journal entry';
    await secureWrite('journal_entry_2', secret);

    const raw = await AsyncStorage.getItem('@cic_enc:journal_entry_2');
    expect(raw).not.toBeNull();
    expect(raw as string).not.toContain(secret);
  });

  test('tampered ciphertext fails GCM authentication and reads back null', async () => {
    await secureWrite('journal_entry_3', { note: 'secret text' });

    const stored = JSON.parse((await AsyncStorage.getItem('@cic_enc:journal_entry_3'))!);
    // Flip a character in the base64 ciphertext to corrupt the auth tag.
    const flipped = stored.ct.slice(0, -1) + (stored.ct.slice(-1) === 'A' ? 'B' : 'A');
    await AsyncStorage.setItem('@cic_enc:journal_entry_3', JSON.stringify({ ...stored, ct: flipped }));

    expect(await secureRead('journal_entry_3')).toBeNull();
  });

  test('missing key reads back null', async () => {
    expect(await secureRead('journal_entry_never_written')).toBeNull();
  });

  test('secureDelete removes the entry', async () => {
    await secureWrite('journal_entry_4', { note: 'to be deleted' });
    expect(await secureRead('journal_entry_4')).not.toBeNull();

    await secureDelete('journal_entry_4');
    expect(await secureRead('journal_entry_4')).toBeNull();
  });

  test('empty string note roundtrips cleanly', async () => {
    await secureWrite('journal_entry_5', { note: '' });
    expect(await secureRead('journal_entry_5')).toEqual({ note: '' });
  });
});
