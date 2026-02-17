import type { TimeValue, TimeOfDay } from "@/types";

/** Get current hour & minute in a given IANA timezone */
export function getTimeInZone(date: Date, tz: string): TimeValue {
  try {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(date);

    return {
      hour: parseInt(parts.find((p) => p.type === "hour")!.value),
      minute: parseInt(parts.find((p) => p.type === "minute")!.value),
    };
  } catch {
    return { hour: 0, minute: 0 };
  }
}

/** Format date string in a given timezone */
export function getDateInZone(date: Date, tz: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(date);
  } catch {
    return "";
  }
}

/** Get UTC offset label like "UTC+5:30" */
export function getOffsetLabel(date: Date, tz: string): string {
  try {
    const str = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      timeZoneName: "shortOffset",
    }).format(date);
    const match = str.match(/GMT([+-]\d+:?\d*)/);
    return match ? `UTC${match[1]}` : "UTC+0";
  } catch {
    return "";
  }
}

/** Detect if a timezone is currently observing daylight saving time */
export function isDST(date: Date, tz: string): boolean {
  try {
    const fmt = (d: Date) =>
      new Intl.DateTimeFormat("en", {
        timeZone: tz,
        timeZoneName: "longOffset",
      }).format(d);

    const jan = fmt(new Date(date.getFullYear(), 0, 1));
    const jul = fmt(new Date(date.getFullYear(), 6, 1));

    if (jan === jul) return false;
    return fmt(date) !== jan;
  } catch {
    return false;
  }
}

/** Classify hour into a time-of-day bucket for visual theming */
export function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 6 && hour < 8) return "dawn";
  if (hour >= 8 && hour < 17) return "day";
  if (hour >= 17 && hour < 20) return "dusk";
  return "night";
}

/** Sun arc position (0–1) for rendering; 0 = horizon, 1 = zenith */
export function getSunPosition(hour: number, minute: number): number {
  const t = hour + minute / 60;
  if (t >= 5 && t <= 20) return Math.sin(((t - 5) / 15) * Math.PI);
  return 0;
}

/** Convert 24h hour → 12h display hour */
export function to12Hour(hour: number): number {
  return hour % 12 === 0 ? 12 : hour % 12;
}

/** Get AM/PM from 24h hour */
export function getAmPm(hour: number): "AM" | "PM" {
  return hour >= 12 ? "PM" : "AM";
}

/**
 * Parse a flexible user-typed time string into a TimeValue.
 *
 * Accepted formats:
 *   "2:30pm", "230pm", "2:30 PM", "14:30", "230p",
 *   "1030", "10", "2pm", "2 am", etc.
 *
 * @param input - The raw string the user typed
 * @param currentHour - The current hour (0–23) for am/pm inference
 * @returns TimeValue or null if unparseable
 */
export function parseTimeInput(
  input: string,
  currentHour: number
): TimeValue | null {
  const s = input.trim().toLowerCase().replace(/\s+/g, "");

  let isPm: boolean | null = null;
  let clean = s;

  if (s.endsWith("pm") || s.endsWith("p")) {
    isPm = true;
    clean = s.replace(/p\.?m?\.?$/, "");
  } else if (s.endsWith("am") || s.endsWith("a")) {
    isPm = false;
    clean = s.replace(/a\.?m?\.?$/, "");
  }

  clean = clean.replace(":", "");
  if (!/^\d{1,4}$/.test(clean)) return null;

  let h: number;
  let m: number;

  if (clean.length <= 2) {
    h = parseInt(clean);
    m = 0;
  } else if (clean.length === 3) {
    h = parseInt(clean[0]);
    m = parseInt(clean.slice(1));
  } else {
    h = parseInt(clean.slice(0, 2));
    m = parseInt(clean.slice(2));
  }

  if (m < 0 || m > 59) return null;

  if (isPm !== null) {
    // Explicit am/pm
    if (h < 1 || h > 12) return null;
    if (isPm) h = h === 12 ? 12 : h + 12;
    else h = h === 12 ? 0 : h;
  } else {
    if (h > 23) return null;
    // Infer from current period when ambiguous (1–12)
    if (h >= 1 && h <= 12) {
      if (currentHour >= 12 && h !== 12) h += 12;
      else if (h === 12 && currentHour < 12) h = 0;
    }
  }

  return { hour: h % 24, minute: m };
}

/** Detect user's IANA timezone from browser */
export function detectUserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "America/New_York";
  }
}
