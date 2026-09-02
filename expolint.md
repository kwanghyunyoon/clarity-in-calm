jayhaxxx88@penguin:~/projects/clarity-in-calm$ npx expo lint
env: load .env
env: export EXPO_PUBLIC_SUPABASE_ANON_KEY EXPO_PUBLIC_SUPABASE_URL

/home/jayhaxxx88/projects/clarity-in-calm/src/app/(tabs)/breathe.tsx
   20:7  warning  'PHASE_END_SCALES' is assigned a value but never used                                                                                                       @typescript-eslint/no-unused-vars
   95:6  warning  React Hook useEffect has missing dependencies: 'glowOpacity', 'ringScale', and 'scale'. Either include them or remove the dependency array                  react-hooks/exhaustive-deps
  120:4  warning  React Hook useEffect has missing dependencies: 'PHASES', 't.breathe.ready', and 't.breathe.tapToStart'. Either include them or remove the dependency array  react-hooks/exhaustive-deps

/home/jayhaxxx88/projects/clarity-in-calm/src/app/(tabs)/insights.tsx
   4:3   warning  'Platform' is defined but never used           @typescript-eslint/no-unused-vars
   8:3   warning  'TouchableOpacity' is defined but never used   @typescript-eslint/no-unused-vars
  14:10  warning  'AnimatedPressable' is defined but never used  @typescript-eslint/no-unused-vars
  16:24  warning  'EmotionColors' is defined but never used      @typescript-eslint/no-unused-vars

/home/jayhaxxx88/projects/clarity-in-calm/src/app/(tabs)/journal.tsx
   2:30  warning  'useEffect' is defined but never used  @typescript-eslint/no-unused-vars
   2:41  warning  'useRef' is defined but never used     @typescript-eslint/no-unused-vars
  18:32  warning  'FadeOutUp' is defined but never used  @typescript-eslint/no-unused-vars

/home/jayhaxxx88/projects/clarity-in-calm/src/app/reset-password.tsx
  41:6  warning  React Hook useEffect has a missing dependency: 't.errors.expiredLink'. Either include it or remove the dependency array  react-hooks/exhaustive-deps

/home/jayhaxxx88/projects/clarity-in-calm/src/components/emotions/ContextTagSelector.tsx
  2:58  warning  'View' is defined but never used  @typescript-eslint/no-unused-vars

/home/jayhaxxx88/projects/clarity-in-calm/src/components/emotions/IntensitySlider.tsx
   1:8   warning  'React' is defined but never used                                                            @typescript-eslint/no-unused-vars
   1:17  warning  'useRef' is defined but never used                                                           @typescript-eslint/no-unused-vars
   1:25  warning  'useState' is defined but never used                                                         @typescript-eslint/no-unused-vars
   5:3   warning  'useSharedValue' is defined but never used                                                   @typescript-eslint/no-unused-vars
  30:26  warning  'useRef' is defined but never used                                                           @typescript-eslint/no-unused-vars
  33:7   warning  'panResponder' is assigned a value but never used                                            @typescript-eslint/no-unused-vars
  70:5   warning  Unused eslint-disable directive (no problems were reported from 'react-hooks/immutability')

/home/jayhaxxx88/projects/clarity-in-calm/src/components/today/StreakCard.tsx
   8:3   warning  'withSpring' is defined but never used                                                                         @typescript-eslint/no-unused-vars
  13:10  warning  'Colors' is defined but never used                                                                             @typescript-eslint/no-unused-vars
  41:6   warning  React Hook useEffect has a missing dependency: 'flameScale'. Either include it or remove the dependency array  react-hooks/exhaustive-deps

✖ 22 problems (0 errors, 22 warnings)
  0 errors and 1 warning potentially fixable with the `--fix` option.
