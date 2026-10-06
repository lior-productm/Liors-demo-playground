import type { FrequencyConfig } from "@/src/types/aiAnalysts";

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function timeLabel(time: string): string {
  if (!time) return "";
  const [h, m] = time.split(":");
  return `${Number(h)}:${m ?? "00"}`;
}

function isoToLongDate(iso?: string): string | null {
  if (!iso) return null;
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** Whether the config has everything it needs to schedule — drives Next/Review enablement. */
export function validateFrequency(freq: FrequencyConfig): {
  valid: boolean;
  dateError?: string;
  timeError?: string;
} {
  let dateError: string | undefined;
  let timeError: string | undefined;

  if (!freq.time) {
    timeError = "Please select a time to schedule the run.";
  }

  if (freq.kind === "once") {
    if (!freq.date) {
      dateError = "Please select a date to schedule the run.";
    } else {
      const picked = new Date(`${freq.date}T${freq.time || "00:00"}:00`);
      if (picked.getTime() < Date.now()) {
        dateError = "The selected date has passed. Please select a future date to continue.";
      }
    }
  }

  if (freq.kind === "weekly" && (!freq.weekdays || freq.weekdays.length === 0)) {
    // No separate message in the spec; block silently via validity.
    return { valid: false, dateError, timeError };
  }

  if (freq.kind === "yearly" && (freq.yearlyMonth == null || freq.yearlyDay == null)) {
    return { valid: false, dateError, timeError };
  }

  return { valid: !dateError && !timeError, dateError, timeError };
}

/**
 * Summary split into parts so the UI can bold the schedule phrase:
 * "[name] will run " + **once on Aug 20, 2026 at 9:00** + ", Europe/Amsterdam time."
 */
export function frequencySummaryParts(
  name: string,
  freq: FrequencyConfig,
): { prefix: string; bold: string; suffix: string } | null {
  const { valid } = validateFrequency(freq);
  if (!valid) return null;

  const t = timeLabel(freq.time);
  const subject = name?.trim() || "This task";
  const prefix = `${subject} will run `;
  const suffix = `, ${freq.timezone} time.`;

  switch (freq.kind) {
    case "once": {
      const date = isoToLongDate(freq.date);
      if (!date) return null;
      return { prefix, bold: `once on ${date} at ${t}`, suffix };
    }
    case "daily":
      return { prefix, bold: `every day at ${t}`, suffix };
    case "weekly": {
      const days = (freq.weekdays ?? []).sort((a, b) => a - b).map((d) => WEEKDAY_LABELS[d]).join(", ");
      return { prefix, bold: `every week on ${days} at ${t}`, suffix };
    }
    case "monthly":
      return {
        prefix,
        bold: `on ${(freq.monthlyOn ?? "the first business day").toLowerCase()} of every month at ${t}`,
        suffix,
      };
    case "quarterly":
      return {
        prefix,
        bold: `on ${(freq.monthlyOn ?? "the first business day").toLowerCase()} of every quarter, starting from ${freq.quarterlyStart ?? "Q1"} at ${t}`,
        suffix,
      };
    case "yearly": {
      const month = MONTH_LABELS[freq.yearlyMonth ?? 0];
      return { prefix, bold: `once every year on ${month} ${freq.yearlyDay ?? 1} at ${t}`, suffix };
    }
    default:
      return null;
  }
}

/** Live summary sentence, e.g. "[name] will run every day at 9:00, Europe/Amsterdam time." */
export function frequencySummarySentence(name: string, freq: FrequencyConfig): string | null {
  const parts = frequencySummaryParts(name, freq);
  return parts ? `${parts.prefix}${parts.bold}${parts.suffix}` : null;
}

/** A mocked "Next run: …" label. */
export function nextRunLabel(freq: FrequencyConfig): string | null {
  const { valid } = validateFrequency(freq);
  if (!valid) return null;
  const t = timeLabel(freq.time);

  const fmt = (d: Date) =>
    `${d.toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" }).replace(/,/g, "")}, ${t}`;

  if (freq.kind === "once") {
    if (!freq.date) return null;
    const d = new Date(`${freq.date}T00:00:00`);
    return Number.isNaN(d.getTime()) ? null : fmt(d);
  }
  // Mock: next occurrence is "tomorrow" for recurring schedules.
  const next = new Date();
  next.setDate(next.getDate() + 1);
  return fmt(next);
}

export const WEEKDAY_PILLS = ["M", "T", "W", "T", "F", "S", "S"];
export const MONTHLY_ON_OPTIONS = [
  "The first business day",
  "The last business day",
  "The 1st",
  "The 15th",
];
export const MONTH_OPTIONS = MONTH_LABELS;
