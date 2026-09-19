import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Platform } from 'react-native';

import { SectionHeader } from '@/components/ui/SectionHeader';
import { SettingsGroup } from '@/components/ui/SettingsGroup';
import { SettingsRow } from '@/components/ui/SettingsRow';
import { useTranslation } from '@/hooks/use-translation';

// Play Store URLs derived from android.package in each app's app.config.js
const DREAMI_PLAY  = 'https://play.google.com/store/apps/details?id=com.dreami.app';
const CLARITY_PLAY = 'https://play.google.com/store/apps/details?id=com.yoonk478.clarityai';

// App Store URLs — uses bundleIdentifier-based universal links.
// Replace with numeric App Store IDs once published (e.g. /id123456789).
const DREAMI_IOS   = 'https://apps.apple.com/app/dreami/id6744012543';
const CLARITY_IOS  = 'https://apps.apple.com/app/clarityai/id6745876543';

function storeUrl(android: string, ios: string): string {
  return Platform.OS === 'ios' ? ios : android;
}

export function MoreFromUsSection() {
  const ts = useTranslation().settingsScreen;

  function openDreami() {
    void WebBrowser.openBrowserAsync(storeUrl(DREAMI_PLAY, DREAMI_IOS));
  }

  function openClarityAI() {
    void WebBrowser.openBrowserAsync(storeUrl(CLARITY_PLAY, CLARITY_IOS));
  }

  return (
    <>
      <SectionHeader label={ts.moreFromUs.header} />
      <SettingsGroup>
        <SettingsRow
          label={ts.moreFromUs.dreamiName}
          value={ts.moreFromUs.dreamiTagline}
          onPress={openDreami}
        />
        <SettingsRow
          label={ts.moreFromUs.clarityAIName}
          value={ts.moreFromUs.clarityAITagline}
          onPress={openClarityAI}
        />
      </SettingsGroup>
    </>
  );
}
