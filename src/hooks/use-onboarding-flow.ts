/**
 * First-launch onboarding gate: whether the modal should be visible, whether
 * the one-time language step is still pending, and the slide index — plus
 * the AsyncStorage-backed transitions between those states. Kept separate
 * from onboarding-modal.tsx so the state machine can be reasoned about (and
 * one day tested) without dragging in the full render tree.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import type { Locale } from '@/i18n/translations';
import { DataKeySpec } from '@/lib/data-keys';
import { decideQuickLaunch, type QuickLaunchInput } from '@/lib/quick-launch';

const ONBOARDING_KEY    = '@cic:hasSeenOnboarding';
const LANGUAGE_STEP_KEY = '@cic:hasChosenLanguage';

export const ONBOARDING_DATA_KEYS: DataKeySpec[] = [
  { key: ONBOARDING_KEY, backend: 'plain' },
  { key: LANGUAGE_STEP_KEY, backend: 'plain' },
];

interface UseOnboardingFlowArgs {
  isHelpVisible: boolean;
  hideHelp: () => void;
  setLocale: (locale: Locale) => void;
  slideCount: number;
  /** Current route + params, so a Quick Launch can put first-launch Onboarding off. */
  route: Pick<QuickLaunchInput, 'route' | 'params'>;
}

export function useOnboardingFlow({ isHelpVisible, hideHelp, setLocale, slideCount, route }: UseOnboardingFlowArgs) {
  const [firstLaunch,      setFirstLaunch]      = useState(false);
  const [showLanguageStep, setShowLanguageStep] = useState(false);
  const [langSelection,    setLangSelection]    = useState<Locale | null>(null);
  const [page,             setPage]             = useState(0);

  // The Exercise screen clears `autostart` as soon as it acts on it, so the
  // Quick Launch is remembered for the rest of the session: first-launch
  // Onboarding stays put off (not marked seen) until the next normal launch.
  const [quickLaunch, setQuickLaunch] = useState<Pick<QuickLaunchInput, 'route' | 'params'> | null>(null);
  if (quickLaunch === null && decideQuickLaunch(route).isQuickLaunch) setQuickLaunch(route);
  const postponed =
    quickLaunch !== null &&
    decideQuickLaunch({ ...quickLaunch, hasSeenOnboarding: false }).postponeOnboarding;

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [seenOnboarding, chosenLanguage] = await Promise.all([
          AsyncStorage.getItem(ONBOARDING_KEY),
          AsyncStorage.getItem(LANGUAGE_STEP_KEY),
        ]);
        if (!mounted) return;
        if (seenOnboarding !== 'true') {
          setFirstLaunch(true);
          if (chosenLanguage !== 'true') setShowLanguageStep(true);
        }
      } catch {
        if (mounted) setFirstLaunch(true);
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
  if (isHelpVisible) {
    const id = setTimeout(() => setPage(0), 0);
    return () => clearTimeout(id);
  }
}, [isHelpVisible]);

  const visible = (firstLaunch && !postponed) || isHelpVisible;
  const isLast  = page === slideCount - 1;

  const handleNext = async () => {
    if (isLast) {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      setFirstLaunch(false);
      hideHelp();
      setPage(0);
    } else {
      setPage((p) => p + 1);
    }
  };

  const handleClose = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    await AsyncStorage.setItem(LANGUAGE_STEP_KEY, 'true');
    setFirstLaunch(false);
    setShowLanguageStep(false);
    hideHelp();
    setPage(0);
  };

  const handleLanguageContinue = async () => {
    if (!langSelection) return;
    setLocale(langSelection);
    await AsyncStorage.setItem(LANGUAGE_STEP_KEY, 'true');
    setShowLanguageStep(false);
  };

  return {
    visible,
    showLanguageStep,
    langSelection,
    setLangSelection,
    page,
    isLast,
    handleNext,
    handleClose,
    handleLanguageContinue,
  };
}
