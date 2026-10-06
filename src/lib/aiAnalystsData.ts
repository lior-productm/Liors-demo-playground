import type {
  AnalystDef,
  AnalystId,
  FrequencyKind,
  ScopeLevel,
  ScopeNode,
  ScopeSelection,
  Source,
  Task,
  TemplateDef,
  User,
} from "@/src/types/aiAnalysts";

/* -------------------------------------------------------------------------- */
/*  Users (team members — generic names, no real clients)                     */
/* -------------------------------------------------------------------------- */

export const USERS: User[] = [
  { id: "u-sarah", name: "Sarah Lee", email: "sarah.lee@amiio.demo" },
  { id: "u-john", name: "John Smith", email: "john.smith@amiio.demo" },
  { id: "u-jude", name: "Jude Harrison", email: "jude.harrison@amiio.demo" },
  { id: "u-rita", name: "Rita Barrett", email: "rita.barrett@amiio.demo" },
  { id: "u-penny", name: "Penny Fields", email: "penny.fields@amiio.demo" },
];

export const CURRENT_USER_ID = "u-sarah";

export function getUser(id: string): User | undefined {
  return USERS.find((u) => u.id === id);
}

export function userInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
}

/* -------------------------------------------------------------------------- */
/*  Scope tree (Beatles-song-inspired / generic names, no real clients)       */
/* -------------------------------------------------------------------------- */

function tenant(id: string, name: string): ScopeNode {
  return { id, name, level: "tenant" };
}
function property(id: string, name: string, tenants: ScopeNode[]): ScopeNode {
  return { id, name, level: "property", children: tenants };
}

export const SCOPE_TREE: ScopeNode[] = [
  {
    id: "pf-abbey-road",
    name: "Abbey Road Portfolio",
    level: "portfolio",
    children: [
      {
        id: "ent-strawberry",
        name: "Strawberry Fields Holding B.V.",
        level: "entity",
        children: [
          property("prop-eleanor", "Eleanor Court", [
            tenant("ten-lucy", "Lucy Diamond Studio B.V."),
            tenant("ten-rigbyco", "Rigby & Co"),
          ]),
          property("prop-rigby", "Rigby Tower", [
            tenant("ten-maxwell", "Maxwell Silver Ltd."),
          ]),
          property("prop-octopus", "Octopus Garden", [
            tenant("ten-jude", "Jude & Partners"),
            tenant("ten-prudence", "Prudence Media B.V."),
          ]),
          property("prop-lucy", "Lucy Heights", [
            tenant("ten-rita", "Rita Capital"),
          ]),
          property("prop-penny1", "Penny Lane 1", [
            tenant("ten-michelle", "Michelle Media B.V."),
            tenant("ten-julia", "Julia Ventures"),
          ]),
        ],
      },
      {
        id: "ent-norwegian",
        name: "Norwegian Wood B.V.",
        level: "entity",
        children: [
          property("prop-maxwell-house", "Maxwell House", [
            tenant("ten-jude2", "Jude & Partners"),
          ]),
          property("prop-abbey-house", "Abbey House", [
            tenant("ten-prudence2", "Prudence Media B.V."),
            tenant("ten-rita2", "Rita Capital"),
          ]),
          property("prop-michelle-court", "Michelle Court", [
            tenant("ten-lucy2", "Lucy Diamond Studio B.V."),
          ]),
        ],
      },
    ],
  },
  {
    id: "pf-penny-lane",
    name: "Penny Lane Retail Fund",
    level: "portfolio",
    children: [
      {
        id: "ent-blackbird",
        name: "Blackbird Capital B.V.",
        level: "entity",
        children: [
          property("prop-blackbird", "Blackbird Place", [
            tenant("ten-maxwell3", "Maxwell Silver Ltd."),
            tenant("ten-rita3", "Rita Capital"),
          ]),
          property("prop-ladymadonna", "Lady Madonna Plaza", [
            tenant("ten-michelle3", "Michelle Media B.V."),
          ]),
        ],
      },
    ],
  },
];

const LEVEL_ORDER: ScopeLevel[] = ["portfolio", "entity", "property", "tenant"];

