import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { secureRead, secureWrite } from './secure-storage';

interface UsePersistedStateOptions<T> {
  /** Read from this key if `key` has no saved value yet (one-time migration fallback). */
  legacyKey?: string;
  /** Applied to whatever was loaded (from `key` or `legacyKey`) before it becomes state, e.g. merging in defaults. */
  transform?: (saved: T) => T;
  /** Called after every save attempt, e.g. to surface a saveError flag. */
  onSaveResult?: (ok: boolean) => void;
}

/**
 * Encapsulates the load -> isLoaded -> save effect pair that each persistence
 * context hand-rolled around secureRead/secureWrite.
 */
export function usePersistedState<T>(
  key: string,
  initialValue: T,
  options: UsePersistedStateOptions<T> = {},
): [T, Dispatch<SetStateAction<T>>, boolean, () => Promise<void>] {
  const { legacyKey, transform, onSaveResult } = options;
  const [value, setValue] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  async function load() {
    const saved = (await secureRead<T>(key)) ?? (legacyKey ? await secureRead<T>(legacyKey) : null);
    if (saved !== null) setValue(transform ? transform(saved) : saved);
  }

  useEffect(() => {
    load()
      .catch(() => {})
      .finally(() => setIsLoaded(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    secureWrite(key, value).then(ok => onSaveResult?.(ok));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, isLoaded]);

  // Re-runs the trusted read path (e.g. after a restore writes new values
  // directly to storage, bypassing this hook's own setValue/secureWrite).
  return [value, setValue, isLoaded, load];
}
