/**
 * A storage key paired with the backend that owns it. Contexts/hooks export
 * their own `DataKeySpec[]` next to the keys they define, so the delete-all
 * / export-all flow in settings.tsx never has to hand-import raw key
 * constants from each module (the shape that caused the wellness_sessions_v1
 * bug) and can't silently miss a module that stores outside secure-storage
 * (e.g. onboarding's plain AsyncStorage flags).
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { secureDelete, secureRead, secureWrite } from './secure-storage';

export interface DataKeySpec {
  key: string;
  backend: 'secure' | 'plain';
}

/** Namespaces a real key's restore-in-progress copy so it never collides
 * with (or is mistaken for) the live value at that key. */
const RESTORE_TMP_PREFIX = '__restore_tmp__:';
const tempKeyFor = (key: string): string => `${RESTORE_TMP_PREFIX}${key}`;

export async function readAllData(specs: DataKeySpec[]): Promise<Record<string, unknown>> {
  const payload: Record<string, unknown> = {};
  await Promise.all(
    specs.map(async ({ key, backend }) => {
      const raw = backend === 'secure' ? await secureRead<unknown>(key) : await AsyncStorage.getItem(key);
      if (raw === null || raw === undefined) return;
      if (backend === 'secure') {
        payload[key] = raw;
      } else {
        try { payload[key] = JSON.parse(raw as string); } catch { payload[key] = raw; }
      }
    }),
  );
  return payload;
}

export async function deleteAllData(specs: DataKeySpec[]): Promise<void> {
  await Promise.all(
    specs.map(({ key, backend }) => (backend === 'secure' ? secureDelete(key) : AsyncStorage.removeItem(key))),
  );
}

/**
 * Restore, phase 1: writes restored values to temp-namespaced copies of
 * their keys, touching no real key. If this throws partway through, every
 * real key is exactly as it was — nothing has been promoted yet.
 */
export async function writeRestoreToTemp(specs: DataKeySpec[], data: Record<string, unknown>): Promise<void> {
  await Promise.all(
    specs.map(async ({ key, backend }) => {
      if (!(key in data)) return;
      const tmpKey = tempKeyFor(key);
      if (backend === 'secure') {
        const ok = await secureWrite(tmpKey, data[key]);
        if (!ok) throw new Error(`[data-keys] failed writing restore temp copy for "${key}"`);
      } else {
        await AsyncStorage.setItem(tmpKey, JSON.stringify(data[key]));
      }
    }),
  );
}

/**
 * Restore, phase 2: only call after writeRestoreToTemp has fully succeeded.
 * Promotes each temp copy over its real key (or, for a key absent from the
 * backup, deletes the real key so restore is a genuine full replacement),
 * then removes the temp copy. An interruption here can leave some keys
 * promoted and others not, but every key that was promoted holds a complete,
 * verified value — never a partial write.
 */
export async function promoteRestoredData(specs: DataKeySpec[], data: Record<string, unknown>): Promise<void> {
  for (const { key, backend } of specs) {
    if (key in data) {
      const tmpKey = tempKeyFor(key);
      if (backend === 'secure') {
        const value = await secureRead<unknown>(tmpKey);
        const ok = await secureWrite(key, value);
        if (!ok) throw new Error(`[data-keys] failed promoting restored value for "${key}"`);
        await secureDelete(tmpKey);
      } else {
        const raw = await AsyncStorage.getItem(tmpKey);
        if (raw !== null) await AsyncStorage.setItem(key, raw);
        await AsyncStorage.removeItem(tmpKey);
      }
    } else {
      if (backend === 'secure') await secureDelete(key);
      else await AsyncStorage.removeItem(key);
    }
  }
}
