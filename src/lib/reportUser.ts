/**
 * Lightweight current-user stub for the reporting prototype. Matches the demo
 * author used elsewhere (e.g. Insights) so creators read consistently.
 */
export const CURRENT_USER_NAME = "Tomer Zakai";

/** Creator label used for built-in system templates and standard sections. */
export const SYSTEM_CREATOR_NAME = "Amiio";

/** Shared org library vs the signed-in user's own items. */
export type ItemOwnership = "organization" | "personal";

export const OWNERSHIP_LABELS: Record<ItemOwnership, string> = {
  organization: "Organization",
  personal: "Personal",
};

export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
