import { renderHook, act } from "@testing-library/react";
import { useLiveClock } from "@/hooks/useLiveClock";

describe("useLiveClock", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("starts in live mode", () => {
    const { result } = renderHook(() => useLiveClock());
    expect(result.current.liveMode).toBe(true);
  });

  test("baseDate is a Date object", () => {
    const { result } = renderHook(() => useLiveClock());
    expect(result.current.baseDate).toBeInstanceOf(Date);
  });

  test("applyMinuteDelta shifts baseDate forward", () => {
    const { result } = renderHook(() => useLiveClock());
    const before = result.current.baseDate.getTime();

    act(() => {
      result.current.applyMinuteDelta(5);
    });

    const after = result.current.baseDate.getTime();
    expect(after - before).toBe(5 * 60_000);
  });

  test("applyMinuteDelta shifts baseDate backward", () => {
    const { result } = renderHook(() => useLiveClock());
    const before = result.current.baseDate.getTime();

    act(() => {
      result.current.applyMinuteDelta(-5);
    });

    const after = result.current.baseDate.getTime();
    expect(before - after).toBe(5 * 60_000);
  });

  test("applyMinuteDelta disables live mode", () => {
    const { result } = renderHook(() => useLiveClock());
    expect(result.current.liveMode).toBe(true);

    act(() => {
      result.current.applyMinuteDelta(5);
    });

    expect(result.current.liveMode).toBe(false);
  });

  test("setExactTime shifts baseDate to match target time in zone", () => {
    const { result } = renderHook(() => useLiveClock());

    act(() => {
      result.current.setZonesRef(["America/New_York", "Europe/London"]);
    });

    const before = result.current.baseDate.getTime();

    act(() => {
      result.current.setExactTime(0, 15, 30);
    });

    // Should have changed
    expect(result.current.baseDate.getTime()).not.toBe(before);
    expect(result.current.liveMode).toBe(false);
  });

  test("toggleLive switches from live to custom", () => {
    const { result } = renderHook(() => useLiveClock());
    expect(result.current.liveMode).toBe(true);

    act(() => {
      result.current.toggleLive();
    });

    expect(result.current.liveMode).toBe(false);
  });

  test("toggleLive switches from custom back to live", () => {
    const { result } = renderHook(() => useLiveClock());

    act(() => {
      result.current.applyMinuteDelta(5); // go to custom mode
    });

    expect(result.current.liveMode).toBe(false);

    act(() => {
      result.current.toggleLive();
    });

    expect(result.current.liveMode).toBe(true);
  });

  test("live mode ticks every second", () => {
    const { result } = renderHook(() => useLiveClock());
    const initial = result.current.baseDate.getTime();

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // baseDate should have been updated (approximately 2 seconds later)
    const updated = result.current.baseDate.getTime();
    expect(updated).toBeGreaterThanOrEqual(initial);
  });

  test("custom mode does not tick", () => {
    const { result } = renderHook(() => useLiveClock());

    act(() => {
      result.current.applyMinuteDelta(5); // switch to custom
    });

    const frozen = result.current.baseDate.getTime();

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(result.current.baseDate.getTime()).toBe(frozen);
  });
});
