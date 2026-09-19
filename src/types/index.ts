export type MoodValue = 1 | 2 | 3 | 4 | 5;

export interface JournalEntry {
  id: string;
  date: string;
  mood: MoodValue;
  note: string;
  // New optional fields — undefined on legacy entries
  templateId?: string;
  tags?: string[];
  title?: string;
  isFutureSelf?: boolean;
  unlockAt?: string; // ISO — for future self letters

  // Unified journal/mood entry model (issue #64) — antecedent/trigger,
  // coping effectiveness, sleep, and positive-event tagging per journaling.pdf.
  // All optional/undefined on entries predating this ticket.
  contextTags?: string[]; // antecedent/trigger tags
  copingActions?: string[];
  copingHelped?: boolean; // set once per entry when copingActions is non-empty
  sleepHours?: number;
  sleepQuality?: 1 | 2 | 3; // poor/ok/good
  isPositiveEvent?: boolean; // detail lives in `note`

  // Carried over as-is from EmotionLog, optional, untouched by this ticket —
  // populated once the storage migration (issue #66) is designed.
  emotionId?: string;
  emotionLabel?: string;
  primaryEmotion?: string;
  bodyRegions?: string[];
}

export interface EmotionLog {
  id: string;
  date: string;
  emotionId: string;
  emotionLabel: string;
  primaryEmotion: string;
  intensity: number; // 1-10
  contextTags: string[];
  bodyRegions: string[];
  copingActions: string[];
  note?: string;
}

export type NotificationSettings = {
  enabled: boolean;
  hour: number;
  minute: number;
  days: number[]; // 0=Sun … 6=Sat
};

export type ThemeOverride = 'system' | 'light' | 'dark';

export interface AppSettings {
  notifications: NotificationSettings;
  themeOverride: ThemeOverride;
  /** ISO timestamp of the last successful encrypted backup, or null if none
   * yet. Set the moment a backup completes, regardless of whether any screen
   * currently surfaces it — groundwork for a future reminder feature. */
  lastBackupAt: string | null;
}

export const DEFAULT_SETTINGS: AppSettings = {
  notifications: {
    enabled: false,
    hour: 20,
    minute: 0,
    days: [0, 1, 2, 3, 4, 5, 6],
  },
  lastBackupAt: null,
  themeOverride: 'system',
};
