import {
  getTimeInZone,
  getDateInZone,
  getOffsetLabel,
  isDST,
  getTimeOfDay,
  getSunPosition,
  to12Hour,
  getAmPm,
  parseTimeInput,
  detectUserTimezone,
} from "@/lib/time-utils";

// Fixed date: 2025-07-15T12:00:00Z (noon UTC, summer)
const SUMMER_NOON_UTC = new Date("2025-07-15T12:00:00Z");
// Fixed date: 2025-01-15T12:00:00Z (noon UTC, winter)
const WINTER_NOON_UTC = new Date("2025-01-15T12:00:00Z");

describe("getTimeInZone", () => {
  test("returns correct time for UTC", () => {
    const result = getTimeInZone(SUMMER_NOON_UTC, "UTC");
    expect(result).toEqual({ hour: 12, minute: 0 });
  });

  test("returns correct time for New York (EDT, UTC-4 in summer)", () => {
    const result = getTimeInZone(SUMMER_NOON_UTC, "America/New_York");
    expect(result).toEqual({ hour: 8, minute: 0 });
  });

  test("returns correct time for Tokyo (JST, UTC+9)", () => {
    const result = getTimeInZone(SUMMER_NOON_UTC, "Asia/Tokyo");
    expect(result).toEqual({ hour: 21, minute: 0 });
  });

  test("handles half-hour offset (India, UTC+5:30)", () => {
    const result = getTimeInZone(SUMMER_NOON_UTC, "Asia/Kolkata");
    expect(result).toEqual({ hour: 17, minute: 30 });
  });

  test("handles 45-minute offset (Nepal, UTC+5:45)", () => {
    const result = getTimeInZone(SUMMER_NOON_UTC, "Asia/Kathmandu");
    expect(result).toEqual({ hour: 17, minute: 45 });
  });

  test("returns {0, 0} for invalid timezone", () => {
    const result = getTimeInZone(SUMMER_NOON_UTC, "Invalid/Zone");
    expect(result).toEqual({ hour: 0, minute: 0 });
  });
});

describe("getDateInZone", () => {
  test("formats date string for UTC", () => {
    const result = getDateInZone(SUMMER_NOON_UTC, "UTC");
    expect(result).toMatch(/Tue/);
    expect(result).toMatch(/Jul/);
    expect(result).toMatch(/15/);
  });

  test("shows next day when timezone crosses midnight", () => {
    // Noon UTC = 9pm Tokyo, but 2025-07-15T23:00:00Z = 8am Jul 16 Tokyo
    const lateUTC = new Date("2025-07-15T23:00:00Z");
    const result = getDateInZone(lateUTC, "Asia/Tokyo");
    expect(result).toMatch(/16/);
  });

  test("returns empty string for invalid timezone", () => {
    expect(getDateInZone(SUMMER_NOON_UTC, "Invalid/Zone")).toBe("");
  });
});

describe("getOffsetLabel", () => {
  test("returns UTC+9 for Tokyo", () => {
    const result = getOffsetLabel(SUMMER_NOON_UTC, "Asia/Tokyo");
    expect(result).toMatch(/UTC\+9/);
  });

  test("returns UTC offset with half-hour for India", () => {
    const result = getOffsetLabel(SUMMER_NOON_UTC, "Asia/Kolkata");
    expect(result).toMatch(/UTC\+5:30/);
  });

  test("returns negative offset for New York in summer (EDT)", () => {
    const result = getOffsetLabel(SUMMER_NOON_UTC, "America/New_York");
    expect(result).toMatch(/UTC-4/);
  });
});

describe("isDST", () => {
  test("returns true for New York in July (EDT)", () => {
    expect(isDST(SUMMER_NOON_UTC, "America/New_York")).toBe(true);
  });

  test("returns false for New York in January (EST)", () => {
    expect(isDST(WINTER_NOON_UTC, "America/New_York")).toBe(false);
  });

  test("returns false for Tokyo (no DST)", () => {
    expect(isDST(SUMMER_NOON_UTC, "Asia/Tokyo")).toBe(false);
  });

  test("returns false for UTC (no DST)", () => {
    expect(isDST(SUMMER_NOON_UTC, "UTC")).toBe(false);
  });

  test("returns false for invalid timezone", () => {
    expect(isDST(SUMMER_NOON_UTC, "Invalid/Zone")).toBe(false);
  });
});

describe("getTimeOfDay", () => {
  test("night: 0-5", () => {
    expect(getTimeOfDay(0)).toBe("night");
    expect(getTimeOfDay(3)).toBe("night");
    expect(getTimeOfDay(5)).toBe("night");
  });

  test("dawn: 6-7", () => {
    expect(getTimeOfDay(6)).toBe("dawn");
    expect(getTimeOfDay(7)).toBe("dawn");
  });

  test("day: 8-16", () => {
    expect(getTimeOfDay(8)).toBe("day");
    expect(getTimeOfDay(12)).toBe("day");
    expect(getTimeOfDay(16)).toBe("day");
  });

  test("dusk: 17-19", () => {
    expect(getTimeOfDay(17)).toBe("dusk");
    expect(getTimeOfDay(19)).toBe("dusk");
  });

  test("night again: 20-23", () => {
    expect(getTimeOfDay(20)).toBe("night");
    expect(getTimeOfDay(23)).toBe("night");
  });

  test("boundary: 8 is day, not dawn", () => {
    expect(getTimeOfDay(8)).toBe("day");
  });

  test("boundary: 17 is dusk, not day", () => {
    expect(getTimeOfDay(17)).toBe("dusk");
  });
});