/** Flatten the tree into a list of nodes, each with its parent id. */
export function flattenScope(
  nodes: ScopeNode[] = SCOPE_TREE,
  parentId: string | null = null,
  acc: { node: ScopeNode; parentId: string | null }[] = [],
): { node: ScopeNode; parentId: string | null }[] {
  for (const node of nodes) {
    acc.push({ node, parentId });
    if (node.children) flattenScope(node.children, node.id, acc);
  }
  return acc;
}

export function findScopeNode(id: string): ScopeNode | undefined {
  return flattenScope().find((e) => e.node.id === id)?.node;
}

export function scopeNodesAtLevel(level: ScopeLevel): ScopeNode[] {
  return flattenScope()
    .filter((e) => e.node.level === level)
    .map((e) => e.node);
}

/** Immediate children of a node (one level down) — used for chip count + tooltip. */
export function coveredChildren(id: string): ScopeNode[] {
  return findScopeNode(id)?.children ?? [];
}

/** Count of descendants at the next meaningful level, for the "N properties" summary. */
function descendantsAtLevel(node: ScopeNode, level: ScopeLevel): ScopeNode[] {
  const out: ScopeNode[] = [];
  const walk = (n: ScopeNode) => {
    if (n.level === level) out.push(n);
    n.children?.forEach(walk);
  };
  node.children?.forEach(walk);
  return out;
}

export const SCOPE_LEVEL_LABEL: Record<ScopeLevel, string> = {
  portfolio: "Portfolio",
  entity: "Entity",
  property: "Property",
  tenant: "Tenant",
};

export const SCOPE_LEVEL_PLURAL: Record<ScopeLevel, string> = {
  portfolio: "portfolios",
  entity: "entities",
  property: "properties",
  tenant: "tenants",
};

/** e.g. "2 entities · 8 properties in scope". */
export function scopeSummaryLine(
  scope: ScopeSelection,
  translate: (key: string) => string = (k) => k,
): string {
  if (!scope.level || scope.ids.length === 0) return translate("No scope selected");
  const level = scope.level;
  const nodes = scope.ids
    .map((id) => findScopeNode(id))
    .filter((n): n is ScopeNode => Boolean(n));
  const count = nodes.length;
  const nextLevel = LEVEL_ORDER[LEVEL_ORDER.indexOf(level) + 1];
  const word = (lvl: ScopeLevel, singular: boolean) =>
    singular ? translate(SCOPE_LEVEL_LABEL[lvl]).toLowerCase() : translate(SCOPE_LEVEL_PLURAL[lvl]);
  const inScope = (text: string) => translate("{summary} in scope").replace("{summary}", text);
  const head = `${count} ${word(level, count === 1)}`;
  if (!nextLevel) return inScope(head);
  const descendants = nodes.reduce(
    (sum, n) => sum + descendantsAtLevel(n, nextLevel).length,
    0,
  );
  if (descendants === 0) return inScope(head);
  return inScope(`${head} · ${descendants} ${word(nextLevel, false)}`);
}

/** Short label for chips area, e.g. "Strawberry Fields Holding B.V., +1". */
export function scopeShortLabel(scope: ScopeSelection): string {
  if (!scope.level || scope.ids.length === 0) return "No scope";
  const names = scope.ids.map((id) => findScopeNode(id)?.name ?? id);
  if (names.length === 1) return names[0]!;
  return `${names[0]}, +${names.length - 1}`;
}

/* -------------------------------------------------------------------------- */
/*  Analysts                                                                  */
/* -------------------------------------------------------------------------- */

