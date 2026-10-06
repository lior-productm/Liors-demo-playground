"use client";

import { useSyncExternalStore } from "react";
import type { Task } from "@/src/types/aiAnalysts";
import { getServerTasks, getTasks, subscribeTasks } from "@/src/lib/aiAnalystTasksStore";

/** Subscribes to the localStorage-backed task store and re-renders on changes. */
export function useAiAnalystTasks(): Task[] {
  return useSyncExternalStore(subscribeTasks, getTasks, getServerTasks);
}
