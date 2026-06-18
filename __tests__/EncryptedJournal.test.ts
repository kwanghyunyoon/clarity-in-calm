/**
 * Tests for AES-256-GCM encryption roundtrip.
 * Uses the Web Crypto API (available in Node 18+ and jest-expo environment).
 */

// Minimal AES-256-GCM encrypt/decrypt using Node's built-in WebCrypto (globalThis.crypto)
async function generateKey(): Promise<CryptoKey> {
  return globalThis.crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt'],
  )
}

async function encryptText(key: CryptoKey, plaintext: string): Promise<{ iv: Uint8Array; ct: ArrayBuffer }> {
  const iv   = globalThis.crypto.getRandomValues(new Uint8Array(12))
  const data = new TextEncoder().encode(plaintext)
  const ct   = await globalThis.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv.buffer as ArrayBuffer },
    key,
    data.buffer as ArrayBuffer,
  )
  return { iv, ct }
}

async function decryptText(key: CryptoKey, iv: Uint8Array, ct: ArrayBuffer): Promise<string> {
  const pt = await globalThis.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv.buffer as ArrayBuffer },
    key,
    ct,
  )
  return new TextDecoder().decode(pt)
}

describe('EncryptedJournal', () => {
  let key: CryptoKey

  beforeAll(async () => {
    key = await generateKey()
  })

  test('encrypt/decrypt roundtrip returns original string', async () => {
    const original = 'Today I felt calm and grateful.'
    const { iv, ct } = await encryptText(key, original)
    const decrypted  = await decryptText(key, iv, ct)
    expect(decrypted).toBe(original)
  })

  test('encrypted text differs from plaintext', async () => {
    const original = 'private journal entry'
    const { ct } = await encryptText(key, original)
    const ctStr = String.fromCharCode(...new Uint8Array(ct))
    expect(ctStr).not.toBe(original)
  })

  test('attempt to decrypt with wrong key throws', async () => {
    const { iv, ct } = await encryptText(key, 'secret text')
    const wrongKey   = await generateKey()

    await expect(decryptText(wrongKey, iv, ct)).rejects.toThrow()
  })

  test('empty string roundtrips cleanly', async () => {
    const { iv, ct } = await encryptText(key, '')
    expect(await decryptText(key, iv, ct)).toBe('')
  })
})
