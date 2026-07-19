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
}

export function useOnboardingFlow({ isHelpVisible, hideHelp, setLocale, slideCount }: UseOnboardingFlowArgs) {
  const [firstLaunch,      setFirstLaunch]      = useState(false);
  const [showLanguageStep, setShowLanguageStep] = useState(false);
  const [langSelection,    setLangSelection]    = useState<Locale | null>(null);
  const [page,             setPage]             = useState(0);

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
    if (isHelpVisible) setPage(0);
  }, [isHelpVisible]);

  const visible = firstLaunch || isHelpVisible;
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
