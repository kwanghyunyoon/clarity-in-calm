/**
 * Every storage key the app writes, gathered from the modules that own
 * them, for the delete-all flow in settings.tsx and the backup flow in
 * backup.tsx. Adding a new persisted key means adding it to its owning
 * module's DataKeySpec[] export and listing that export here — neither
 * screen ever needs to change.
 */
import { EMOTION_DATA_KEYS } from '@/context/emotion-context';
import { SETTINGS_DATA_KEYS } from '@/context/settings-context';
import { WELLNESS_DATA_KEYS } from '@/context/wellness-context';
import { ONBOARDING_DATA_KEYS } from '@/hooks/use-onboarding-flow';
import { DataKeySpec } from './data-keys';

export const ALL_DATA_KEYS: DataKeySpec[] = [
  ...WELLNESS_DATA_KEYS,
  ...EMOTION_DATA_KEYS,
  ...SETTINGS_DATA_KEYS,
  ...ONBOARDING_DATA_KEYS,
];
