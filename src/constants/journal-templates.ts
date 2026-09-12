import { Ionicons } from '@expo/vector-icons';
import type React from 'react';

export const TEMPLATE_LABEL_KEYS = {
  free: 'templateFreeWrite',
  gratitude: 'templateGratitude',
  reflection: 'templateReflection',
  cbt: 'templateCBT',
  'weekly-review': 'templateWeeklyReview',
  'future-self': 'templateFutureSelf',
} as const;

export type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

// Ionicons name for each journal template (replaces the emoji in JOURNAL_TEMPLATES)
export const TEMPLATE_ICONS: Record<string, IoniconsName> = {
  free:          'pencil-outline',
  gratitude:     'heart-outline',
  reflection:    'sunny-outline',
  cbt:           'search-outline',
  'weekly-review': 'calendar-outline',
  'future-self': 'mail-outline',
};