export const AI_ANALYSTS: AnalystDef[] = [
  {
    id: "financial",
    name: "Financial",
    title: "Financial Analyst",
    description:
      "Analyzes financial performance across assets and portfolios, explains budget variances, and highlights what is driving NOI, income, expenses, and returns.",
    templateExamples: ["Monthly Closing Review", "Anomaly Detection", "Budget vs. Actuals"],
    fullyDesigned: true,
    icon: "/icons/analysts/financial.svg",
    colors: { bg: "#E9F1FA", border: "#CFE0F0", text: "#1C4A70", accent: "#2B6FA8" },
  },
  {
    id: "commercial",
    name: "Commercial",
    title: "Commercial Analyst",
    description:
      "Reviews commercial performance, tenant exposure, occupancy movements, rent roll trends, and leasing activity to identify risks and opportunities.",
    templateExamples: ["Upcoming Expiry Watchlist", "Vacancy Monitoring", "Tenant Signals"],
    fullyDesigned: false,
    icon: "/icons/analysts/commercial.svg",
    colors: { bg: "#EDF9F3", border: "#CDEBDB", text: "#0F5C34", accent: "#009951" },
  },
  {
    id: "technical",
    name: "Technical",
    title: "Technical Analyst",
    description:
      "Supports building & facilities operations — maintenance, work orders, CapEx planning, and building systems performance across the portfolio.",
    templateExamples: ["Compliance Monitoring", "Work Order Summary", "CapEx Planning"],
    fullyDesigned: false,
    icon: "/icons/analysts/technical.svg",
    colors: { bg: "#EEF1F4", border: "#DBE1E8", text: "#37434F", accent: "#58687A" },
  },
  {
    id: "debt",
    name: "Debt",
    title: "Debt Analyst",
    description:
      "Tracks debt exposure, maturities, covenants, refinancing risks, interest costs, and debt performance across the portfolio.",
    templateExamples: ["Covenant Monitoring", "Maturity Calendar", "Refinancing Risk"],
    fullyDesigned: false,
    icon: "/icons/analysts/debt.svg",
    colors: { bg: "#FAECE8", border: "#F3D8CE", text: "#74341F", accent: "#B0503A" },
  },
  {
    id: "service-charges",
    name: "Service Charges",
    title: "Service Charges Analyst",
    description:
      "Reconciles service charge costs against tenant advances, tracks cost developments per m², and prepares annual settlements ready for review.",
    templateExamples: ["Service Charge Settlement", "Advance Reconciliation", "Cost Trend Analysis"],
    fullyDesigned: false,
    icon: "/icons/analysts/service-charges.svg",
    colors: { bg: "#FAF2E4", border: "#F3E4C6", text: "#77551A", accent: "#B5822B" },
  },
];

export function getAnalyst(id: AnalystId): AnalystDef | undefined {
  return AI_ANALYSTS.find((a) => a.id === id);
}

/** Link to an analyst page (used by Workspace "Go to analyst"). */
export function analystHref(id: AnalystId): string {
  return `/ai-analysts/${id}`;
}

/* -------------------------------------------------------------------------- */
/*  Templates                                                                 */
/* -------------------------------------------------------------------------- */

export const FINANCIAL_TEMPLATES: TemplateDef[] = [
  {
    id: "tpl-monthly-closing",
    analystId: "financial",
    name: "Monthly Closing Review",
    description:
      "Reviews monthly figures against expectations, flags anomalies and missing entries, and highlights what needs attention before you close the books.",
    defaultScopeLevel: "portfolio",
    defaultFrequency: "monthly",
  },
  {
    id: "tpl-anomaly-detection",
    analystId: "financial",
    name: "Anomaly Detection",
    description:
      "Amiio flags duplicates, unusual amounts and wrong allocations in your financial postings before they affect your figures.",
    defaultScopeLevel: "property",
    defaultFrequency: "once",
  },
  {
    id: "tpl-ar-monitoring",
    analystId: "financial",
    name: "AR Monitoring",
    description:
      "Track accounts receivable and arrears per tenant and flag overdue balances.",
    defaultScopeLevel: "tenant",
    defaultFrequency: "quarterly",
  },
  {
    id: "tpl-budget-actuals",
    analystId: "financial",
    name: "Budget vs. Actuals",
    description:
      "Compare actuals against budget and explain the variances across the portfolio.",
    defaultScopeLevel: "portfolio",
    defaultFrequency: "monthly",
  },
  {
    id: "tpl-annual-budgeting",
    analystId: "financial",
    name: "Annual Budgeting",
    description:
      "Prepare the annual budget per property using prior-year actuals and assumptions.",
    defaultScopeLevel: "property",
    defaultFrequency: "once",
  },
  {
    id: "tpl-capex-cashflow",
    analystId: "financial",
    name: "Capex / Cashflow",
    description:
      "Monitor capital expenditure and cashflow across the portfolio on a weekly basis.",
    defaultScopeLevel: "portfolio",
    defaultFrequency: "weekly",
  },
];

