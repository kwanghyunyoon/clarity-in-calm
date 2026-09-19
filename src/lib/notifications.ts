import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const NOTIFICATION_ID_KEY = 'clarity_daily_reminder';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

// expo-notifications weekdays are 1=Sunday .. 7=Saturday.
const WEEKDAYS = [1, 2, 3, 4, 5, 6, 7];

const weekdayId = (weekday: number) => `${NOTIFICATION_ID_KEY}_${weekday}`;

/** Converts a NotificationSettings day (0=Sun..6=Sat) to expo's weekday (1=Sun..7=Sat). */
export const toExpoWeekday = (day: number): number => day + 1;

/**
 * Schedules the reminder as one weekly notification per selected day, so
 * each day can carry different copy. A single DAILY trigger fixes its text
 * at scheduling time and would repeat the same sentence every morning until
 * the user next opened Settings.
 *
 * `days` holds NotificationSettings-style weekdays (0=Sun..6=Sat); an empty
 * list schedules nothing. `bodies` must hold one entry per weekday; shorter
 * lists wrap, indexed by `days`' position so the same day always gets the
 * same rotating body regardless of which other days are selected.
 */
export async function scheduleDailyReminder(
  hour: number,
  minute: number,
  title: string,
  bodies: readonly string[],
  days: readonly number[],
): Promise<void> {
  await cancelDailyReminder();
  if (bodies.length === 0 || days.length === 0) return;

  await Promise.all(
    days.map(day => {
      const weekday = toExpoWeekday(day);
      return Notifications.scheduleNotificationAsync({
        identifier: weekdayId(weekday),
        content: {
          title,
          body: bodies[day % bodies.length],
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday,
          hour,
          minute,
        },
      });
    }),
  );
}

export async function cancelDailyReminder(): Promise<void> {
  await Promise.all([
    // The pre-rotation single DAILY notification, so reminders scheduled by an
    // older build don't survive alongside the weekly ones.
    Notifications.cancelScheduledNotificationAsync(NOTIFICATION_ID_KEY).catch(() => {}),
    ...WEEKDAYS.map(weekday =>
      Notifications.cancelScheduledNotificationAsync(weekdayId(weekday)).catch(() => {}),
    ),
  ]);
}
