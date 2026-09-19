/**
 * scheduleDailyReminder now takes a `days` list (0=Sun..6=Sat, matching
 * NotificationSettings.days) instead of always scheduling all seven —
 * groundwork for a lighter-than-daily reminder cadence (#71).
 */
import * as Notifications from 'expo-notifications';
import { cancelDailyReminder, scheduleDailyReminder, toExpoWeekday } from '@/lib/notifications';

const mock = Notifications as unknown as {
  scheduled: { identifier: string; trigger: { weekday: number } }[];
  cancelled: string[];
  __reset: () => void;
};

beforeEach(() => {
  mock.__reset();
});

describe('toExpoWeekday', () => {
  it('maps 0=Sun..6=Sat to expo weekday 1=Sun..7=Sat', () => {
    expect(toExpoWeekday(0)).toBe(1);
    expect(toExpoWeekday(6)).toBe(7);
  });
});

describe('scheduleDailyReminder', () => {
  it('schedules only the selected days', async () => {
    // Mon(1)/Wed(3)/Fri(5)/Sat(6)
    await scheduleDailyReminder(20, 0, 'Title', ['a', 'b', 'c', 'd', 'e', 'f', 'g'], [1, 3, 5, 6]);

    expect(mock.scheduled).toHaveLength(4);
    const weekdays = mock.scheduled.map(s => s.trigger.weekday).sort((a, b) => a - b);
    expect(weekdays).toEqual([2, 4, 6, 7]);
  });

  it('schedules nothing for an empty day list', async () => {
    await scheduleDailyReminder(20, 0, 'Title', ['a'], []);
    expect(mock.scheduled).toHaveLength(0);
  });

  it('cancels any previously scheduled days before rescheduling', async () => {
    await scheduleDailyReminder(20, 0, 'Title', ['a'], [0, 1, 2, 3, 4, 5, 6]);
    mock.__reset();

    await scheduleDailyReminder(9, 0, 'Title', ['a'], [1]);
    expect(mock.scheduled).toHaveLength(1);
  });
});

describe('cancelDailyReminder', () => {
  it('cancels all seven weekday slots plus the legacy single id', async () => {
    await cancelDailyReminder();
    expect(mock.cancelled.length).toBeGreaterThanOrEqual(7);
  });
});
