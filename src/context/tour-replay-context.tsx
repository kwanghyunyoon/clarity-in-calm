/**
 * TourReplayContext — lets Settings (a different component subtree than the
 * screens that own their tours) request a specific screen's tour restart.
 * One shared bridge for all screen tours, keyed by tourId, rather than a
 * separate context per screen.
 */

import React, { createContext, useCallback, useContext, useRef } from 'react';

interface TourReplayContextType {
  requestRestart: (tourId: string) => void;
  /** Screens call this on focus; returns true (and clears the request) if it was the target. */
  consumeRestart: (tourId: string) => boolean;
}

const TourReplayContext = createContext<TourReplayContextType>({
  requestRestart: () => {},
  consumeRestart: () => false,
});

export function TourReplayProvider({ children }: { children: React.ReactNode }) {
  // Imperative pull (consumeRestart reads on focus), not reactive state — the
  // navigation triggered by requestRestart's caller is what causes the
  // target screen to re-check, so no re-render needs to fan out from here.
  const pendingRef = useRef<string | null>(null);

  const requestRestart = useCallback((tourId: string) => {
    pendingRef.current = tourId;
  }, []);

  const consumeRestart = useCallback((tourId: string) => {
    if (pendingRef.current !== tourId) return false;
    pendingRef.current = null;
    return true;
  }, []);

  return (
    <TourReplayContext.Provider value={{ requestRestart, consumeRestart }}>
      {children}
    </TourReplayContext.Provider>
  );
}

export function useTourReplay() {
  return useContext(TourReplayContext);
}
