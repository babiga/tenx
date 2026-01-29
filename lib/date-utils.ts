import { formatInTimeZone } from "date-fns-tz";
import { mn } from "date-fns/locale";

// Mongolian timezone constant
const MONGOLIA_TIMEZONE = "Asia/Ulaanbaatar"; // UTC+8

// Type definition for date inputs
type DateInput = Date | string | null | undefined;

/**
 * Helper function to convert input to a valid Date object
 * @param input - Date, ISO string, or null/undefined
 * @returns Valid Date object or null
 */
function toDate(input: DateInput): Date | null {
  if (!input) return null;
  if (input instanceof Date) return input;
  const date = new Date(input);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Format date with short month and time in Mongolian timezone
 * @param date - Date to format
 * @returns Formatted string like "2024 1-р сар 15, 14:30" or "-"
 * @example formatDateTimeMN("2024-01-15T16:00:00.000Z") // "2024 1-р сар 16, 00:00"
 */
export function formatDateTimeMN(date: DateInput): string {
  const validDate = toDate(date);
  if (!validDate) return "-";

  return formatInTimeZone(validDate, MONGOLIA_TIMEZONE, "yyyy MMM d, HH:mm", {
    locale: mn,
  });
}

/**
 * Format date with long month and time in Mongolian timezone
 * @param date - Date to format
 * @returns Formatted string like "2024 1-р сар 15, 14:30" or "-"
 * @example formatDateTimeLongMN("2024-01-15T16:00:00.000Z") // "2024 1-р сар 16, 00:00"
 */
export function formatDateTimeLongMN(date: DateInput): string {
  const validDate = toDate(date);
  if (!validDate) return "-";

  return formatInTimeZone(validDate, MONGOLIA_TIMEZONE, "yyyy MMMM d, HH:mm", {
    locale: mn,
  });
}

/**
 * Format date only (no time) with short month in Mongolian timezone
 * @param date - Date to format
 * @returns Formatted string like "2024 1-р сар 15" or "-"
 * @example formatDateMN("2024-01-15T16:00:00.000Z") // "2024 1-р сар 16"
 */
export function formatDateMN(date: DateInput): string {
  const validDate = toDate(date);
  if (!validDate) return "-";

  return formatInTimeZone(validDate, MONGOLIA_TIMEZONE, "yyyy MMM d", {
    locale: mn,
  });
}

/**
 * Format date with dot separators in Mongolian timezone
 * @param date - Date to format
 * @returns Formatted string like "2024.01.15" or "-"
 * @example formatDateDotMN("2024-01-15T16:00:00.000Z") // "2024.01.16"
 */
export function formatDateDotMN(date: DateInput): string {
  const validDate = toDate(date);
  if (!validDate) return "-";

  return formatInTimeZone(validDate, MONGOLIA_TIMEZONE, "yyyy.MM.dd", {
    locale: mn,
  });
}

/**
 * Format date with simple slash separators in Mongolian timezone
 * @param date - Date to format
 * @returns Formatted string like "2024/1/15" or "-"
 * @example formatDateSimpleMN("2024-01-15T16:00:00.000Z") // "2024/1/16"
 */
export function formatDateSimpleMN(date: DateInput): string {
  const validDate = toDate(date);
  if (!validDate) return "-";

  return formatInTimeZone(validDate, MONGOLIA_TIMEZONE, "yyyy/M/d", {
    locale: mn,
  });
}
