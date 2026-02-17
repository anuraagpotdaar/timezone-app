import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "@/components/Header";

const defaultProps = {
  liveMode: true,
  columns: 2 as const,
  isMobile: false,
  onToggleLive: jest.fn(),
  onSetColumns: jest.fn(),
};

function renderHeader(overrides = {}) {
  const props = { ...defaultProps, ...overrides };
  return render(<Header {...props} />);
}

describe("Header", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("displays app title", () => {
    renderHeader();
    expect(screen.getByText("Time Zones")).toBeInTheDocument();
  });

  test("shows 'Live' when liveMode is true", () => {
    renderHeader({ liveMode: true });
    expect(screen.getByText("Live")).toBeInTheDocument();
  });

  test("shows 'Custom' when liveMode is false", () => {
    renderHeader({ liveMode: false });
    expect(screen.getByText("Custom")).toBeInTheDocument();
  });

  test("clicking live button calls onToggleLive", async () => {
    renderHeader();
    const liveButton = screen.getByText("Live").closest("button")!;
    await userEvent.click(liveButton);

    expect(defaultProps.onToggleLive).toHaveBeenCalledTimes(1);
  });

  test("displays column count buttons 2, 3, 4", () => {
    renderHeader();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
  });

  test("clicking column button calls onSetColumns with correct value", async () => {
    renderHeader();

    await userEvent.click(screen.getByText("3"));
    expect(defaultProps.onSetColumns).toHaveBeenCalledWith(3);

    await userEvent.click(screen.getByText("4"));
    expect(defaultProps.onSetColumns).toHaveBeenCalledWith(4);
  });

  test("shows subtitle on desktop", () => {
    renderHeader({ isMobile: false });
    expect(screen.getByText(/Scroll to adjust/)).toBeInTheDocument();
  });

  test("hides subtitle on mobile", () => {
    renderHeader({ isMobile: true });
    expect(screen.queryByText(/Scroll to adjust/)).not.toBeInTheDocument();
  });
});
