/**
 * Tests for the tour spotlight's settle-detection loop. Ported from dreami
 * (issue #91): a fixed 350ms timeout took a single one-shot measurement that
 * was stale whenever a step's anchor was still settling into position,
 * misaligning the highlight box.
 */

import { measureWhenSettled, type MeasuredBox } from '../src/utils/measureWhenSettled';

function makeFrameQueue(): { requestFrame: (cb: () => void) => void; flush: () => void } {
  let queued: (() => void) | null = null;
  return {
    requestFrame: (cb) => {
      queued = cb;
    },
    flush: () => {
      // Run frames one at a time until nothing new gets queued in a pass.
      let guard = 0;
      while (queued && guard < 1000) {
        const cb = queued;
        queued = null;
        cb();
        guard += 1;
      }
    },
  };
}

describe('measureWhenSettled', () => {
  it('settles once consecutive measurements stop changing', () => {
    const sequence: MeasuredBox[] = [
      { x: 0, y: 100, width: 300, height: 80 },
      { x: 0, y: 40, width: 300, height: 80 },
      { x: 0, y: 12, width: 300, height: 80 },
      { x: 0, y: 12, width: 300, height: 80 },
      { x: 0, y: 12, width: 300, height: 80 },
    ];
    let call = 0;
    const measure = (cb: (box: MeasuredBox) => void) => {
      cb(sequence[Math.min(call, sequence.length - 1)]);
      call += 1;
    };

    const { requestFrame, flush } = makeFrameQueue();
    const onSettled = jest.fn();

    measureWhenSettled(measure, onSettled, { requiredStableFrames: 3, requestFrame });
    flush();

    expect(onSettled).toHaveBeenCalledTimes(1);
    expect(onSettled).toHaveBeenCalledWith({ x: 0, y: 12, width: 300, height: 80 });
    // Three identical readings (y: 12) plus the two changing ones before them.
    expect(call).toBe(6);
  });

  it('settles immediately when the first measurement is already stable', () => {
    const box: MeasuredBox = { x: 10, y: 20, width: 100, height: 50 };
    const measure = (cb: (box: MeasuredBox) => void) => cb(box);

    const { requestFrame, flush } = makeFrameQueue();
    const onSettled = jest.fn();

    measureWhenSettled(measure, onSettled, { requiredStableFrames: 3, requestFrame });
    flush();

    expect(onSettled).toHaveBeenCalledTimes(1);
    expect(onSettled).toHaveBeenCalledWith(box);
  });

  it('gives up after maxFrames if the measurement never stabilizes', () => {
    let call = 0;
    const measure = (cb: (box: MeasuredBox) => void) => {
      call += 1;
      cb({ x: 0, y: call, width: 100, height: 50 });
    };

    const { requestFrame, flush } = makeFrameQueue();
    const onSettled = jest.fn();

    measureWhenSettled(measure, onSettled, { requiredStableFrames: 3, maxFrames: 10, requestFrame });
    flush();

    expect(onSettled).toHaveBeenCalledTimes(1);
    expect(call).toBe(10);
    expect(onSettled).toHaveBeenCalledWith({ x: 0, y: 10, width: 100, height: 50 });
  });

  it('stops measuring once cancelled', () => {
    const measure = jest.fn((cb: (box: MeasuredBox) => void) =>
      cb({ x: 0, y: 0, width: 100, height: 50 }),
    );
    const { requestFrame, flush } = makeFrameQueue();
    const onSettled = jest.fn();

    const cancel = measureWhenSettled(measure, onSettled, { requiredStableFrames: 3, requestFrame });
    cancel();
    flush();

    expect(onSettled).not.toHaveBeenCalled();
  });
});
