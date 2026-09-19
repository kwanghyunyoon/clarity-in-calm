/**
 * TourOverlayContext — lets a screen's <TourOverlay> render into a single
 * root-level host (TourOverlayHost, mounted in _layout.tsx) instead of its
 * own <Modal>.
 *
 * Why: RN's <Modal> opens a separate native Android window, whose
 * coordinate origin doesn't line up with the window the screen's content
 * (and its measureInWindow() anchors) live in. That caused the spotlight
 * box to render offset from the real anchor position. Rendering the
 * overlay as a plain absolutely-positioned view in the same window as the
 * screen — the same trick PrivacyShield uses in _layout.tsx — keeps both
 * coordinate spaces identical.
 */
import React, { createContext, useContext, useState } from 'react';

import type { TourOverlayViewProps } from '@/components/tour/TourOverlay';

interface TourOverlayContextType {
  overlay: TourOverlayViewProps | null;
  setOverlay: (overlay: TourOverlayViewProps | null) => void;
}

const TourOverlayContext = createContext<TourOverlayContextType>({
  overlay: null,
  setOverlay: () => {},
});

export function TourOverlayProvider({ children }: { children: React.ReactNode }) {
  const [overlay, setOverlay] = useState<TourOverlayViewProps | null>(null);

  return (
    <TourOverlayContext.Provider value={{ overlay, setOverlay }}>
      {children}
    </TourOverlayContext.Provider>
  );
}

export function useTourOverlayContext() {
  return useContext(TourOverlayContext);
}
