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
}

export const DEFAULT_SETTINGS: AppSettings = {
  notifications: {
    enabled: false,
    hour: 20,
    minute: 0,
    days: [0, 1, 2, 3, 4, 5, 6],
  },
  themeOverride: 'system',
};