type TemplateSeed = [
  name: string,
  description: string,
  scope: ScopeLevel,
  frequency: FrequencyKind,
];

function templates(analystId: AnalystId, seeds: TemplateSeed[]): TemplateDef[] {
  return seeds.map(([name, description, defaultScopeLevel, defaultFrequency]) => ({
    id: `tpl-${analystId}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    analystId,
    name,
    description,
    defaultScopeLevel,
    defaultFrequency,
  }));
}

const COMMERCIAL_TEMPLATES = templates("commercial", [
  [
    "Upcoming Expiry Watchlist",
    "Monitors leases expiring within a chosen scope and summarizes tenants entering the renewal window, incl. WAULT impact and current vs. market indexation.",
    "portfolio",
    "weekly",
  ],
  [
    "Tenant Satisfaction Signals",
    "Reads every service request and work order, analyzes tone and sentiment, and flags tenants showing signs of frustration before it turns into a non-renewal.",
    "tenant",
    "monthly",
  ],
  [
    "External Tenant Signals",
    "Scans public online sources for tenant developments — bankruptcy filings, restructurings, expansions, acquisitions — that matter for your assets.",
    "tenant",
    "weekly",
  ],
  [
    "Vacancy Monitoring",
    "Tracks every vacant unit, monitors days-on-market and letting progress against targets, and flags units that are stalling.",
    "property",
    "monthly",
  ],
]);

const TECHNICAL_TEMPLATES = templates("technical", [
  [
    "Technical Compliance Monitoring",
    "Tracks all technical certifications across your assets — from elevator inspections to energy labels — and flags upcoming renewals well before they expire.",
    "property",
    "monthly",
  ],
  [
    "Work Order Summary",
    "Summarizes open work orders, aging tickets, and operational bottlenecks across the selected scope.",
    "property",
    "weekly",
  ],
  [
    "CapEx Planning",
    "Surfaces CapEx priorities, planned projects, and spend risk by asset so budgets stay on plan.",
    "portfolio",
    "quarterly",
  ],
  [
    "Maintenance Alerts",
    "Flags overdue maintenance and building systems that need attention soon.",
    "property",
    "daily",
  ],
]);

const DEBT_TEMPLATES = templates("debt", [
  [
    "Covenant Monitoring",
    "Monitors debt covenants against live portfolio data and documentation, flagging headroom changes and potential breaches before they become problems.",
    "entity",
    "monthly",
  ],
  [
    "Maturity Calendar",
    "Surfaces upcoming debt maturities and refinancing windows across the book so nothing catches you by surprise.",
    "portfolio",
    "quarterly",
  ],
  [
    "Refinancing Risk",
    "Assesses refinancing risk, rate exposure, and lender concentration across your facilities.",
    "entity",
    "quarterly",
  ],
  [
    "Interest Cost Review",
    "Summarizes interest costs and what is driving changes in debt service, ICR, and DSCR.",
    "portfolio",
    "monthly",
  ],
]);

const SERVICE_CHARGE_TEMPLATES = templates("service-charges", [
  [
    "Service Charge Settlement",
    "Reconciles actual costs against advances paid, allocates them across tenants, and prepares annual settlements — with full flexibility to adjust before finalizing.",
    "property",
    "yearly",
  ],
  [
    "Service Charge Monitoring",
    "Continuously tracks actual service charge costs against tenant advances and analyzes cost developments per m², flagging overruns while there's still time to act.",
    "property",
    "monthly",
  ],
  [
    "Advance Reconciliation",
    "Matches advance payments per tenant against actual ledgers and highlights under- or over-recovery early.",
    "tenant",
    "quarterly",
  ],
  [
    "Cost Trend Analysis",
    "Analyzes cost developments per m² and flags unusual trends across your assets.",
    "portfolio",
    "quarterly",
  ],
]);

const TEMPLATES_BY_ANALYST: Record<AnalystId, TemplateDef[]> = {
  financial: FINANCIAL_TEMPLATES,
  commercial: COMMERCIAL_TEMPLATES,
  technical: TECHNICAL_TEMPLATES,
  debt: DEBT_TEMPLATES,
  "service-charges": SERVICE_CHARGE_TEMPLATES,
};

export function getTemplatesForAnalyst(id: AnalystId): TemplateDef[] {
  return TEMPLATES_BY_ANALYST[id] ?? [];
}

export function getTemplate(id: string): TemplateDef | undefined {
  return Object.values(TEMPLATES_BY_ANALYST)
    .flat()
    .find((t) => t.id === id);
}

export const FREQUENCY_LABEL: Record<FrequencyKind, string> = {
  once: "One-time",
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  quarterly: "Quarterly",
  yearly: "Yearly",
};

/* -------------------------------------------------------------------------- */
/*  Seed tasks + sources                                                      */
/* -------------------------------------------------------------------------- */

const now = Date.UTC(2026, 7, 1, 9, 0, 0); // Aug 1, 2026 baseline

function sampleOutput(name: string, version: string, date: string, summary: string) {
  return {
    id: `out-${Math.random().toString(36).slice(2, 8)}`,
    date,
    version,
    name,
    summary,
    preview:
      `${name}\n\n${summary}\n\n` +
      "1. Executive summary\nThe portfolio performed in line with expectations this period, " +
      "with annualised rental income up and occupancy holding steady.\n\n" +
      "2. Key movements\n- Rental income: +3.2% vs prior period\n- Operating expenses: +1.1%\n" +
      "- Net operating income: +4.0%\n\n3. Flagged items\nTwo transactions exceeded the anomaly " +
      "threshold and are listed for review. No further action required at this stage.",
  };
}

export const SEED_TASKS: Task[] = [
  {
    id: "task-anomaly-detection",
    analystId: "financial",
    type: "template",
    templateId: "tpl-anomaly-detection",
    name: "Anomaly Detection",
    description: "Scan ledgers for unusual transactions and surface anomalies for review.",
    scope: { level: "entity", ids: ["ent-strawberry"] },
    instructions:
      "Flag any transaction that deviates more than 10% from the trailing three-month average and summarise the likely cause.",
    sharedWithIds: [],
    frequency: {
      kind: "monthly",
      time: "09:00",
      timezone: "Europe/Amsterdam",
      monthlyOn: "The first business day",
    },
    subtasks: [
      {
        id: "sub-anomaly-1",
        name: "Eleanor Court anomalies",
        scope: { level: "property", ids: ["prop-eleanor"] },
        includeGeneralInstruction: true,
        instructions: "Pay special attention to service charge postings.",
        recipientIds: ["u-john"],
        status: "active",
      },
      {
        id: "sub-anomaly-2",
        name: "Rigby Tower anomalies",
        scope: { level: "property", ids: ["prop-rigby"] },
        includeGeneralInstruction: true,
        instructions: "",
        recipientIds: [],
        status: "active",
      },
      {
        id: "sub-anomaly-3",
        name: "Octopus Garden anomalies",
        scope: { level: "property", ids: ["prop-octopus"] },
        includeGeneralInstruction: false,
        instructions: "Only review capex-related ledgers for this property.",
        recipientIds: ["u-jude"],
        status: "active",
      },
    ],
    ownerId: "u-sarah",
    status: "active",
    sourceIds: ["src-fin-1"],
    versions: [
      {
        id: "ver-anomaly-1",
        label: "v1.0",
        createdOn: "Aug 1, 2026",
        owner: "Sarah Lee",
        lastModified: "Aug 1, 2026",
      },
    ],
    outputs: [
      sampleOutput("Anomaly Detection — August", "v1.0", "Aug 3, 2026", "2 anomalies flagged across 3 properties."),
      sampleOutput("Anomaly Detection — September", "v1.0", "Sep 1, 2026", "No anomalies above threshold this period."),
    ],
    createdAt: now,
  },
  {
    id: "task-monthly-closing",
    analystId: "financial",
    type: "custom",
    name: "Monthly Closing Review",
    description: "Review the monthly close and draft IC-ready commentary.",
    scope: { level: "entity", ids: ["ent-strawberry", "ent-norwegian", "ent-blackbird"] },
    instructions:
      "Summarise the monthly close, highlight the three largest variances and draft commentary suitable for the investment committee.",
    sharedWithIds: ["u-john"],
    frequency: {
      kind: "once",
      time: "09:00",
      timezone: "Europe/Amsterdam",
      date: "2026-08-20",
    },
    subtasks: [],
    ownerId: "u-sarah",
    status: "active",
    sourceIds: [],
    versions: [
      {
        id: "ver-closing-1",
        label: "v1.0",
        createdOn: "Aug 1, 2026",
        owner: "Sarah Lee",
        lastModified: "Aug 1, 2026",
      },
    ],
    outputs: [
      sampleOutput("Monthly Closing Review — August", "v1.0", "Aug 20, 2026", "Close complete. Three variances explained."),
    ],
    createdAt: now + 1000,
  },
  {
    id: "task-expiry-watchlist",
    analystId: "commercial",
    type: "template",
    templateId: "tpl-commercial-upcoming-expiry-watchlist",
    name: "Upcoming Expiry Watchlist",
    description:
      "Monitors leases expiring within the portfolio and summarizes tenants entering the renewal window.",
    scope: { level: "portfolio", ids: ["pf-abbey-road"] },
    instructions:
      "Focus on leases expiring in the next 18 months and include the WAULT impact per entity.",
    sharedWithIds: ["u-rita"],
    frequency: {
      kind: "weekly",
      time: "08:00",
      timezone: "Europe/Amsterdam",
      weekdays: [0],
    },
    subtasks: [],
    ownerId: "u-jude",
    status: "active",
    sourceIds: [],
    versions: [
      {
        id: "ver-expiry-1",
        label: "v1.0",
        createdOn: "Jul 28, 2026",
        owner: "Jude Harrison",
        lastModified: "Jul 28, 2026",
      },
    ],
    outputs: [
      sampleOutput("Upcoming Expiry Watchlist — Week 32", "v1.0", "Aug 3, 2026", "4 leases enter the renewal window this month."),
    ],
    createdAt: now + 2000,
  },
];

export const SEED_SOURCES: Source[] = [
  {
    id: "src-fin-1",
    analystId: "financial",
    name: "Portfolio Accounting Policy.pdf",
    type: "file",
    addedById: "u-sarah",
    addedAt: Date.UTC(2026, 6, 15, 10, 30),
    lastEditedAt: Date.UTC(2026, 6, 15, 10, 30),
  },
  {
    id: "src-fin-2",
    analystId: "financial",
    name: "Market benchmarks",
    type: "link",
    addedById: "u-john",
    addedAt: Date.UTC(2026, 6, 20, 14, 5),
    lastEditedAt: Date.UTC(2026, 6, 22, 9, 0),
    url: "https://example.com/market-benchmarks",
  },
  {
    id: "src-fin-3",
    analystId: "financial",
    name: "Reporting guidelines",
    type: "text",
    addedById: "u-sarah",
    addedAt: Date.UTC(2026, 6, 25, 8, 45),
    lastEditedAt: Date.UTC(2026, 6, 25, 8, 45),
    text: "Always report figures in EUR thousands and round to one decimal place.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Default frequency factory                                                 */
/* -------------------------------------------------------------------------- */

export function defaultFrequencyConfig(kind: FrequencyKind) {
  return {
    kind,
    time: "09:00",
    timezone: "Europe/Amsterdam",
    date: kind === "once" ? "" : undefined,
    weekdays: kind === "weekly" ? [] : undefined,
    monthlyOn: kind === "monthly" ? "The first business day" : undefined,
    quarterlyStart: kind === "quarterly" ? ("Q1" as const) : undefined,
    yearlyMonth: kind === "yearly" ? 0 : undefined,
    yearlyDay: kind === "yearly" ? 1 : undefined,
  };
}
