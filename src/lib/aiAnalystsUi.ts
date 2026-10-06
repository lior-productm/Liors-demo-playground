/** Fire the global toast rendered by <ToastStack /> (mounted in AppShell). */
export function fireToast(message: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("amiio:toast", { detail: { message } }));
}

/** Short unique id for client-created tasks / subtasks / sources. */
export function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function formatDate(ms: number): string {
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
