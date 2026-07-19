/**
 * A storage key paired with the backend that owns it. Contexts/hooks export
 * their own `DataKeySpec[]` next to the keys they define, so the delete-all
 * / export-all flow in settings.tsx never has to hand-import raw key
 * constants from each module (the shape that caused the wellness_sessions_v1
 * bug) and can't silently miss a module that stores outside secure-storage
 * (e.g. onboarding's plain AsyncStorage flags).
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { secureDelete, secureRead } from './secure-storage';

export interface DataKeySpec {
  key: string;
  backend: 'secure' | 'plain';
}

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
