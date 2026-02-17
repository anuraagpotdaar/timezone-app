import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TimezoneCard from "@/components/TimezoneCard";

const defaultProps = {
  zone: "America/New_York",
  time: { hour: 14, minute: 30 },
  date: "Mon, Feb 16",
  offset: "UTC-5",
  dst: false,
  index: 0,
  isMobile: false,
  columns: 2 as const,
  onMinuteDelta: jest.fn(),
  onDirectSet: jest.fn(),
  onZoneChange: jest.fn(),
};

function renderCard(overrides = {}) {
  const props = { ...defaultProps, ...overrides };
  return render(<TimezoneCard {...props} />);
}

describe("TimezoneCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("displays city name from timezone data", () => {
    renderCard();
    expect(screen.getByText("New York")).toBeInTheDocument();
  });

  test("displays country name", () => {
    renderCard();
    expect(screen.getByText("United States")).toBeInTheDocument();
  });

  test("displays UTC offset", () => {
    renderCard();
    expect(screen.getByText("UTC-5")).toBeInTheDocument();
  });

  test("displays date", () => {
    renderCard();
    expect(screen.getByText("Mon, Feb 16")).toBeInTheDocument();
  });

  test("shows DST badge when dst is true", () => {
    renderCard({ dst: true });
    expect(screen.getByText("DST")).toBeInTheDocument();
  });

  test("hides DST badge when dst is false", () => {
    renderCard({ dst: false });
    expect(screen.queryByText("DST")).not.toBeInTheDocument();
  });

  test("clicking city button opens timezone picker", async () => {
    renderCard();
    const cityButton = screen.getByText("New York").closest("button")!;
    await userEvent.click(cityButton);

    expect(screen.getByText("Select City")).toBeInTheDocument();
  });

  test("displays time via TimeDisplay child", () => {
    renderCard();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getByText("PM")).toBeInTheDocument();
  });

  test("falls back to zone string when city not in data", () => {
    renderCard({ zone: "Antarctica/McMurdo" });
    expect(screen.getByText("Antarctica/McMurdo")).toBeInTheDocument();
  });
});
