"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_LANGUAGE, isLanguageCode, type LanguageCode } from "@/src/lib/i18n";

const STORAGE_KEY = "amiio:generated-reports:v1";
export const GENERATED_REPORTS_EVENT = "amiio:generated-reports-changed";

export type ReportOwnerType = "entity" | "property";

export type GeneratedReport = {
  id: string;
  title: string;
  /** ISO timestamp — when the report was generated. */
  createdAt: string;
  /** Locked at creation; drives how the document renders. */
  language: LanguageCode;
  ownerType: ReportOwnerType;
  /** Entity or property the report covers. */
  ownerName: string;
  /** Reporting period, e.g. "Q3 2025". */
  period: string;
};

function isBrowser() {
  return typeof window !== "undefined";
}

let cache: { raw: string; reports: GeneratedReport[] } | null = null;
const EMPTY: GeneratedReport[] = [];

function read(): GeneratedReport[] {
  if (!isBrowser()) return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    if (cache?.raw !== raw) cache = { raw, reports: JSON.parse(raw) as GeneratedReport[] };
    return cache.reports;
  } catch {
    return EMPTY;
  }
}

function write(reports: GeneratedReport[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  window.dispatchEvent(new CustomEvent(GENERATED_REPORTS_EVENT));
}

function subscribe(onChange: () => void): () => void {
  if (!isBrowser()) return () => {};
  window.addEventListener(GENERATED_REPORTS_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(GENERATED_REPORTS_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function getGeneratedReports(): GeneratedReport[] {
  return read();
}

export function addGeneratedReport(report: GeneratedReport) {
  write([report, ...read().filter((item) => item.id !== report.id)]);
}

/** React binding — re-renders when a report is generated. */
export function useGeneratedReports(): GeneratedReport[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

/**
 * The language a report renders in: locked to its creation language, falling
 * back to the default for seed/mock reports that were never "generated".
 */
export function resolveReportLanguage(
  title: string,
  reports: readonly GeneratedReport[],
): LanguageCode {
  const match = reports.find((report) => report.title === title);
  if (match && isLanguageCode(match.language)) return match.language;
  return DEFAULT_LANGUAGE;
}
