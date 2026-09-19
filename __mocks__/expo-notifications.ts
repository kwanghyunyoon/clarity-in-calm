/**
 * Jest mock for expo-notifications — records scheduled/cancelled
 * notifications in-memory instead of touching the OS notification center.
 */
type ScheduledCall = {
  identifier: string;
  content: { title: string; body: string };
  trigger: { type: string; weekday: number; hour: number; minute: number };
};

export const scheduled: ScheduledCall[] = [];
export const cancelled: string[] = [];

export const SchedulableTriggerInputTypes = { WEEKLY: 'weekly' } as const;

export function setNotificationHandler(): void {}

export async function getPermissionsAsync(): Promise<{ status: string }> {
  return { status: 'granted' };
}

export async function requestPermissionsAsync(): Promise<{ status: string }> {
  return { status: 'granted' };
}

export async function scheduleNotificationAsync(input: ScheduledCall): Promise<string> {
  scheduled.push(input);
  return input.identifier;
}

export async function cancelScheduledNotificationAsync(identifier: string): Promise<void> {
  cancelled.push(identifier);
}

export function __reset(): void {
  scheduled.length = 0;
  cancelled.length = 0;
}
