import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TimezonePicker from "@/components/TimezonePicker";

const defaultProps = {
  isOpen: true,
  onClose: jest.fn(),
  onSelect: jest.fn(),
  currentZone: "America/New_York",
  isMobile: false,
};

function renderPicker(overrides = {}) {
  const props = { ...defaultProps, ...overrides };
  return render(<TimezonePicker {...props} />);
}

describe("TimezonePicker", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders nothing when isOpen is false", () => {
    renderPicker({ isOpen: false });
    expect(screen.queryByText("Select City")).not.toBeInTheDocument();
  });

  test("renders modal when isOpen is true", () => {
    renderPicker();
    expect(screen.getByText("Select City")).toBeInTheDocument();
  });

  test("shows search input", () => {
    renderPicker();
    expect(screen.getByPlaceholderText("Search city or country...")).toBeInTheDocument();
  });

  test("filters cities by search query", async () => {
    renderPicker();
    const input = screen.getByPlaceholderText("Search city or country...");
    await userEvent.type(input, "Tokyo");

    expect(screen.getByText("Tokyo")).toBeInTheDocument();
    expect(screen.queryByText("London")).not.toBeInTheDocument();
  });

  test("filters cities by country name", async () => {
    renderPicker();
    const input = screen.getByPlaceholderText("Search city or country...");
    await userEvent.type(input, "Japan");

    expect(screen.getByText("Tokyo")).toBeInTheDocument();
    expect(screen.getByText("Osaka")).toBeInTheDocument();
  });

  test("shows 'No cities found' for no matches", async () => {
    renderPicker();
    const input = screen.getByPlaceholderText("Search city or country...");
    await userEvent.type(input, "xyznonexistent");

    expect(screen.getByText("No cities found")).toBeInTheDocument();
  });

  test("calls onSelect and onClose when city is clicked", async () => {
    renderPicker();
    const input = screen.getByPlaceholderText("Search city or country...");
    await userEvent.type(input, "Tokyo");

    const tokyoButton = screen.getByText("Tokyo").closest("button")!;
    await userEvent.click(tokyoButton);

    expect(defaultProps.onSelect).toHaveBeenCalledWith("Asia/Tokyo");
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  test("close button calls onClose", async () => {
    renderPicker();
    const closeButton = screen.getByText("✕");
    await userEvent.click(closeButton);

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  test("clicking backdrop calls onClose", () => {
    const { container } = renderPicker();
    // The backdrop is the fixed overlay div (first child of container)
    const backdrop = container.firstChild as HTMLElement;
    fireEvent.click(backdrop);

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  test("Escape key calls onClose", () => {
    renderPicker();
    fireEvent.keyDown(document, { key: "Escape" });

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  test("groups cities by region", () => {
    renderPicker();
    // Check for region headers
    expect(screen.getByText("Americas")).toBeInTheDocument();
    expect(screen.getByText("Europe")).toBeInTheDocument();
    expect(screen.getByText("Asia")).toBeInTheDocument();
  });
});
