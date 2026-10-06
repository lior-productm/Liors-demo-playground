"use client";

import { useSyncExternalStore } from "react";
import type { Source } from "@/src/types/aiAnalysts";
import { getServerSources, getSources, subscribeSources } from "@/src/lib/aiAnalystSourcesStore";

export function useAiAnalystSources(): Source[] {
  return useSyncExternalStore(subscribeSources, getSources, getServerSources);
}
