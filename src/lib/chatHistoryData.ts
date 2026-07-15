import type { AskAiSession } from "@/src/types/askAi";

export type ChatHistoryEntry = {
  id: string;
  title: string;
  timestamp: number;
};

export type ChatHistoryGroup = {
  label: string;
  entries: ChatHistoryEntry[];
};

function daysAgo(n: number, hour = 12) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, 0, 0, 0);
  return d.getTime();
}

/** Figma 1172:61272 — demo history when no saved sessions exist. */
export const DEMO_CHAT_HISTORY_ENTRIES: ChatHistoryEntry[] = [
  {
    id: "hist-1",
    title: "Rank my assets by risk score and explain the main drivers",
    timestamp: daysAgo(1, 15),
  },
  {
    id: "hist-2",
    title:
      "Create a one-page strategic summary for Paris Retail Portfolio for the investment committee",
    timestamp: daysAgo(1, 11),
  },
  {
    id: "hist-3",
    title: "Create a portfolio performance summary for Q2",
    timestamp: daysAgo(5),
  },
  {
    id: "hist-4",
    title: "Draft a report about all properties WAULT improvement",
    timestamp: daysAgo(14),
  },
  {
    id: "hist-5",
    title: "Create a dashboard with my assets valuation and performance",
    timestamp: daysAgo(14, 10),
  },
];

export function getChatHistoryGroupLabel(date: Date, now = new Date()): string {
  const startOfDay = (value: Date) =>
    new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();
  const diffDays = Math.round(
    (startOfDay(now) - startOfDay(date)) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays <= 7) return "Last week";
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

export function getChatHistoryEntries(sessions: AskAiSession[]): ChatHistoryEntry[] {
  const fromSessions = sessions
    .filter((session) => session.title.trim() && session.title !== "New chat")
    .map((session) => ({
      id: session.id,
      title: session.title,
      timestamp: session.updatedAt ?? session.createdAt,
    }));

  const source =
    fromSessions.length > 0
      ? fromSessions
      : DEMO_CHAT_HISTORY_ENTRIES;

  return [...source].sort((a, b) => b.timestamp - a.timestamp);
}

export function groupChatHistoryEntries(
  entries: ChatHistoryEntry[],
  searchQuery = "",
): ChatHistoryGroup[] {
  const query = searchQuery.trim().toLowerCase();
  const filtered = query
    ? entries.filter((entry) => entry.title.toLowerCase().includes(query))
    : entries;

  const groups = new Map<string, ChatHistoryEntry[]>();
  for (const entry of filtered) {
    const label = getChatHistoryGroupLabel(new Date(entry.timestamp));
    const bucket = groups.get(label) ?? [];
    bucket.push(entry);
    groups.set(label, bucket);
  }

  return Array.from(groups.entries()).map(([label, bucket]) => ({
    label,
    entries: bucket,
  }));
}