describe("getSunPosition", () => {
  test("returns 0 before sunrise (hour 4)", () => {
    expect(getSunPosition(4, 0)).toBe(0);
  });

  test("returns 0 after sunset (hour 21)", () => {
    expect(getSunPosition(21, 0)).toBe(0);
  });

  test("returns ~1 at solar noon (hour 12:30)", () => {
    const pos = getSunPosition(12, 30);
    expect(pos).toBeGreaterThan(0.99);
  });

  test("returns value between 0 and 1 during day", () => {
    const pos = getSunPosition(9, 0);
    expect(pos).toBeGreaterThan(0);
    expect(pos).toBeLessThan(1);
  });

  test("sunrise position at hour 5 is 0", () => {
    expect(getSunPosition(5, 0)).toBeCloseTo(0, 5);
  });

  test("sunset position at hour 20 is 0", () => {
    expect(getSunPosition(20, 0)).toBeCloseTo(0, 5);
  });
});

describe("to12Hour", () => {
  test("midnight (0) returns 12", () => {
    expect(to12Hour(0)).toBe(12);
  });

  test("noon (12) returns 12", () => {
    expect(to12Hour(12)).toBe(12);
  });

  test("1 AM returns 1", () => {
    expect(to12Hour(1)).toBe(1);
  });

  test("1 PM (13) returns 1", () => {
    expect(to12Hour(13)).toBe(1);
  });

  test("11 PM (23) returns 11", () => {
    expect(to12Hour(23)).toBe(11);
  });

  test("11 AM returns 11", () => {
    expect(to12Hour(11)).toBe(11);
  });
});

describe("getAmPm", () => {
  test("hours 0-11 return AM", () => {
    expect(getAmPm(0)).toBe("AM");
    expect(getAmPm(6)).toBe("AM");
    expect(getAmPm(11)).toBe("AM");
  });

  test("hours 12-23 return PM", () => {
    expect(getAmPm(12)).toBe("PM");
    expect(getAmPm(18)).toBe("PM");
    expect(getAmPm(23)).toBe("PM");
  });
});

describe("parseTimeInput", () => {
  test("parses '2:30pm' to {hour: 14, minute: 30}", () => {
    expect(parseTimeInput("2:30pm", 10)).toEqual({ hour: 14, minute: 30 });
  });

  test("parses '230pm' to {hour: 14, minute: 30}", () => {
    expect(parseTimeInput("230pm", 10)).toEqual({ hour: 14, minute: 30 });
  });

  test("parses '2:30 PM' with spaces", () => {
    expect(parseTimeInput("2:30 PM", 10)).toEqual({ hour: 14, minute: 30 });
  });

  test("parses '12am' to midnight", () => {
    expect(parseTimeInput("12am", 10)).toEqual({ hour: 0, minute: 0 });
  });

  test("parses '12pm' to noon", () => {
    expect(parseTimeInput("12pm", 10)).toEqual({ hour: 12, minute: 0 });
  });

  test("parses '14:30' as 24h format", () => {
    // When currentHour is PM (14), 14 > 12 so treated as 24h
    expect(parseTimeInput("1430", 14)).toEqual({ hour: 14, minute: 30 });
  });

  test("infers PM when currentHour >= 12 and input is ambiguous", () => {
    // Typing "3" when it's 2 PM -> should infer 3 PM (15)
    expect(parseTimeInput("3", 14)).toEqual({ hour: 15, minute: 0 });
  });

  test("infers AM when currentHour < 12 and input is ambiguous", () => {
    // Typing "3" when it's 9 AM -> should stay 3 AM
    expect(parseTimeInput("3", 9)).toEqual({ hour: 3, minute: 0 });
  });

  test("returns null for empty input", () => {
    expect(parseTimeInput("", 10)).toBeNull();
  });

  test("returns null for non-numeric input", () => {
    expect(parseTimeInput("abc", 10)).toBeNull();
  });

  test("returns null for minutes > 59", () => {
    expect(parseTimeInput("1299", 10)).toBeNull();
  });

  test("returns null for hour > 12 with explicit am/pm", () => {
    expect(parseTimeInput("13pm", 10)).toBeNull();
  });

  test("returns null for hour 0 with explicit am/pm", () => {
    expect(parseTimeInput("0am", 10)).toBeNull();
  });

  test("parses '230p' (shorthand pm)", () => {
    expect(parseTimeInput("230p", 10)).toEqual({ hour: 14, minute: 30 });
  });
});

describe("detectUserTimezone", () => {
  test("returns a non-empty string", () => {
    const tz = detectUserTimezone();
    expect(typeof tz).toBe("string");
    expect(tz.length).toBeGreaterThan(0);
  });

  test("returns a valid IANA timezone identifier", () => {
    const tz = detectUserTimezone();
    expect(tz).toMatch(/\//);
  });
});
