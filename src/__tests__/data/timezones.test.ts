import { TIMEZONE_DATA } from "@/data/timezones";

describe("TIMEZONE_DATA", () => {
  test("contains at least 120 entries", () => {
    expect(TIMEZONE_DATA.length).toBeGreaterThanOrEqual(120);
  });

  test("every entry has required fields", () => {
    TIMEZONE_DATA.forEach((entry, i) => {
      expect(entry.label).toBeTruthy();
      expect(entry.country).toBeTruthy();
      expect(entry.value).toBeTruthy();
      expect(entry.short).toBeTruthy();
    });
  });

  test("every value is a valid IANA timezone", () => {
    TIMEZONE_DATA.forEach((entry) => {
      expect(() => {
        Intl.DateTimeFormat("en", { timeZone: entry.value });
      }).not.toThrow();
    });
  });

  test("no duplicate label+value combinations", () => {
    const keys = TIMEZONE_DATA.map((e) => `${e.label}|${e.value}`);
    const unique = new Set(keys);
    expect(unique.size).toBe(keys.length);
  });

  test("covers all major regions", () => {
    const regions = new Set(TIMEZONE_DATA.map((e) => e.value.split("/")[0]));
    expect(regions.has("America")).toBe(true);
    expect(regions.has("Europe")).toBe(true);
    expect(regions.has("Asia")).toBe(true);
    expect(regions.has("Africa")).toBe(true);
    expect(regions.has("Australia")).toBe(true);
    expect(regions.has("Pacific")).toBe(true);
  });

  test("contains expected cities", () => {
    const labels = TIMEZONE_DATA.map((e) => e.label);
    ["New York", "London", "Tokyo", "Sydney", "Dubai", "Mumbai", "São Paulo", "Lagos"].forEach((city) => {
      expect(labels).toContain(city);
    });
  });

  test("every entry has a country field", () => {
    TIMEZONE_DATA.forEach((entry) => {
      expect(entry.country.length).toBeGreaterThan(0);
    });
  });
});
