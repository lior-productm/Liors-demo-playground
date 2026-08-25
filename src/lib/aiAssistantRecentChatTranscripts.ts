export type AiAssistantTranscriptTurn = {
  role: "user" | "assistant";
  content: string;
};

const TRANSCRIPTS: Record<string, AiAssistantTranscriptTurn[]> = {
  "chat-1": [
    {
      role: "user",
      content: "Rank my assets by risk score and explain the main drivers",
    },
    {
      role: "assistant",
      content:
        "Here's your portfolio ranked by lease risk score (highest first):\n\n1. H.J.E. Wenckebachweg — 78/100\n2. Yellow Submarine Portfolio — 64/100\n3. Abbey Road Logistics Hub — 52/100\n\nMain drivers at Wenckebachweg: 2 leases expiring within 12 months, 1 tenant with break option in Q3, and rent 8% below market on renewal.",
    },
    {
      role: "user",
      content: "What should I prioritize for Wenckebachweg?",
    },
    {
      role: "assistant",
      content:
        "Start with Hey Jude B.V. — lease expires 14-Sep-2026 with a break option exercisable from 1-Jul-2026. I recommend initiating renewal prep now and reviewing the rent review clause before the Q3 window.",
    },
  ],
  "chat-2": [
    {
      role: "user",
      content:
        "Create a one-page strategic summary for Yellow Submarine Portfolio for the investment committee",
    },
    {
      role: "assistant",
      content:
        "I've drafted a one-page IC summary for Yellow Submarine Portfolio covering occupancy (94.2%), WAULT (4.1 years), upcoming lease events, and tenant concentration.\n\nKey lease highlights: 3 renewals due in H2 2026, 1 break option in October, and €2.4M rent at risk from the top-2 tenants combined.",
    },
    {
      role: "user",
      content: "Add a section on renewal pipeline",
    },
    {
      role: "assistant",
      content:
        "Added a Renewal Pipeline section: 4 active negotiations, 2 draft proposals sent, and 1 lease under legal review. Expected €180K annualized uplift if renewals close at market terms.",
    },
  ],
  "chat-3": [
    {
      role: "user",
      content: "Create a portfolio performance summary for Q2",
    },
    {
      role: "assistant",
      content:
        "Q2 lease performance summary:\n\n• 6 renewals completed (+€420K annual rent)\n• Occupancy held at 93.8% (-0.2pp vs Q1)\n• 2 break options waived, 1 early renewal secured\n• WAULT improved from 3.9 to 4.1 years",
    },
    {
      role: "user",
      content: "Which assets drove the WAULT improvement?",
    },
    {
      role: "assistant",
      content:
        "Yellow Submarine (+0.4 years) and Abbey Road Logistics (+0.3 years) drove most of the WAULT gain through 5-year renewal extensions signed in April and May.",
    },
  ],
  "chat-4": [
    {
      role: "user",
      content: "Draft a report about all properties WAULT improvement",
    },
    {
      role: "assistant",
      content:
        "I've prepared a WAULT improvement report across 12 assets. Portfolio WAULT moved from 3.7 to 4.1 years over the last 12 months.\n\nTop contributors: lease extensions at Yellow Submarine (+0.6y) and early renewals at Wenckebachweg (+0.3y). Two assets flat due to break options exercised in Q1.",
    },
    {
      role: "user",
      content: "Export this as a PDF for the asset management team",
    },
    {
      role: "assistant",
      content:
        "Export ready. The PDF includes asset-level WAULT charts, lease event timeline, and a summary of renewals vs break options for each property.",
    },
  ],
  "chat-5": [
    {
      role: "user",
      content: "Create a dashboard with my assets valuation and performance",
    },
    {
      role: "assistant",
      content:
        "I've built a lease-focused dashboard with valuation vs passing rent, occupancy, WAULT, and upcoming expiry heatmap across your assets.\n\nYellow Submarine shows the largest mark-to-market gap (+12%), while Wenckebachweg has the nearest concentration of lease events in the next 6 months.",
    },
    {
      role: "user",
      content: "Pin the expiry heatmap to the top",
    },
    {
      role: "assistant",
      content:
        "Done — the expiry heatmap is now the first panel, filtered to the next 18 months with color coding by tenant risk score.",
    },
  ],
};

export function getRecentChatTranscript(chatId: string): AiAssistantTranscriptTurn[] {
  return TRANSCRIPTS[chatId] ?? [];
}

export function transcriptToMessages(
  chatId: string,
  turns: AiAssistantTranscriptTurn[],
): { id: string; role: "user" | "assistant"; content: string }[] {
  return turns.map((turn, index) => ({
    id: `${chatId}-${index}`,
    role: turn.role,
    content: turn.content,
  }));
}
