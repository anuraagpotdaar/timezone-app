export interface TimezoneEntry {
  label: string;
  country: string;
  value: string;       // IANA timezone identifier
  short: string;       // abbreviation like EST/EDT
}

export interface TimeValue {
  hour: number;   // 0-23
  minute: number; // 0-59
}

export interface CardState {
  zone: string;
  time: TimeValue;
  date: string;
  offset: string;
  dst: boolean;
}

export type TimeOfDay = "dawn" | "day" | "dusk" | "night";

export type ColumnCount = 2 | 3 | 4;
