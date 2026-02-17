import { renderHook, act } from "@testing-library/react";
import { useResponsive } from "@/hooks/useResponsive";

describe("useResponsive", () => {
  const originalInnerWidth = window.innerWidth;

  afterEach(() => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: originalInnerWidth,
    });
  });

  test("returns isMobile false for wide viewport", () => {
    Object.defineProperty(window, "innerWidth", { writable: true, value: 1024 });
    const { result } = renderHook(() => useResponsive());
    expect(result.current.isMobile).toBe(false);
  });

  test("returns isMobile true for narrow viewport", () => {
    Object.defineProperty(window, "innerWidth", { writable: true, value: 400 });
    const { result } = renderHook(() => useResponsive());
    expect(result.current.isMobile).toBe(true);
  });

  test("breakpoint is at 700px", () => {
    Object.defineProperty(window, "innerWidth", { writable: true, value: 700 });
    const { result } = renderHook(() => useResponsive());
    expect(result.current.isMobile).toBe(false);

    Object.defineProperty(window, "innerWidth", { writable: true, value: 699 });
    const { result: result2 } = renderHook(() => useResponsive());
    expect(result2.current.isMobile).toBe(true);
  });

  test("responds to resize events", () => {
    Object.defineProperty(window, "innerWidth", { writable: true, value: 1024 });
    const { result } = renderHook(() => useResponsive());
    expect(result.current.isMobile).toBe(false);

    act(() => {
      Object.defineProperty(window, "innerWidth", { writable: true, value: 400 });
      window.dispatchEvent(new Event("resize"));
    });

    expect(result.current.isMobile).toBe(true);
  });
});
