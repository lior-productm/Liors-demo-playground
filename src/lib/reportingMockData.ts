export const REPORTING_TABS = [
  { id: "active", label: "Active reports" },
  { id: "all", label: "All reports" },
] as const;

export type ReportingTabId = (typeof REPORTING_TABS)[number]["id"];

export const ACTIVE_REPORTS = [
  "Z Holdings Q3 2025",
  "Portfolio A Q2 2025",
  "Entity X Annual 2024",
] as const;

export const REPORT_SECTIONS = [
  { id: "introduction", label: "Introduction" },
  { id: "acquisition", label: "Acquisition and Finance" },
  { id: "distribution", label: "Distribution, Capitals and things" },
  { id: "metrics", label: "Metrics" },
  { id: "updates", label: "General Updates" },
] as const;

export type ReportSectionId = (typeof REPORT_SECTIONS)[number]["id"];

export type ReportPlRowKind =
  | "bank-start"
  | "bank-end"
  | "column-header"
  | "section"
  | "line"
  | "subtotal"
  | "highlight"
  | "profit";

export type ReportPlRow = {
  kind: ReportPlRowKind;
  category?: string;
  account: string;
  budget?: string;
  q1Actual?: string;
  vsBudget?: string;
};

export const REPORT_PL_ROWS: ReportPlRow[] = [
  {
    kind: "bank-start",
    category: "BANK BALANCE",
    account: "Start of the quarter",
    q1Actual: "€654.264",
    vsBudget: "€368.637",
  },
  {
    kind: "column-header",
    category: "Category",
    account: "P&L Account",
    budget: "Budget Q4 2025",
    q1Actual: "Q1  Actual",
    vsBudget: "Actual vs Budget",
  },
  {
    kind: "section",
    category: "INCOME",
    account: "Rental income",
    budget: "€139.497",
    q1Actual: "€110.968",
    vsBudget: "€-28.529",
  },
  {
    kind: "subtotal",
    account: "Total Income",
    budget: "€139.497",
    q1Actual: "€110.968",
    vsBudget: "-",
  },
  {
    kind: "section",
    category: "COSTS",
    account: "Taxes & Insurance",
    budget: "€3.978",
    q1Actual: "€2.342",
    vsBudget: "€-1.636",
  },
  {
    kind: "line",
    account: "Management fees",
    budget: "€5.699",
    q1Actual: "-",
    vsBudget: "€-5.699",
  },
  {
    kind: "line",
    account: "Other general expenses",
    budget: "€27.083",
    q1Actual: "€17.718",
    vsBudget: "€-9.365",
  },
  {
    kind: "subtotal",
    account: "Total expenses",
    budget: "€36.760",
    q1Actual: "€20.060",
    vsBudget: "€-16.700",
  },
  {
    kind: "highlight",
    account: "NOI",
    budget: "€102.737",
    q1Actual: "€90.908",
    vsBudget: "€-11.829",
  },
  {
    kind: "line",
    account: "Depreciation",
    budget: "-",
    q1Actual: "-",
    vsBudget: "-",
  },
  {
    kind: "line",
    account: "Financial expenses",
    budget: "€30.707",
    q1Actual: "€30.707",
    vsBudget: "-",
  },
  {
    kind: "profit",
    category: "PROFIT",
    budget: "€72.030",
    q1Actual: "€60.201",
    vsBudget: "€-11.829",
  },
  {
    kind: "section",
    category: "CASH FLOW",
    account: "Capital distributions / Contributions",
    budget: "-",
    q1Actual: "-",
    vsBudget: "-",
  },
  {
    kind: "line",
    account: "Loan repayment",
    budget: "-",
    q1Actual: "€10.794.505",
    vsBudget: "(€70.000)",
  },
  {
    kind: "line",
    account: "Changes in WC",
    budget: "-",
    q1Actual: "€-88.188",
    vsBudget: "€36.634",
  },
  {
    kind: "subtotal",
    account: "Levered net cash flow",
    budget: "-",
    q1Actual: "-",
    vsBudget: "-",
  },
  {
    kind: "bank-end",
    category: "BANK BALANCE",
    account: "End of the quarter",
    q1Actual: "€441.060",
    vsBudget: "",
  },
];

export type ReportDocumentBlock =
  | { type: "prose"; paragraphs: string[] }
  | { type: "pl-table"; title: string }
  | { type: "metrics"; items: { label: string; value: string }[] }
  | { type: "updates"; items: string[] }
  | { type: "heading"; title: string; subtitle?: string }
  | { type: "table"; columns: string[]; rows: string[][] }
  | { type: "chart"; items: { label: string; value: string; ratio: number }[] }
  | { type: "photos"; items: { label: string }[] };

export type ReportDocumentSection = {
  id: ReportSectionId | string;
  title: string;
  blocks: ReportDocumentBlock[];
};

