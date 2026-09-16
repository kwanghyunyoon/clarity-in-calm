/**
 * Tests for the restore write-then-swap seam in src/lib/data-keys.ts (issue
 * #61): writeRestoreToTemp must never touch a real key, and an interruption
 * between it and promoteRestoredData must leave old data completely intact.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DataKeySpec, promoteRestoredData, readAllData, writeRestoreToTemp } from '@/lib/data-keys';
import { secureWrite } from '@/lib/secure-storage';

const SPECS: DataKeySpec[] = [
  { key: 'wellness_entries_v2', backend: 'secure' },
  { key: 'wellness_custom_tags_v1', backend: 'secure' },
  { key: '@cic:hasSeenOnboarding', backend: 'plain' },
];

describe('restore write-then-swap (data-keys)', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  test('writeRestoreToTemp does not modify any real key', async () => {
    await secureWrite('wellness_entries_v2', [{ id: 'old-1' }]);
    await AsyncStorage.setItem('@cic:hasSeenOnboarding', JSON.stringify(true));

    await writeRestoreToTemp(SPECS, {
      wellness_entries_v2: [{ id: 'new-1' }],
      '@cic:hasSeenOnboarding': false,
    });

    const stillOld = await readAllData(SPECS);
    expect(stillOld.wellness_entries_v2).toEqual([{ id: 'old-1' }]);
    expect(stillOld['@cic:hasSeenOnboarding']).toBe(true);
  });

  test('promoteRestoredData applies the new values for keys present in the backup', async () => {
    await secureWrite('wellness_entries_v2', [{ id: 'old-1' }]);
    const restored = { wellness_entries_v2: [{ id: 'new-1' }, { id: 'new-2' }] };

    await writeRestoreToTemp(SPECS, restored);
    await promoteRestoredData(SPECS, restored);

    const result = await readAllData(SPECS);
    expect(result.wellness_entries_v2).toEqual([{ id: 'new-1' }, { id: 'new-2' }]);
  });

  test('promoteRestoredData deletes a real key absent from the backup (full replacement)', async () => {
    await secureWrite('wellness_custom_tags_v1', ['work', 'family']);
    const restored = { wellness_entries_v2: [{ id: 'new-1' }] }; // tags omitted

    await writeRestoreToTemp(SPECS, restored);
    await promoteRestoredData(SPECS, restored);

    const result = await readAllData(SPECS);
    expect(result.wellness_custom_tags_v1).toBeUndefined();
  });

  test('an interruption between writeRestoreToTemp and promoteRestoredData leaves old data untouched', async () => {
    await secureWrite('wellness_entries_v2', [{ id: 'old-1' }]);
    await AsyncStorage.setItem('@cic:hasSeenOnboarding', JSON.stringify(true));
    const restored = { wellness_entries_v2: [{ id: 'new-1' }], '@cic:hasSeenOnboarding': false };

    await writeRestoreToTemp(SPECS, restored);
    // Simulated interruption: promoteRestoredData is never called.

    const result = await readAllData(SPECS);
    expect(result.wellness_entries_v2).toEqual([{ id: 'old-1' }]);
    expect(result['@cic:hasSeenOnboarding']).toBe(true);
  });

  test('handles plain-backend keys end to end', async () => {
    await AsyncStorage.setItem('@cic:hasSeenOnboarding', JSON.stringify(false));
    const restored = { '@cic:hasSeenOnboarding': true };

    await writeRestoreToTemp(SPECS, restored);
    await promoteRestoredData(SPECS, restored);

    const result = await readAllData(SPECS);
    expect(result['@cic:hasSeenOnboarding']).toBe(true);
  });
});
