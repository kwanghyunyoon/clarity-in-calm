import type { SpotlightRect } from '@/components/tour/TourOverlay';

export type MeasuredBox = SpotlightRect;

export interface SettleOptions {
  /** Consecutive identical measurements required before treating the layout as settled. */
  requiredStableFrames?: number;
  /** Hard cap on measurement frames, in case layout never stabilizes (e.g. a continuous animation). */
  maxFrames?: number;
  requestFrame?: (callback: () => void) => void;
}

const boxesEqual = (a: MeasuredBox, b: MeasuredBox): boolean =>
  a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;

/**
 * Repeatedly measures via `measure` (frame by frame) until the result stops
 * changing, then calls `onSettled` with the stable box. Exists because a
 * scroll/layout operation's true completion time can't be predicted with a
 * fixed delay — this waits for the actual signal (an unchanging measurement)
 * instead of guessing a duration. Ported from dreami (issue #91): a fixed
 * setTimeout before measuring a tour step's anchor was stale whenever the
 * anchor's position was still settling (e.g. right after a sibling
 * ScrollView's content size resolves), misaligning the spotlight box.
 *
 * Returns a cancel function to stop the loop (e.g. on unmount or step change).
 */
export function measureWhenSettled(
  measure: (callback: (box: MeasuredBox) => void) => void,
  onSettled: (box: MeasuredBox) => void,
  options: SettleOptions = {},
): () => void {
  const {
    requiredStableFrames = 3,
    maxFrames = 60,
    requestFrame = requestAnimationFrame,
  } = options;

  let cancelled = false;
  let last: MeasuredBox | null = null;
  let stableCount = 0;
  let frame = 0;

  const tick = (): void => {
    if (cancelled) return;
    measure((box) => {
      if (cancelled) return;

      if (last && boxesEqual(box, last)) {
        stableCount += 1;
      } else {
        stableCount = 0;
      }
      last = box;
      frame += 1;

      if (stableCount >= requiredStableFrames || frame >= maxFrames) {
        onSettled(box);
      } else {
        requestFrame(tick);
      }
    });
  };

  requestFrame(tick);

  return () => {
    cancelled = true;
  };
}
