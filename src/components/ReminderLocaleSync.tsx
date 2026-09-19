import { useEffect, useRef } from 'react';

import { useLocale } from '@/context/language-context';
import { useSettings } from '@/context/settings-context';
import { useTranslation } from '@/hooks/use-translation';
import { scheduleDailyReminder } from '@/lib/notifications';

/**
 * Keeps the scheduled reminder's copy in the user's current language.
 *
 * Notification text is fixed when the notification is scheduled, not when it
 * fires, so switching language would otherwise leave the queued reminders in
 * the old language until the user happened to re-save the time in Settings.
 * Language can be changed from the floating pill on any screen, so this lives
 * at the root rather than in the Settings screen.
 *
 * Renders nothing.
 */
export function ReminderLocaleSync() {
  const { locale } = useLocale();
  const t = useTranslation();
  const { settings, isLoaded } = useSettings();
  const { enabled, hour, minute, days } = settings.notifications;

  // Skip the first run after load: those reminders were already scheduled in
  // this locale, and rescheduling on every launch is needless work.
  const lastLocale = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !enabled) return;
    if (lastLocale.current === null) {
      lastLocale.current = locale;
      return;
    }
    if (lastLocale.current === locale) return;
    lastLocale.current = locale;

    scheduleDailyReminder(hour, minute, t.dailyContent.reminderTitle, t.dailyContent.reminderBodies, days);
  }, [locale, isLoaded, enabled, hour, minute, days, t]);

  return null;
}
