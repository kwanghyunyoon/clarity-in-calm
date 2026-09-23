/**
 * Quick Launch decision module — every Quick Launch rule from CONTEXT.md
 * ("Exercise, Quick Launch, Launch point") lives here; the splash, Onboarding
 * and the Exercise screens only act on its output. Pure, no React Native.
 *
 * Link contract shared by every Launch point:
 *   clarityincalm://breathe?autostart=1   clarityincalm://ground?autostart=1
 * which expo-router surfaces as pathname `/breathe` | `/ground` + `autostart: '1'`.
 */

export type ExerciseId = 'breathe' | 'ground';
export type ExerciseState = 'not-started' | 'in-progress' | 'finished';

/** The query param that marks a navigation as a Quick Launch. */
export const AUTOSTART_PARAM = 'autostart';

export interface QuickLaunchInput {
  /** Current pathname, e.g. from expo-router's usePathname(). */
  route: string | null | undefined;
  /** Current search params, e.g. from useLocalSearchParams(). */
  params: Record<string, string | string[] | undefined>;
  /** The target Exercise's state; unknown is treated as never begun. */
  exerciseState?: ExerciseState;
  /** Whether Onboarding has been seen; unknown never puts it off. */
  hasSeenOnboarding?: boolean;
}

export type QuickLaunchDecision =
  | { isQuickLaunch: false; skipSplash: false; postponeOnboarding: false }
  | {
      isQuickLaunch: true;
      exercise: ExerciseId;
      /** Resume a run already in progress; otherwise start it over from the top. */
      action: 'resume' | 'restart';
      /** Show the "get ready" lead-in before the first inhale (Breathe only). */
      leadIn: boolean;
      skipSplash: true;
      /** Hold Onboarding back this session without marking it seen. */
      postponeOnboarding: boolean;
    };

const NORMAL: QuickLaunchDecision = { isQuickLaunch: false, skipSplash: false, postponeOnboarding: false };

function targetOf(route: string | null | undefined): ExerciseId | null {
  const name = (route ?? '').replace(/^\//, '');
  return name === 'breathe' || name === 'ground' ? name : null;
}

export function decideQuickLaunch({
  route,
  params,
  exerciseState = 'not-started',
  hasSeenOnboarding,
}: QuickLaunchInput): QuickLaunchDecision {
  const exercise = targetOf(route);
  if (!exercise || params[AUTOSTART_PARAM] !== '1') return NORMAL;

  const action = exerciseState === 'in-progress' ? 'resume' : 'restart';
  return {
    isQuickLaunch: true,
    exercise,
    action,
    leadIn: exercise === 'breathe' && action === 'restart',
    skipSplash: true,
    postponeOnboarding: hasSeenOnboarding === false,
  };
}
