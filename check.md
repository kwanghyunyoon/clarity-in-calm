jayhaxxx88@penguin:~/projects/clarity-in-calm$ npx expo lint
npx tsc --noEmit
env: load .env
env: export EXPO_PUBLIC_SUPABASE_ANON_KEY EXPO_PUBLIC_SUPABASE_URL

/home/jayhaxxx88/projects/clarity-in-calm/src/app/(tabs)/breathe.tsx
   20:7  warning  'PHASE_END_SCALES' is assigned a value but never used                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        @typescript-eslint/no-unused-vars
   95:6  warning  React Hook useEffect has missing dependencies: 'glowOpacity', 'ringScale', and 'scale'. Either include them or remove the dependency array                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   react-hooks/exhaustive-deps
  100:7  error    Error: Calling setState synchronously within an effect can trigger cascading renders

Effects are intended to synchronize state between React and external systems such as manually updating the DOM, state management libraries, or other platform APIs. In general, the body of an effect should do one or both of the following:
* Update external systems with the latest state from React.
* Subscribe for updates from some external system, calling setState in a callback function when external state changes.

Calling setState synchronously within an effect body causes cascading renders that can hurt performance, and is not recommended. (https://react.dev/learn/you-might-not-need-an-effect).

/home/jayhaxxx88/projects/clarity-in-calm/src/app/(tabs)/breathe.tsx:100:7
   98 |   useEffect(() => {
   99 |     if (!isRunning) {
> 100 |       setPhaseLabel(t.breathe.ready);
      |       ^^^^^^^^^^^^^ Avoid calling setState() directly within an effect
  101 |       setPhaseHint(t.breathe.tapToStart);
  102 |       setCountdown(4);
  103 |       return;  react-hooks/set-state-in-effect
  118:6  warning  React Hook useEffect has missing dependencies: 'PHASES', 't.breathe.ready', and 't.breathe.tapToStart'. Either include them or remove the dependency array                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   react-hooks/exhaustive-deps

/home/jayhaxxx88/projects/clarity-in-calm/src/app/(tabs)/index.tsx
  213:17  error  `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`  react/no-unescaped-entities
  213:30  error  `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`  react/no-unescaped-entities

/home/jayhaxxx88/projects/clarity-in-calm/src/app/(tabs)/insights.tsx
   3:3   warning  'Platform' is defined but never used           @typescript-eslint/no-unused-vars
   7:3   warning  'TouchableOpacity' is defined but never used   @typescript-eslint/no-unused-vars
  13:10  warning  'AnimatedPressable' is defined but never used  @typescript-eslint/no-unused-vars
  15:24  warning  'EmotionColors' is defined but never used      @typescript-eslint/no-unused-vars

/home/jayhaxxx88/projects/clarity-in-calm/src/app/(tabs)/journal.tsx
   1:30  warning  'useEffect' is defined but never used  @typescript-eslint/no-unused-vars
   1:41  warning  'useRef' is defined but never used     @typescript-eslint/no-unused-vars
  17:32  warning  'FadeOutUp' is defined but never used  @typescript-eslint/no-unused-vars

/home/jayhaxxx88/projects/clarity-in-calm/src/app/reset-password.tsx
  41:6  warning  React Hook useEffect has a missing dependency: 't.errors.expiredLink'. Either include it or remove the dependency array  react-hooks/exhaustive-deps

/home/jayhaxxx88/projects/clarity-in-calm/src/components/emotions/ContextTagSelector.tsx
  2:58  warning  'View' is defined but never used  @typescript-eslint/no-unused-vars

/home/jayhaxxx88/projects/clarity-in-calm/src/components/emotions/IntensitySlider.tsx
  33:25  error  Error: Cannot access refs during render

React refs are values that are not needed for rendering. Refs should only be accessed outside of render, such as in event handlers or effects. Accessing a ref value (the `current` property) during render can cause your component not to update as expected (https://react.dev/reference/react/useRef).

/home/jayhaxxx88/projects/clarity-in-calm/src/components/emotions/IntensitySlider.tsx:33:25
  31 |
  32 |   const panResponder = useRef(
> 33 |     PanResponder.create({
     |                         ^
> 34 |       onStartShouldSetPanResponder: () => true,
     | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
> 35 |       onMoveShouldSetPanResponder: () => true,
     …
     | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
> 46 |       },
     | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
> 47 |     }),
     | ^^^^^^ Passing a ref to a function may read its value during render
  48 |   ).current;
  49 |
  50 |   const thumbStyle = useAnimatedStyle(() => ({  react-hooks/refs
  68:13  error  Error: This value cannot be modified

This modifies a variable that React considers immutable.

/home/jayhaxxx88/projects/clarity-in-calm/src/components/emotions/IntensitySlider.tsx:68:13
  66 |           if (w > 0 && w !== trackWidth) {
  67 |             setTrackWidth(w);
> 68 |             thumbX.value = toX(value);
     |             ^^^^^^ `thumbX` cannot be modified
  69 |           }
  70 |         }}
  71 |       >                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           react-hooks/immutability
  76:15  error  Error: Cannot access refs during render

React refs are values that are not needed for rendering. Refs should only be accessed outside of render, such as in event handlers or effects. Accessing a ref value (the `current` property) during render can cause your component not to update as expected (https://react.dev/reference/react/useRef).

/home/jayhaxxx88/projects/clarity-in-calm/src/components/emotions/IntensitySlider.tsx:76:15
  74 |         <Animated.View
  75 |           style={[styles.thumb, { backgroundColor: color, borderColor: '#fff' }, thumbStyle]}
> 76 |           {...panResponder.panHandlers}
     |               ^^^^^^^^^^^^^^^^^^^^^^^^ Cannot access ref value during render
  77 |         >
  78 |           <Text style={styles.thumbLabel}>{value}</Text>
  79 |         </Animated.View>                                                                                                                                                                                                              react-hooks/refs

/home/jayhaxxx88/projects/clarity-in-calm/src/components/error-boundary.tsx
  29:82  error  `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`  react/no-unescaped-entities

/home/jayhaxxx88/projects/clarity-in-calm/src/components/onboarding/slide-visuals.tsx
  20:17  error    Error: Cannot access refs during render

React refs are values that are not needed for rendering. Refs should only be accessed outside of render, such as in event handlers or effects. Accessing a ref value (the `current` property) during render can cause your component not to update as expected (https://react.dev/reference/react/useRef).

/home/jayhaxxx88/projects/clarity-in-calm/src/components/onboarding/slide-visuals.tsx:20:17
  18 | // Slide 0 — Welcome: gently pulsing lotus
  19 | function WelcomeVisual() {
> 20 |   const scale = useRef(new Animated.Value(1)).current;
     |                 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Cannot access ref value during render
  21 |
  22 |   useEffect(() => {
  23 |     const anim = Animated.loop(  react-hooks/refs
  20:17  error    Error: Cannot access refs during render

React refs are values that are not needed for rendering. Refs should only be accessed outside of render, such as in event handlers or effects. Accessing a ref value (the `current` property) during render can cause your component not to update as expected (https://react.dev/reference/react/useRef).

/home/jayhaxxx88/projects/clarity-in-calm/src/components/onboarding/slide-visuals.tsx:20:17
  18 | // Slide 0 — Welcome: gently pulsing lotus
  19 | function WelcomeVisual() {
> 20 |   const scale = useRef(new Animated.Value(1)).current;
     |                 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Cannot access ref value during render
  21 |
  22 |   useEffect(() => {
  23 |     const anim = Animated.loop(  react-hooks/refs
  20:17  error    Error: Cannot access refs during render

React refs are values that are not needed for rendering. Refs should only be accessed outside of render, such as in event handlers or effects. Accessing a ref value (the `current` property) during render can cause your component not to update as expected (https://react.dev/reference/react/useRef).

/home/jayhaxxx88/projects/clarity-in-calm/src/components/onboarding/slide-visuals.tsx:20:17
  18 | // Slide 0 — Welcome: gently pulsing lotus
  19 | function WelcomeVisual() {
> 20 |   const scale = useRef(new Animated.Value(1)).current;
     |                 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Cannot access ref value during render
  21 |
  22 |   useEffect(() => {
  23 |     const anim = Animated.loop(  react-hooks/refs
  20:17  error    Error: Cannot access refs during render

React refs are values that are not needed for rendering. Refs should only be accessed outside of render, such as in event handlers or effects. Accessing a ref value (the `current` property) during render can cause your component not to update as expected (https://react.dev/reference/react/useRef).

/home/jayhaxxx88/projects/clarity-in-calm/src/components/onboarding/slide-visuals.tsx:20:17
  18 | // Slide 0 — Welcome: gently pulsing lotus
  19 | function WelcomeVisual() {
> 20 |   const scale = useRef(new Animated.Value(1)).current;
     |                 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Cannot access ref value during render
  21 |
  22 |   useEffect(() => {
  23 |     const anim = Animated.loop(  react-hooks/refs
  20:17  error    Error: Cannot access refs during render

React refs are values that are not needed for rendering. Refs should only be accessed outside of render, such as in event handlers or effects. Accessing a ref value (the `current` property) during render can cause your component not to update as expected (https://react.dev/reference/react/useRef).

/home/jayhaxxx88/projects/clarity-in-calm/src/components/onboarding/slide-visuals.tsx:20:17
  18 | // Slide 0 — Welcome: gently pulsing lotus
  19 | function WelcomeVisual() {
> 20 |   const scale = useRef(new Animated.Value(1)).current;
     |                 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Cannot access ref value during render
  21 |
  22 |   useEffect(() => {
  23 |     const anim = Animated.loop(  react-hooks/refs
  31:6   warning  React Hook useEffect has a missing dependency: 'scale'. Either include it or remove the dependency array                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        react-hooks/exhaustive-deps

/home/jayhaxxx88/projects/clarity-in-calm/src/components/today/StreakCard.tsx
   8:3   warning  'withSpring' is defined but never used                                                                         @typescript-eslint/no-unused-vars
  13:10  warning  'Colors' is defined but never used                                                                             @typescript-eslint/no-unused-vars
  41:6   warning  React Hook useEffect has a missing dependency: 'flameScale'. Either include it or remove the dependency array  react-hooks/exhaustive-deps

/home/jayhaxxx88/projects/clarity-in-calm/src/components/ui/AnimatedPressable.tsx
  23:26  error  Error: This value cannot be modified

This modifies a variable that React considers immutable.

/home/jayhaxxx88/projects/clarity-in-calm/src/components/ui/AnimatedPressable.tsx:23:26
  21 |     <AnimatedPressableBase
  22 |       style={[style, animStyle]}
> 23 |       onPressIn={() => { sv.value = withSpring(scale, { damping: 15, stiffness: 400 }); }}
     |                          ^^ `sv` cannot be modified
  24 |       onPressOut={() => { sv.value = withSpring(1, { damping: 15, stiffness: 400 }); }}
  25 |       {...rest}
  26 |     >  react-hooks/immutability
  24:27  error  Error: This value cannot be modified

This modifies a variable that React considers immutable.

/home/jayhaxxx88/projects/clarity-in-calm/src/components/ui/AnimatedPressable.tsx:24:27
  22 |       style={[style, animStyle]}
  23 |       onPressIn={() => { sv.value = withSpring(scale, { damping: 15, stiffness: 400 }); }}
> 24 |       onPressOut={() => { sv.value = withSpring(1, { damping: 15, stiffness: 400 }); }}
     |                           ^^ `sv` cannot be modified
  25 |       {...rest}
  26 |     >
  27 |       {children}           react-hooks/immutability

/home/jayhaxxx88/projects/clarity-in-calm/src/hooks/use-color-scheme.web.ts
  11:5  error  Error: Calling setState synchronously within an effect can trigger cascading renders

Effects are intended to synchronize state between React and external systems such as manually updating the DOM, state management libraries, or other platform APIs. In general, the body of an effect should do one or both of the following:
* Update external systems with the latest state from React.
* Subscribe for updates from some external system, calling setState in a callback function when external state changes.

Calling setState synchronously within an effect body causes cascading renders that can hurt performance, and is not recommended. (https://react.dev/learn/you-might-not-need-an-effect).

/home/jayhaxxx88/projects/clarity-in-calm/src/hooks/use-color-scheme.web.ts:11:5
   9 |
  10 |   useEffect(() => {
> 11 |     setHasHydrated(true);
     |     ^^^^^^^^^^^^^^ Avoid calling setState() directly within an effect
  12 |   }, []);
  13 |
  14 |   const colorScheme = useRNColorScheme();  react-hooks/set-state-in-effect

/home/jayhaxxx88/projects/clarity-in-calm/src/hooks/use-onboarding-flow.ts
  55:24  error  Error: Calling setState synchronously within an effect can trigger cascading renders

Effects are intended to synchronize state between React and external systems such as manually updating the DOM, state management libraries, or other platform APIs. In general, the body of an effect should do one or both of the following:
* Update external systems with the latest state from React.
* Subscribe for updates from some external system, calling setState in a callback function when external state changes.

Calling setState synchronously within an effect body causes cascading renders that can hurt performance, and is not recommended. (https://react.dev/learn/you-might-not-need-an-effect).

/home/jayhaxxx88/projects/clarity-in-calm/src/hooks/use-onboarding-flow.ts:55:24
  53 |
  54 |   useEffect(() => {
> 55 |     if (isHelpVisible) setPage(0);
     |                        ^^^^^^^ Avoid calling setState() directly within an effect
  56 |   }, [isHelpVisible]);
  57 |
  58 |   const visible = firstLaunch || isHelpVisible;  react-hooks/set-state-in-effect

✖ 32 problems (16 errors, 16 warnings)

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


Found 103 errors in 6 files.

Errors  Files
    20  __tests__/BreathingExercise.test.ts:7
    15  __tests__/CrisisDetection.test.ts:9
     5  __tests__/CrisisKeywordsParity.test.ts:12
    16  __tests__/EncryptedJournal.test.ts:10
    31  __tests__/InsightsAnalytics.test.ts:33
    16  __tests__/MoodTracker.test.ts:16
jayhaxxx88@penguin:~/projects/clarity-in-calm$ 
