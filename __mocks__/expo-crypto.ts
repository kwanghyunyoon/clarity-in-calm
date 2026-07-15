/**
 * Jest mock for expo-crypto's AES-256-GCM surface — backed by the WebCrypto
 * global (unavailable on-device via Hermes, but real AES-GCM under test,
 * unlike the native Keystore/CryptoKit primitives it stands in for).
 */
type Bytes = Uint8Array<ArrayBuffer>;

const IV_LENGTH = 12;

function toBytes(input: Uint8Array): Bytes {
  return Uint8Array.from(input) as Bytes;
}

export class AESEncryptionKey {
  constructor(public readonly raw: Bytes) {}

  static async import(bytes: Uint8Array): Promise<AESEncryptionKey> {
    return new AESEncryptionKey(toBytes(bytes));
  }
}

export class AESSealedData {
  constructor(private readonly combinedBytes: Bytes) {}

  static fromCombined(combined: Uint8Array): AESSealedData {
    return new AESSealedData(toBytes(combined));
  }

  async combined(): Promise<Bytes> {
    return this.combinedBytes;
  }
}

export function getRandomBytes(length: number): Bytes {
  return globalThis.crypto.getRandomValues(new Uint8Array(length) as Bytes);
}

async function importKey(key: AESEncryptionKey, usage: KeyUsage): Promise<CryptoKey> {
  return globalThis.crypto.subtle.importKey('raw', key.raw, { name: 'AES-GCM' }, false, [usage]);
}

export async function aesEncryptAsync(
  plaintext: Uint8Array,
  key: AESEncryptionKey,
): Promise<AESSealedData> {
  const iv = getRandomBytes(IV_LENGTH);
  const cryptoKey = await importKey(key, 'encrypt');
  const ciphertextWithTag = new Uint8Array(
    await globalThis.crypto.subtle.encrypt({ name: 'AES-GCM', iv }, cryptoKey, toBytes(plaintext)),
  ) as Bytes;
  const combined = new Uint8Array(iv.length + ciphertextWithTag.length) as Bytes;
  combined.set(iv, 0);
  combined.set(ciphertextWithTag, iv.length);
  return new AESSealedData(combined);
}

export async function aesDecryptAsync(
  sealedData: AESSealedData,
  key: AESEncryptionKey,
): Promise<Bytes> {
  const combined = await sealedData.combined();
  const iv = combined.slice(0, IV_LENGTH) as Bytes;
  const ciphertextWithTag = combined.slice(IV_LENGTH) as Bytes;
  const cryptoKey = await importKey(key, 'decrypt');
  const pt = await globalThis.crypto.subtle.decrypt({ name: 'AES-GCM', iv }, cryptoKey, ciphertextWithTag);
  return new Uint8Array(pt) as Bytes;
}
