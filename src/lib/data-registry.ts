/**
 * Every storage key the app writes, gathered from the modules that own
 * them, for the delete-all flow in settings.tsx and the backup flow in
 * backup.tsx. Adding a new persisted key means adding it to its owning
 * module's DataKeySpec[] export and listing that export here — neither
 * screen ever needs to change.
 */
import { SETTINGS_DATA_KEYS } from '@/context/settings-context';
import { WELLNESS_DATA_KEYS } from '@/context/wellness-context';
import { ONBOARDING_DATA_KEYS } from '@/hooks/use-onboarding-flow';
import { tourDataKey } from '@/hooks/use-screen-tour';
import { EMOTIONS_TOUR, INSIGHTS_TOUR, JOURNAL_TOUR } from '@/constants/tour-keys';
import { DataKeySpec } from './data-keys';

// wellness_emotions_v1 (formerly EMOTION_DATA_KEYS, owned by the now-removed
// EmotionProvider) is covered via WELLNESS_DATA_KEYS since #70 retired it as
// a write target and folded its lifecycle into WellnessProvider.
export const ALL_DATA_KEYS: DataKeySpec[] = [
  ...WELLNESS_DATA_KEYS,
  ...SETTINGS_DATA_KEYS,
  ...ONBOARDING_DATA_KEYS,
  tourDataKey(JOURNAL_TOUR.storageKey),
  tourDataKey(EMOTIONS_TOUR.storageKey),
  tourDataKey(INSIGHTS_TOUR.storageKey),
];
