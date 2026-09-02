jayhaxxx88@penguin:~/projects/clarity-in-calm$ npx tsc --noemit
__tests__/BreathingExercise.test.ts:7:1 - error TS2593: Cannot find name 'describe'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

7 describe('BreathingExercise', () => {
  ~~~~~~~~

__tests__/BreathingExercise.test.ts:8:3 - error TS2593: Cannot find name 'test'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

8   test('phase transitions: inhale → hold → exhale → rest', () => {
    ~~~~

__tests__/BreathingExercise.test.ts:9:5 - error TS2304: Cannot find name 'expect'.

9     expect(getPhaseAtTime(0)).toBe('inhale');
      ~~~~~~

__tests__/BreathingExercise.test.ts:10:5 - error TS2304: Cannot find name 'expect'.

10     expect(getPhaseAtTime(4000)).toBe('hold1');
       ~~~~~~

__tests__/BreathingExercise.test.ts:11:5 - error TS2304: Cannot find name 'expect'.

11     expect(getPhaseAtTime(8000)).toBe('exhale');
       ~~~~~~

__tests__/BreathingExercise.test.ts:12:5 - error TS2304: Cannot find name 'expect'.

12     expect(getPhaseAtTime(12000)).toBe('rest');
       ~~~~~~

__tests__/BreathingExercise.test.ts:15:3 - error TS2593: Cannot find name 'test'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

15   test('phase wraps back to inhale after full cycle', () => {
     ~~~~

__tests__/BreathingExercise.test.ts:16:5 - error TS2304: Cannot find name 'expect'.

16     expect(getPhaseAtTime(CYCLE_MS)).toBe('inhale');
       ~~~~~~

__tests__/BreathingExercise.test.ts:19:3 - error TS2593: Cannot find name 'test'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

19   test('duration of each phase matches configured values', () => {
     ~~~~

__tests__/BreathingExercise.test.ts:20:5 - error TS2304: Cannot find name 'expect'.

20     expect(PHASE_DURATIONS).toEqual([4000, 4000, 4000, 4000]);
       ~~~~~~

__tests__/BreathingExercise.test.ts:23:3 - error TS2593: Cannot find name 'test'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

23   test('mid-phase timing lands in correct phase', () => {
     ~~~~

__tests__/BreathingExercise.test.ts:24:5 - error TS2304: Cannot find name 'expect'.

24     expect(getPhaseAtTime(2000)).toBe('inhale');  // 2s into inhale
       ~~~~~~

__tests__/BreathingExercise.test.ts:25:5 - error TS2304: Cannot find name 'expect'.

25     expect(getPhaseAtTime(5000)).toBe('hold1');   // 1s into hold
       ~~~~~~

__tests__/BreathingExercise.test.ts:26:5 - error TS2304: Cannot find name 'expect'.

26     expect(getPhaseAtTime(9000)).toBe('exhale');  // 1s into exhale
       ~~~~~~

__tests__/BreathingExercise.test.ts:27:5 - error TS2304: Cannot find name 'expect'.

27     expect(getPhaseAtTime(13000)).toBe('rest');   // 1s into rest
       ~~~~~~

__tests__/BreathingExercise.test.ts:30:3 - error TS2593: Cannot find name 'test'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

30   test('countdown reflects seconds remaining in the current phase', () => {
     ~~~~

__tests__/BreathingExercise.test.ts:31:5 - error TS2304: Cannot find name 'expect'.

31     expect(getPhaseCountdownAtTime(0)).toBe(4);
       ~~~~~~

__tests__/BreathingExercise.test.ts:32:5 - error TS2304: Cannot find name 'expect'.

32     expect(getPhaseCountdownAtTime(3000)).toBe(1);
       ~~~~~~

__tests__/BreathingExercise.test.ts:33:5 - error TS2304: Cannot find name 'expect'.

33     expect(getPhaseCountdownAtTime(3999)).toBe(1);
       ~~~~~~

__tests__/BreathingExercise.test.ts:34:5 - error TS2304: Cannot find name 'expect'.

34     expect(getPhaseCountdownAtTime(4000)).toBe(4);
       ~~~~~~

__tests__/CrisisDetection.test.ts:9:1 - error TS2593: Cannot find name 'describe'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

9 describe('checkCrisis', () => {
  ~~~~~~~~

__tests__/CrisisDetection.test.ts:12:3 - error TS2593: Cannot find name 'test'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

12   test('flags text containing a crisis keyword', () => {
     ~~~~

__tests__/CrisisDetection.test.ts:13:5 - error TS2304: Cannot find name 'expect'.

13     expect(checkCrisis('I want to end my life', enKeywords)).toBe(true);
       ~~~~~~

__tests__/CrisisDetection.test.ts:16:3 - error TS2593: Cannot find name 'test'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

16   test('is case-insensitive on the input text', () => {
     ~~~~

__tests__/CrisisDetection.test.ts:17:5 - error TS2304: Cannot find name 'expect'.

17     expect(checkCrisis('I WANT TO DIE today', enKeywords)).toBe(true);
       ~~~~~~

__tests__/CrisisDetection.test.ts:20:3 - error TS2593: Cannot find name 'test'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

20   test('matches a keyword phrase embedded in a longer sentence', () => {
     ~~~~

__tests__/CrisisDetection.test.ts:21:5 - error TS2304: Cannot find name 'expect'.

21     expect(checkCrisis('lately I feel like better off dead most days', enKeywords)).toBe(true);
       ~~~~~~

__tests__/CrisisDetection.test.ts:24:3 - error TS2593: Cannot find name 'test'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

24   test('does not flag ordinary journal text', () => {
     ~~~~

__tests__/CrisisDetection.test.ts:25:5 - error TS2304: Cannot find name 'expect'.

25     expect(checkCrisis('Had a good day at work, feeling grateful.', enKeywords)).toBe(false);
       ~~~~~~

__tests__/CrisisDetection.test.ts:28:3 - error TS2593: Cannot find name 'test'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

28   test('does not flag empty text', () => {
     ~~~~

__tests__/CrisisDetection.test.ts:29:5 - error TS2304: Cannot find name 'expect'.

29     expect(checkCrisis('', enKeywords)).toBe(false);
       ~~~~~~

__tests__/CrisisDetection.test.ts:34:3 - error TS2593: Cannot find name 'test'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

34   test.each(LOCALES)('detects a real %s suicidalIdeation phrase', (locale) => {
     ~~~~

__tests__/CrisisDetection.test.ts:34:68 - error TS7006: Parameter 'locale' implicitly has an 'any' type.

34   test.each(LOCALES)('detects a real %s suicidalIdeation phrase', (locale) => {
                                                                      ~~~~~~

__tests__/CrisisDetection.test.ts:35:22 - error TS7053: Element implicitly has an 'any' type because expression of type 'any' can't be used to index type 'Record<Locale, { readonly tabs: { readonly home: string; readonly breathe: string; readonly journal: string; readonly today: string; readonly emotions: string; readonly insights: string; readonly settings: string; }; ... 16 more ...; readonly feelingsLibraryContent: { ...; }; }>'.

35     const keywords = TRANSLATIONS[locale].journal.crisisKeywords;
                        ~~~~~~~~~~~~~~~~~~~~

__tests__/CrisisDetection.test.ts:37:5 - error TS2304: Cannot find name 'expect'.

37     expect(checkCrisis(firstPhrase, keywords)).toBe(true);
       ~~~~~~

__tests__/CrisisKeywordsParity.test.ts:12:1 - error TS2593: Cannot find name 'describe'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

12 describe('crisisKeywords locale parity', () => {
   ~~~~~~~~

__tests__/CrisisKeywordsParity.test.ts:18:3 - error TS2593: Cannot find name 'test'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

18   test('every locale defines the same crisis-keyword categories', () => {
     ~~~~

__tests__/CrisisKeywordsParity.test.ts:21:7 - error TS2304: Cannot find name 'expect'.

21       expect({ locale, keys }).toEqual({ locale, keys: expected.keys });
         ~~~~~~

__tests__/CrisisKeywordsParity.test.ts:25:3 - error TS2593: Cannot find name 'test'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

25   test.each(LOCALES)('%s has at least one phrase per non-empty-by-design category', (locale: Locale) => {
     ~~~~

__tests__/CrisisKeywordsParity.test.ts:29:7 - error TS2304: Cannot find name 'expect'.

29       expect(phrases.length).toBeGreaterThan(0);
         ~~~~~~

__tests__/EncryptedJournal.test.ts:10:1 - error TS2593: Cannot find name 'describe'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

10 describe('EncryptedJournal (secure-storage)', () => {
   ~~~~~~~~

__tests__/EncryptedJournal.test.ts:11:3 - error TS2593: Cannot find name 'test'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

11   test('write/read roundtrip returns the original value', async () => {
     ~~~~

__tests__/EncryptedJournal.test.ts:13:5 - error TS2304: Cannot find name 'expect'.

13     expect(await secureWrite('journal_entry_1', original)).toBe(true);
       ~~~~~~

__tests__/EncryptedJournal.test.ts:14:5 - error TS2304: Cannot find name 'expect'.

14     expect(await secureRead('journal_entry_1')).toEqual(original);
       ~~~~~~

__tests__/EncryptedJournal.test.ts:17:3 - error TS2593: Cannot find name 'test'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

17   test('stored ciphertext does not contain the plaintext', async () => {
     ~~~~

__tests__/EncryptedJournal.test.ts:22:5 - error TS2304: Cannot find name 'expect'.

22     expect(raw).not.toBeNull();
       ~~~~~~

__tests__/EncryptedJournal.test.ts:23:5 - error TS2304: Cannot find name 'expect'.

23     expect(raw as string).not.toContain(secret);
       ~~~~~~

__tests__/EncryptedJournal.test.ts:26:3 - error TS2593: Cannot find name 'test'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

26   test('tampered ciphertext fails GCM authentication and reads back null', async () => {
     ~~~~

__tests__/EncryptedJournal.test.ts:34:5 - error TS2304: Cannot find name 'expect'.

34     expect(await secureRead('journal_entry_3')).toBeNull();
       ~~~~~~

__tests__/EncryptedJournal.test.ts:37:3 - error TS2593: Cannot find name 'test'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

37   test('missing key reads back null', async () => {
     ~~~~

__tests__/EncryptedJournal.test.ts:38:5 - error TS2304: Cannot find name 'expect'.

38     expect(await secureRead('journal_entry_never_written')).toBeNull();
       ~~~~~~

__tests__/EncryptedJournal.test.ts:41:3 - error TS2593: Cannot find name 'test'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

41   test('secureDelete removes the entry', async () => {
     ~~~~

__tests__/EncryptedJournal.test.ts:43:5 - error TS2304: Cannot find name 'expect'.

43     expect(await secureRead('journal_entry_4')).not.toBeNull();
       ~~~~~~

__tests__/EncryptedJournal.test.ts:46:5 - error TS2304: Cannot find name 'expect'.

46     expect(await secureRead('journal_entry_4')).toBeNull();
       ~~~~~~

__tests__/EncryptedJournal.test.ts:49:3 - error TS2593: Cannot find name 'test'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

49   test('empty string note roundtrips cleanly', async () => {
     ~~~~

__tests__/EncryptedJournal.test.ts:51:5 - error TS2304: Cannot find name 'expect'.

51     expect(await secureRead('journal_entry_5')).toEqual({ note: '' });
       ~~~~~~

__tests__/InsightsAnalytics.test.ts:33:1 - error TS2593: Cannot find name 'describe'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

33 describe('getLast7Days', () => {
   ~~~~~~~~

__tests__/InsightsAnalytics.test.ts:34:3 - error TS2593: Cannot find name 'test'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

34   test('returns 7 consecutive local-date strings ending today', () => {
     ~~~~

__tests__/InsightsAnalytics.test.ts:37:5 - error TS2304: Cannot find name 'expect'.

37     expect(days).toEqual([
       ~~~~~~

__tests__/InsightsAnalytics.test.ts:44:1 - error TS2593: Cannot find name 'describe'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

44 describe('computeAvgIntensity', () => {
   ~~~~~~~~

__tests__/InsightsAnalytics.test.ts:45:3 - error TS2593: Cannot find name 'test'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

45   test('averages intensity across logs', () => {
     ~~~~

__tests__/InsightsAnalytics.test.ts:48:5 - error TS2304: Cannot find name 'expect'.

48     expect(computeAvgIntensity(logs)).toBe(6);
       ~~~~~~

__tests__/InsightsAnalytics.test.ts:51:3 - error TS2593: Cannot find name 'test'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

51   test('returns 0 for no logs', () => {
     ~~~~

__tests__/InsightsAnalytics.test.ts:52:5 - error TS2304: Cannot find name 'expect'.

52     expect(computeAvgIntensity([])).toBe(0);
       ~~~~~~

__tests__/InsightsAnalytics.test.ts:56:1 - error TS2593: Cannot find name 'describe'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

56 describe('computeTopEmotion', () => {
   ~~~~~~~~

__tests__/InsightsAnalytics.test.ts:57:3 - error TS2593: Cannot find name 'test'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

57   test('picks the most frequently logged emotion', () => {
     ~~~~

__tests__/InsightsAnalytics.test.ts:63:5 - error TS2304: Cannot find name 'expect'.

63     expect(computeTopEmotion(logs, '#000')?.label).toBe('fear');
       ~~~~~~

__tests__/InsightsAnalytics.test.ts:66:3 - error TS2593: Cannot find name 'test'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

66   test('falls back to the given color for an unknown emotionId', () => {
     ~~~~

__tests__/InsightsAnalytics.test.ts:68:5 - error TS2304: Cannot find name 'expect'.

68     expect(computeTopEmotion(logs, '#123456')?.color).toBe('#123456');
       ~~~~~~

__tests__/InsightsAnalytics.test.ts:71:3 - error TS2593: Cannot find name 'test'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

71   test('returns null with no logs', () => {
     ~~~~

__tests__/InsightsAnalytics.test.ts:72:5 - error TS2304: Cannot find name 'expect'.

72     expect(computeTopEmotion([], '#000')).toBeNull();
       ~~~~~~

__tests__/InsightsAnalytics.test.ts:76:1 - error TS2593: Cannot find name 'describe'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

76 describe('computeTriggerCounts', () => {
   ~~~~~~~~

__tests__/InsightsAnalytics.test.ts:77:3 - error TS2593: Cannot find name 'test'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

77   test('ranks tags by frequency, most common first', () => {
     ~~~~

__tests__/InsightsAnalytics.test.ts:82:5 - error TS2304: Cannot find name 'expect'.

82     expect(computeTriggerCounts(logs)).toEqual([['work', 2], ['commuting', 1]]);
       ~~~~~~

__tests__/InsightsAnalytics.test.ts:85:3 - error TS2593: Cannot find name 'test'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

85   test('caps results at the given limit', () => {
     ~~~~

__tests__/InsightsAnalytics.test.ts:90:5 - error TS2304: Cannot find name 'expect'.

90     expect(computeTriggerCounts(logs, 2)).toHaveLength(2);
       ~~~~~~

__tests__/InsightsAnalytics.test.ts:94:1 - error TS2593: Cannot find name 'describe'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

94 describe('computeTimeOfDay', () => {
   ~~~~~~~~

__tests__/InsightsAnalytics.test.ts:95:3 - error TS2593: Cannot find name 'test'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

95   test('buckets logs into morning/afternoon/evening/night', () => {
     ~~~~

__tests__/InsightsAnalytics.test.ts:102:5 - error TS2304: Cannot find name 'expect'.

102     expect(computeTimeOfDay(logs)).toEqual({ morning: 1, afternoon: 1, evening: 1, night: 1 });
        ~~~~~~

__tests__/InsightsAnalytics.test.ts:106:1 - error TS2593: Cannot find name 'describe'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

106 describe('computeDayMoods', () => {
    ~~~~~~~~

__tests__/InsightsAnalytics.test.ts:107:3 - error TS2593: Cannot find name 'test'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

107   test('averages same-day entries and returns null for days with none', () => {
      ~~~~

__tests__/InsightsAnalytics.test.ts:113:5 - error TS2304: Cannot find name 'expect'.

113     expect(computeDayMoods(entries, days)).toEqual([null, 3]);
        ~~~~~~

__tests__/InsightsAnalytics.test.ts:117:1 - error TS2593: Cannot find name 'describe'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

117 describe('computeMoodDistribution', () => {
    ~~~~~~~~

__tests__/InsightsAnalytics.test.ts:118:3 - error TS2593: Cannot find name 'test'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

118   test('counts entries per mood value and scales pct to the max bucket', () => {
      ~~~~

__tests__/InsightsAnalytics.test.ts:124:5 - error TS2304: Cannot find name 'expect'.

124     expect(computeMoodDistribution(entries)).toEqual([
        ~~~~~~

__tests__/InsightsAnalytics.test.ts:133:3 - error TS2593: Cannot find name 'test'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

133   test('all buckets zero when there are no entries', () => {
      ~~~~

__tests__/InsightsAnalytics.test.ts:134:5 - error TS2304: Cannot find name 'expect'.

134     expect(computeMoodDistribution([])).toEqual([
        ~~~~~~

__tests__/MoodTracker.test.ts:16:1 - error TS2593: Cannot find name 'describe'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

16 describe('MoodTracker', () => {
   ~~~~~~~~

__tests__/MoodTracker.test.ts:17:3 - error TS2593: Cannot find name 'test'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

17   test('selecting a mood records it in the entry', () => {
     ~~~~

__tests__/MoodTracker.test.ts:19:5 - error TS2304: Cannot find name 'expect'.

19     expect(entry.mood).toBe(4);
       ~~~~~~

__tests__/MoodTracker.test.ts:22:3 - error TS2593: Cannot find name 'test'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

22   test('mood value is within valid range 1–5', () => {
     ~~~~

__tests__/MoodTracker.test.ts:25:7 - error TS2304: Cannot find name 'expect'.

25       expect(entry.mood).toBeGreaterThanOrEqual(1);
         ~~~~~~

__tests__/MoodTracker.test.ts:26:7 - error TS2304: Cannot find name 'expect'.

26       expect(entry.mood).toBeLessThanOrEqual(5);
         ~~~~~~

__tests__/MoodTracker.test.ts:30:3 - error TS2593: Cannot find name 'test'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

30   test('logging mood today with no prior entries → streak of 1', () => {
     ~~~~

__tests__/MoodTracker.test.ts:32:5 - error TS2304: Cannot find name 'expect'.

32     expect(computeStreak(entries)).toBe(1);
       ~~~~~~

__tests__/MoodTracker.test.ts:35:3 - error TS2593: Cannot find name 'test'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

35   test('consecutive days → streak increments', () => {
     ~~~~

__tests__/MoodTracker.test.ts:37:5 - error TS2304: Cannot find name 'expect'.

37     expect(computeStreak(entries)).toBe(3);
       ~~~~~~

__tests__/MoodTracker.test.ts:40:3 - error TS2593: Cannot find name 'test'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

40   test('gap of 1 day resets streak to 0 (unless yesterday)', () => {
     ~~~~

__tests__/MoodTracker.test.ts:43:5 - error TS2304: Cannot find name 'expect'.

43     expect(computeStreak(entries)).toBe(0);
       ~~~~~~

__tests__/MoodTracker.test.ts:46:3 - error TS2593: Cannot find name 'test'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

46   test('multiple entries same day count as a single day in streak', () => {
     ~~~~

__tests__/MoodTracker.test.ts:48:5 - error TS2304: Cannot find name 'expect'.

48     expect(computeStreak(entries)).toBe(3);
       ~~~~~~

__tests__/MoodTracker.test.ts:51:3 - error TS2593: Cannot find name 'test'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.

51   test('toLocalDateStr groups same-day entries under one key', () => {
     ~~~~

__tests__/MoodTracker.test.ts:56:5 - error TS2304: Cannot find name 'expect'.

56     expect(toLocalDateStr(morning)).toBe(toLocalDateStr(night));
       ~~~~~~

src/app/(tabs)/insights.tsx:72:5 - error TS2820: Type '"partly-cloudy-night-outline"' is not assignable to type '"search" | "repeat" | "link" | "at" | "home" | "journal" | "today" | "settings" | "map" | "filter" | "body" | "notifications" | "language" | "calendar" | "text" | "walk" | "call" | ... 1339 more ... | "woman-sharp"'. Did you mean '"cloudy-night-outline"'?

72     evening:   'partly-cloudy-night-outline',
       ~~~~~~~


Found 104 errors in 7 files.

Errors  Files
    20  __tests__/BreathingExercise.test.ts:7
    15  __tests__/CrisisDetection.test.ts:9
     5  __tests__/CrisisKeywordsParity.test.ts:12
    16  __tests__/EncryptedJournal.test.ts:10
    31  __tests__/InsightsAnalytics.test.ts:33
    16  __tests__/MoodTracker.test.ts:16
     1  src/app/(tabs)/insights.tsx:72
