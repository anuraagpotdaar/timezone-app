import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TimeDisplay from "@/components/TimeDisplay";

const defaultProps = {
  hour: 14, // 2 PM
  minute: 30,
  onMinuteDelta: jest.fn(),
  onDirectSet: jest.fn(),
  isMobile: false,
  columns: 2 as const,
};

function renderTimeDisplay(overrides = {}) {
  const props = { ...defaultProps, ...overrides };
  return render(<TimeDisplay {...props} />);
}

describe("TimeDisplay", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("displays time in 12-hour format", () => {
    renderTimeDisplay();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getByText("PM")).toBeInTheDocument();
  });

  test("displays midnight as 12 AM", () => {
    renderTimeDisplay({ hour: 0, minute: 0 });
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("00")).toBeInTheDocument();
    expect(screen.getByText("AM")).toBeInTheDocument();
  });

  test("displays noon as 12 PM", () => {
    renderTimeDisplay({ hour: 12, minute: 0 });
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("PM")).toBeInTheDocument();
  });

  test("pads single-digit minutes with zero", () => {
    renderTimeDisplay({ minute: 5 });
    expect(screen.getByText("05")).toBeInTheDocument();
  });

  test("displays colon separator", () => {
    renderTimeDisplay();
    expect(screen.getByText(":")).toBeInTheDocument();
  });

  test("hour and minute spans have button role for accessibility", () => {
    renderTimeDisplay();
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  test("clicking hour digit enters edit mode", async () => {
    renderTimeDisplay();
    const hourButton = screen.getByText("2");
    await userEvent.click(hourButton);

    // Should now show an input
    const input = screen.getByDisplayValue("");
    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe("INPUT");
  });

  test("clicking minute digit enters edit mode", async () => {
    renderTimeDisplay();
    const minButton = screen.getByText("30");
    await userEvent.click(minButton);

    const input = screen.getByDisplayValue("");
    expect(input).toBeInTheDocument();
  });

  test("wheel scroll up calls onMinuteDelta with +5", () => {
    renderTimeDisplay();
    const container = screen.getByTitle("Scroll to change time · Click digits to type");

    fireEvent.wheel(container, { deltaY: -100 });
    expect(defaultProps.onMinuteDelta).toHaveBeenCalledWith(5);
  });

  test("wheel scroll down calls onMinuteDelta with -5", () => {
    renderTimeDisplay();
    const container = screen.getByTitle("Scroll to change time · Click digits to type");

    fireEvent.wheel(container, { deltaY: 100 });
    expect(defaultProps.onMinuteDelta).toHaveBeenCalledWith(-5);
  });
});
