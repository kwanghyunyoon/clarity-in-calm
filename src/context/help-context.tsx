/**
 * HelpContext — lets any screen trigger the onboarding guide.
 * The OnboardingModal listens to `isHelpVisible`; screens call `showHelp()`.
 */

import React, { createContext, useCallback, useContext, useState } from 'react';

interface HelpContextType {
  isHelpVisible: boolean;
  showHelp: () => void;
  hideHelp: () => void;
}

const HelpContext = createContext<HelpContextType>({
  isHelpVisible: false,
  showHelp:  () => {},
  hideHelp: () => {},
});

export function HelpProvider({ children }: { children: React.ReactNode }) {
  const [isHelpVisible, setIsHelpVisible] = useState(false);
  const showHelp = useCallback(() => setIsHelpVisible(true),  []);
  const hideHelp = useCallback(() => setIsHelpVisible(false), []);
  return (
    <HelpContext.Provider value={{ isHelpVisible, showHelp, hideHelp }}>
      {children}
    </HelpContext.Provider>
  );
}

export function useHelp() {
  return useContext(HelpContext);
}
