"use client";

import type { Task, TaskStatus } from "@/src/types/aiAnalysts";
import { SEED_TASKS } from "@/src/lib/aiAnalystsData";

const STORAGE_KEY = "amiio:ai-analyst-tasks:v2";
export const AI_ANALYST_TASKS_EVENT = "amiio:ai-analyst-tasks-changed";

function isBrowser() {
  return typeof window !== "undefined";
}

// Cache the parsed value per raw string so useSyncExternalStore gets a stable snapshot.
let cache: { raw: string; tasks: Task[] } | null = null;

function read(): Task[] {
  if (!isBrowser()) return SEED_TASKS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_TASKS));
      return SEED_TASKS;
    }
    if (cache?.raw !== raw) cache = { raw, tasks: JSON.parse(raw) as Task[] };
    return cache.tasks;
  } catch {
    return SEED_TASKS;
  }
}

export function getServerTasks(): Task[] {
  return SEED_TASKS;
}

export function subscribeTasks(onChange: () => void): () => void {
  window.addEventListener(AI_ANALYST_TASKS_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(AI_ANALYST_TASKS_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function write(tasks: Task[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  window.dispatchEvent(new CustomEvent(AI_ANALYST_TASKS_EVENT));
}

export function getTasks(): Task[] {
  return read();
}

export function getTask(id: string): Task | undefined {
  return read().find((t) => t.id === id);
}

export function saveTasks(tasks: Task[]) {
  write(tasks);
}

export function addTask(task: Task) {
  write([task, ...read()]);
}

export function upsertTask(task: Task) {
  const tasks = read();
  const exists = tasks.some((t) => t.id === task.id);
  write(exists ? tasks.map((t) => (t.id === task.id ? task : t)) : [task, ...tasks]);
}

export function updateTask(id: string, patch: Partial<Task>) {
  write(read().map((t) => (t.id === id ? { ...t, ...patch } : t)));
}

/** Pause/resume/archive/restore — cascades to the task's subtasks. */
export function setTaskStatus(id: string, status: TaskStatus) {
  write(
    read().map((t) => {
      if (t.id !== id) return t;
      const subtaskStatus = status === "active" ? "active" : "paused";
      return {
        ...t,
        status,
        subtasks: t.subtasks.map((s) => ({ ...s, status: subtaskStatus })),
      };
    }),
  );
}

export function deleteTask(id: string) {
  write(read().filter((t) => t.id !== id));
}

export function nextVersionLabel(task: Task): string {
  const minor = task.versions.length; // v1.0, v1.1, v1.2 ...
  return `v1.${minor}`;
}

export function addVersion(id: string) {
  write(
    read().map((t) => {
      if (t.id !== id) return t;
      const today = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      return {
        ...t,
        versions: [
          ...t.versions,
          {
            id: `ver-${Math.random().toString(36).slice(2, 8)}`,
            label: nextVersionLabel(t),
            createdOn: today,
            owner: "Sarah Lee",
            lastModified: today,
          },
        ],
      };
    }),
  );
}
