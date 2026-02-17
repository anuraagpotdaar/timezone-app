import React from "react";
import { render } from "@testing-library/react";
import SkyScene from "@/components/SkyScene";

describe("SkyScene", () => {
  test("renders without crashing for daytime", () => {
    const { container } = render(<SkyScene hour={12} minute={0} />);
    expect(container.firstChild).toBeTruthy();
  });

  test("renders without crashing for nighttime", () => {
    const { container } = render(<SkyScene hour={2} minute={0} />);
    expect(container.firstChild).toBeTruthy();
  });

  test("renders without crashing for dawn", () => {
    const { container } = render(<SkyScene hour={6} minute={30} />);
    expect(container.firstChild).toBeTruthy();
  });

  test("renders without crashing for dusk", () => {
    const { container } = render(<SkyScene hour={18} minute={0} />);
    expect(container.firstChild).toBeTruthy();
  });

  test("renders stars (multiple small elements)", () => {
    const { container } = render(<SkyScene hour={2} minute={0} />);
    // Stars are small divs with border-radius 50%
    const roundElements = container.querySelectorAll('[style*="border-radius: 50%"]');
    // At least moon + sun + stars
    expect(roundElements.length).toBeGreaterThan(5);
  });

  test("handles edge case hour 0 minute 0", () => {
    const { container } = render(<SkyScene hour={0} minute={0} />);
    expect(container.firstChild).toBeTruthy();
  });

  test("handles edge case hour 23 minute 59", () => {
    const { container } = render(<SkyScene hour={23} minute={59} />);
    expect(container.firstChild).toBeTruthy();
  });
});
