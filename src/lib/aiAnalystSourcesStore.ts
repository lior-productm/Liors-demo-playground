"use client";

import type { Source } from "@/src/types/aiAnalysts";
import { SEED_SOURCES } from "@/src/lib/aiAnalystsData";

const STORAGE_KEY = "amiio:ai-analyst-sources";
export const AI_ANALYST_SOURCES_EVENT = "amiio:ai-analyst-sources-changed";

function isBrowser() {
  return typeof window !== "undefined";
}

// Cache the parsed value per raw string so useSyncExternalStore gets a stable snapshot.
let cache: { raw: string; sources: Source[] } | null = null;

function read(): Source[] {
  if (!isBrowser()) return SEED_SOURCES;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_SOURCES));
      return SEED_SOURCES;
    }
    if (cache?.raw !== raw) cache = { raw, sources: JSON.parse(raw) as Source[] };
    return cache.sources;
  } catch {
    return SEED_SOURCES;
  }
}

export function getServerSources(): Source[] {
  return SEED_SOURCES;
}

export function subscribeSources(onChange: () => void): () => void {
  window.addEventListener(AI_ANALYST_SOURCES_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(AI_ANALYST_SOURCES_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function write(sources: Source[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sources));
  window.dispatchEvent(new CustomEvent(AI_ANALYST_SOURCES_EVENT));
}

export function getSources(): Source[] {
  return read();
}

export function addSource(source: Source) {
  write([source, ...read()]);
}

export function deleteSource(id: string) {
  write(read().filter((s) => s.id !== id));
}
