import React from 'react';

import { SectionHeader } from '@/components/ui/SectionHeader';
import { SettingsGroup } from '@/components/ui/SettingsGroup';
import { SettingsRow } from '@/components/ui/SettingsRow';
import { useTranslation } from '@/hooks/use-translation';

// Auth is disabled (see @/lib/auth-flag) — this variant renders no sign-in
// entry point and imports nothing from @/lib/supabase or the auth store, so
// neither is ever required by the always-mounted Settings tab.
export function AccountSection() {
  const ta = useTranslation().settingsScreen.account;

  return (
    <>
      <SectionHeader label={ta.header} />
      <SettingsGroup>
        <SettingsRow label={ta.header} value={ta.deviceLocal} />
      </SettingsGroup>
    </>
  );
}