export const REPORT_DOCUMENT_SECTIONS: ReportDocumentSection[] = [
  {
    id: "introduction",
    title: "Introduction",
    blocks: [
      {
        type: "prose",
        paragraphs: [
          "This quarterly report covers the performance of Z Holdings for Q3 2025. It summarizes financial results, capital activity, and key operational updates for the investment committee.",
          "The report is structured by section. Use the left navigation to jump between topics, or scroll through the document in preview mode.",
        ],
      },
    ],
  },
  {
    id: "acquisition",
    title: "Acquisition and Finance",
    blocks: [{ type: "pl-table", title: "P&L 2025" }],
  },
  {
    id: "distribution",
    title: "Distribution, Capitals and things",
    blocks: [
      {
        type: "prose",
        paragraphs: [
          "No capital distributions were made during Q1 2025. Original capital contribution remains the primary driver of levered returns and covenant headroom.",
          "Loan amortization of €10.8M was applied in the quarter, reducing outstanding principal per the facility schedule.",
        ],
      },
    ],
  },
  {
    id: "metrics",
    title: "Metrics",
    blocks: [
      {
        type: "metrics",
        items: [
          { label: "Occupancy", value: "94.2%" },
          { label: "NOI margin", value: "82.1%" },
          { label: "DSCR", value: "1.18x" },
          { label: "LTV", value: "62.4%" },
        ],
      },
    ],
  },
  {
    id: "updates",
    title: "General Updates",
    blocks: [
      {
        type: "updates",
        items: [
          "Lease renewal discussions initiated with anchor tenant — notice deadline October 2026.",
          "Property insurance renewal completed at flat premium.",
          "Energy efficiency capex project on track for Q2 completion.",
        ],
      },
    ],
  },
];

export const REPORT_INSIGHTS = [
  {
    id: "1",
    title: "Original Capital Contribution Remains a Key Driver of ROI Sensitivity",
    body: [
      "The lease agreement with a major tenant in Z Holdings B.V. is set to expire on 31 October 2026, with a 12-month notice period. This means the deadline for the tenant to provide notice is approaching soon. If notice is given and the lease is not renewed or replaced, annual rental income will drop significantly from 1 November 2026.",
      "In this specific case, the income reduction would trigger the Debt Service Coverage Ratio (DSCR) clause in the loan agreement, potentially leading to an event of default. This could allow the lender to accelerate loan repayment.",
      "Given the financial impact and covenant sensitivity, it is critical to secure a lease renewal or replacement tenant well before the notice date to avoid a default scenario.",
    ],
    reviewed: false,
    scrollTarget: "acquisition" as ReportSectionId,
    anchorOffsetPx: 168,
  },
  {
    id: "2",
    title: "Fixed-Asset Investment Explains the Low Excess from Closing",
    reviewed: true,
    scrollTarget: "distribution" as ReportSectionId,
    anchorOffsetPx: 24,
  },
  {
    id: "3",
    title: "Lease Expiry Risk May Trigger DSCR Covenant Breach",
    reviewed: false,
    scrollTarget: "metrics" as ReportSectionId,
    anchorOffsetPx: 24,
  },
  {
    id: "4",
    title: "Q3 Report Scope Covers Financial, Capital, and Operational Updates",
    body: [
      "This quarterly pack is intended for the investment committee and summarizes Z Holdings performance through Q3 2025.",
      "Readers should cross-reference the P&L table with the metrics section when assessing covenant headroom and cash coverage.",
    ],
    reviewed: false,
    scrollTarget: "introduction" as ReportSectionId,
    anchorOffsetPx: 48,
  },
  {
    id: "5",
    title: "Rental Income Came In €28.5K Below Budget in Q1 Actuals",
    body: [
      "Actual rental income of €110,968 trailed the budget of €139,497, contributing to an €11.8K NOI shortfall versus plan.",
      "Management fees were not incurred in the quarter, partially offsetting the income gap, but the net effect still compresses levered cash flow.",
      "Consider flagging this variance in the committee memo and confirming whether it reflects timing, vacancy, or rent-free periods.",
    ],
    reviewed: false,
    scrollTarget: "acquisition" as ReportSectionId,
    anchorOffsetPx: 320,
  },
  {
    id: "6",
    title: "€10.8M Loan Amortization Reduced Principal per Facility Schedule",
    body: [
      "No distributions were made in the quarter; instead, scheduled loan repayment of €10.8M was applied.",
      "This keeps leverage trending down but reduces cash at bank — end-of-quarter balance closed at €441K versus €654K at opening.",
    ],
    reviewed: true,
    scrollTarget: "distribution" as ReportSectionId,
    anchorOffsetPx: 96,
  },
  {
    id: "7",
    title: "Occupancy at 94.2% Supports NOI, but Margin Compression Persists",
    body: [
      "Occupancy remains strong at 94.2% with an NOI margin of 82.1%, indicating stable asset-level operations.",
      "DSCR at 1.18x and LTV at 62.4% provide moderate covenant headroom, though rental income volatility could erode the buffer quickly.",
    ],
    reviewed: false,
    scrollTarget: "metrics" as ReportSectionId,
    anchorOffsetPx: 72,
  },
  {
    id: "8",
    title: "Anchor Tenant Renewal Discussions Started Ahead of 2026 Notice Window",
    body: [
      "Renewal talks with the anchor tenant have been initiated ahead of the October 2026 notice deadline.",
      "Property insurance was renewed at a flat premium; energy efficiency capex remains on track for Q2 completion.",
    ],
    reviewed: false,
    scrollTarget: "updates" as ReportSectionId,
    anchorOffsetPx: 24,
  },
] as const;

export const ALL_REPORTS_LIST = [
  {
    title: "Z Holdings Q3 2025",
    status: "In Review" as const,
    updated: "Updated 23 Nov 2025",
  },
  {
    title: "Portfolio A Q2 2025",
    status: "Completed" as const,
    updated: "Updated 15 Aug 2025",
  },
  {
    title: "Entity X Annual 2024",
    status: "Completed" as const,
    updated: "Updated 12 Jan 2025",
  },
  {
    title: "Monthly asset report — January 2026",
    status: "Draft" as const,
    updated: "Updated 2 Feb 2026",
  },
];
