/**
 * Generic per-screen coach-mark tour state machine — owns step index,
 * visibility, and next/skip/complete/restart, with no layout or measurement
 * logic (that lives in the screen + TourOverlay). One hook shared by every
 * screen tour (journal/emotions/insights) instead of a copy per screen.
 *
 * Auto-shows once per `storageKey` (an AsyncStorage "seen" flag), can be
 * skipped at any step, and can be replayed later via TourReplayContext
 * (Settings lives in a different component subtree than the tour-owning
 * screen, so it requests a restart by tourId rather than calling restart()
 * directly).
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { useTourReplay } from '@/context/tour-replay-context';
import { DataKeySpec } from '@/lib/data-keys';

export interface TourStep {
  id: string;
  index: number;
  isLast: boolean;
}

interface UseScreenTourArgs {
  /** Matches the id Settings passes to requestRestart(tourId). */
  tourId: string;
  /** AsyncStorage key backing the one-time "seen" flag. */
  storageKey: string;
  stepIds: readonly string[];
  /** Gate auto-show past "unseen" — e.g. Insights waits until there's data to spotlight. */
  ready?: boolean;
}

export function tourDataKey(storageKey: string): DataKeySpec {
  return { key: storageKey, backend: 'plain' };
}

export function useScreenTour({ tourId, storageKey, stepIds, ready = true }: UseScreenTourArgs) {
  const [seen, setSeen] = useState<boolean | null>(null);
  // Only for an explicit restart (Settings replay) — first-time auto-show is
  // derived below from `seen`/`ready` directly, so it needs no effect of its
  // own and can't cause the cascading-render pattern an effect-driven
  // "become visible" setState would.
  const [forceOpen, setForceOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const { consumeRestart } = useTourReplay();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const v = await AsyncStorage.getItem(storageKey);
        if (mounted) setSeen(v === 'true');
      } catch {
        if (mounted) setSeen(true);
      }
    })();
    return () => { mounted = false; };
  }, [storageKey]);

  useFocusEffect(
    useCallback(() => {
      if (consumeRestart(tourId)) {
        setIndex(0);
        setForceOpen(true);
      }
    }, [tourId, consumeRestart]),
  );

  const visible = forceOpen || (seen === false && ready);
  const totalSteps = stepIds.length;
  const isLast = index === totalSteps - 1;
  const step: TourStep = { id: stepIds[index], index, isLast };

  const complete = useCallback(() => {
    setForceOpen(false);
    setIndex(0);
    setSeen(true);
    AsyncStorage.setItem(storageKey, 'true').catch(() => {});
  }, [storageKey]);

  const next = useCallback(() => {
    setIndex(i => (i >= totalSteps - 1 ? i : i + 1));
  }, [totalSteps]);

  const skip = complete;

  const restart = useCallback(() => {
    setIndex(0);
    setForceOpen(true);
  }, []);

  return {
    visible,
    step,
    totalSteps,
    next: isLast ? complete : next,
    skip,
    complete,
    restart,
  };
}
