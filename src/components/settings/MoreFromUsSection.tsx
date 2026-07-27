import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Platform } from 'react-native';

import { SettingsGroup } from '@/components/ui/SettingsGroup';
import { SettingsRow } from '@/components/ui/SettingsRow';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useTranslation } from '@/hooks/use-translation';

const DREAMI_PLAY  = 'https://play.google.com/store/apps/details?id=com.dreami.app';
const DREAMI_IOS   = 'https://apps.apple.com/app/dreami/id6744012543';
const CLARITY_PLAY = 'https://play.google.com/store/apps/details?id=com.yoonk478.clarityai';
const CLARITY_IOS  = 'https://apps.apple.com/app/clarityai/id6745876543';

function storeUrl(android: string, ios: string) {
  return Platform.OS === 'ios' ? ios : android;
}

export function MoreFromUsSection() {
  const t = useTranslation();
  const ts = t.settingsScreen;

  function openDreami() {
    WebBrowser.openBrowserAsync(storeUrl(DREAMI_PLAY, DREAMI_IOS));
  }

  function openClarityAI() {
    WebBrowser.openBrowserAsync(storeUrl(CLARITY_PLAY, CLARITY_IOS));
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
