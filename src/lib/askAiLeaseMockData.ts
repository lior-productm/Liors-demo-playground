/** Figma 1040:59818 — mock tenant names for Ask Amiio lease renewal tenant step. */

export type AskAiTenantOption = {
  id: string;
  name: string;
};

/** Full tenant list in the “Select tenant” dropdown. */
export const ASK_AI_TENANT_MOCK_OPTIONS: AskAiTenantOption[] = [
  { id: "tenant-abc", name: "ABC Holdings B.V." },
  { id: "tenant-scalehub", name: "Hey Jude B.V." },
  { id: "tenant-eiffel", name: "Eiffel Investments LLC" },
  { id: "tenant-stower", name: "S Tower Holdings B.V." },
  { id: "tenant-olympia", name: "Olympia Porperties Ltd." },
  { id: "tenant-skyline", name: "Skyline Real Estate LP" },
  { id: "tenant-tower", name: "Tower Equities Ltd." },
];

/** Quick-select chips (first three tenants in the design). */
export function getAskAiTenantChipOptions(): AskAiTenantOption[] {
  return ASK_AI_TENANT_MOCK_OPTIONS.slice(0, 3);
}

const ENTITY_DISPLAY: Record<string, string> = {
  "Entity X": "Penny Lane",
  "Entity Y": "Penny Lane",
  "Entity Z": "Come Together",
};

const PROPERTY_DISPLAY: Record<string, string> = {
  "Wenckebachweg 90-98": "H.J.E. Wenckebachweg",
  "Herengracht Offices": "Herengracht Offices",
  "Zuidas Tower": "Zuidas Tower",
  "Logistics Hub West": "Logistics Hub West",
};

/** Figma 1040:59930 — user scope confirmation bubble. */
export function formatAskAiScopeUserLine(entity: string, property: string) {
  const entityLabel = ENTITY_DISPLAY[entity] ?? entity;
  const propertyLabel = PROPERTY_DISPLAY[property] ?? property;
  return `${entityLabel}, ${propertyLabel}`;
}

/** Figma 1040:59818 — active tenant picker step. */
export const ASK_AI_TENANT_SELECTION_PROMPT =
  "Here the tenant whose leases expire in the next 6 months. For which tenant do you want to start?";

/** Figma 1040:60063 — condensed prompt in reasoning thread. */
export const ASK_AI_TENANT_SHORT_PROMPT = "For which tenant do you want to start?";

export const ASK_AI_SCOPE_SELECTION_PROMPT = "Which portfolio or assets should it work on?";

/** Figma 1040:60095 — three-step preview inside the executive summary card. */
export const ASK_AI_LEASE_RENEWAL_STEPS = [
  { title: "Proposal Prep", description: "Prepare initial renewal proposal" },
  { title: "Lease Proposal", description: "Draft commercial terms" },
  { title: "Review Proposal", description: "Review your proposal" },
] as const;

export type AskAiExecutiveSummaryContent = {
  preview: string;
  /** Shown after “See more” — multiple paragraphs. */
  fullParagraphs: string[];
};

const EXECUTIVE_SUMMARY_BY_TENANT: Record<string, AskAiExecutiveSummaryContent> = {
  "tenant-scalehub": {
    preview:
      "Hey Jude B.V. has been a tenant since 01-Jul-2019 with 1 successful renewal, demonstrating strong commitment to this location. The current lease expires on 30-Jun-2026 and covers 1,240 m² of office space at €285/m²/year.",
    fullParagraphs: [
      "Payment history is clean: no arrears in the last 36 months and rent has been indexed on schedule. Occupancy at the asset remains above 94%, with Hey Jude representing one of the top three tenants by contracted rent.",
      "Market analysis for comparable Grade A offices within 500 m shows asking rents between €270–€310/m²/year. Recent renewals on the same floor averaged +4.2% on headline rent, with incentives typically limited to 3–6 months rent-free on a 5-year term.",
      "Recommended renewal posture: target €295/m²/year (+3.5%) with a 5-year term, 3 months rent-free, and tenant improvement allowance capped at €45/m². Break option at month 36 is acceptable given tenant credit quality and length of tenure.",
      "Key risks to flag in proposal prep: upcoming capex for lobby refurbishment (passed through via service charge), and two nearby vacancies that may soften negotiating leverage if renewal slips past Q3 2026.",
    ],
  },
  "tenant-abc": {
    preview:
      "ABC Holdings B.V. has been a tenant since 15-Mar-2018 with 2 successful renewals, demonstrating strong commitment to this location. The current lease expires on 31-Dec-2025 and covers 2,180 m² across floors 3–4.",
    fullParagraphs: [
      "ABC has expanded footprint twice since inception and maintains a corporate guarantee from the parent entity. Historical uplift at each renewal averaged +3.8% with stable service charge recovery above 98%.",
      "Comparables in the submarket suggest €240–€265/m²/year for similar floor plates and fit-out quality. Two recent transactions on the street closed at €252/m²/year on 7-year terms with limited incentives.",
      "Recommended renewal posture: €258/m²/year (+2.5%) on a 7-year term with 4 months rent-free and fixed annual indexation capped at 3%. Consider green lease clauses tied to building certification upgrades planned for 2027.",
      "Watch items: ABC’s requested expansion rights on floor 5 (750 m² vacant), and alignment with lender covenants on minimum weighted average unexpired lease term for the asset.",
    ],
  },
  "tenant-eiffel": {
    preview:
      "Eiffel Investments LLC has been a tenant since 01-Jan-2020 with 1 successful renewal, demonstrating strong commitment to this location. The current lease expires on 15-Sep-2026 for 890 m² of fitted office space.",
    fullParagraphs: [
      "Tenant covenant is investment-grade via parent backing; deposit held equals 3 months gross rent. Fit-out contribution at initial letting was €120/m² — amortization completes before expiry, improving landlord economics on renewal.",
      "Micro-location comps indicate €300–€335/m²/year for boutique floors under 1,000 m². Premium to building average is justified by turnkey installation and private terrace access.",
      "Recommended renewal posture: €318/m²/year (+4.0%) with a 5+5-year structure, 2 months rent-free, and stepped rent in years 6–10. Offer first right on adjacent 220 m² suite if vacated before signing.",
      "Risks: Eiffel is evaluating a hybrid work policy that may reduce desk count by ~8%; model scenarios in proposal prep with and without partial give-back of 110 m².",
    ],
  },
  "tenant-stower": {
    preview:
      "S Tower Holdings B.V. has been a tenant since 01-Apr-2017 with 2 renewals on record. The lease expires 28-Feb-2026 for 1,560 m² of office space on floors 8–9.",
    fullParagraphs: [
      "Long tenure supports above-average retention probability; tenant has invested in meeting-suite upgrades in 2023. Service charge variance vs budget is within ±2% for the last four quarters.",
      "Submarket evidence points to €265–€290/m²/year for dual-floor lettings with shared circulation. Incentives on recent 5-year deals averaged 4 months rent-free.",
      "Recommended renewal posture: €278/m²/year (+3.0%), 5-year term, 3 months rent-free, with cap on operating cost pass-through at CPI + 1%.",
    ],
  },
  "tenant-olympia": {
    preview:
      "Olympia Porperties Ltd. has occupied the asset since 10-Nov-2021. Current expiry is 09-Nov-2026 across 720 m² with break option in Nov 2025.",
    fullParagraphs: [
      "Break notice window opens in 90 days — prioritize early engagement to avoid vacancy exposure. Deposit and parent guarantee remain in place through the current term.",
      "Comparable lettings for sub-800 m² suites show €255–€280/m²/year; building guidance is to hold headline rent flat-to-modest uplift given break timing.",
      "Recommended renewal posture: remove break on re-sign, €268/m²/year flat, 5-year term, 2 months rent-free, and fixed service charge reconciliation cap.",
    ],
  },
  "tenant-skyline": {
    preview:
      "Skyline Real Estate LP has been in place since 22-May-2019. Lease end 21-May-2027 covers 3,400 m² — the largest single-tenant exposure on the asset.",
    fullParagraphs: [
      "Concentration risk warrants early renewal dialogue despite distant expiry; tenant accounts for 38% of net rent. Historical indexation has tracked CPI with a 2% collar.",
      "Portfolio comps for large-floor plates support €230–€248/m²/year; prior renewal in 2022 achieved +2.1% with 6 months rent-free on 10-year structure.",
      "Recommended renewal posture: begin exploratory talks in proposal prep with €238/m²/year (+2.5%) and 8-year term; prepare alternative multi-tenant re-let scenario if terms diverge.",
    ],
  },
  "tenant-tower": {
    preview:
      "Tower Equities Ltd. has been a tenant since 05-Aug-2020 with one prior renewal. Expiry 04-Aug-2026 for 1,050 m² on floor 6.",
    fullParagraphs: [
      "Tenant mix is financial services; fit-out is landlord-owned shell with tenant installations revertible. Arrears: none; late payment incidents: zero in 48 months.",
      "Street comps for mid-floor 1,000 m² blocks indicate €275–€298/m²/year. Building ERV model suggests €286/m²/year as midpoint for renewal underwriting.",
      "Recommended renewal posture: €288/m²/year (+3.2%), 5-year term, 3 months rent-free, green upgrade contribution fund €25/m² matched by landlord.",
    ],
  },
};

function defaultExecutiveSummary(tenantName: string): AskAiExecutiveSummaryContent {
  return {
    preview: `${tenantName} has been a tenant with a strong track record at this location. The current lease expires within the next 12 months and covers prime office space at the selected asset.`,
    fullParagraphs: [
      "Rent collection and covenant strength are in line with portfolio averages. No material arrears or disputes are on record for the past 24 months.",
      "Market rents for comparable space suggest modest upside on headline rent, with incentives in line with recent building-level renewals.",
      "Recommended next step: open proposal prep with baseline terms, then refine after tenant feedback and updated comparable set from the asset manager.",
    ],
  };
}

/** Figma 1040:60095 — executive summary blurb (truncated with See more). */
export function getAskAiExecutiveSummary(
  tenantId: string,
  tenantName: string,
): AskAiExecutiveSummaryContent {
  return EXECUTIVE_SUMMARY_BY_TENANT[tenantId] ?? defaultExecutiveSummary(tenantName);
}

export function getAskAiLeaseHandoffIntro(tenantName: string) {
  return `I initiated a new lease renewal workflow for ${tenantName}.`;
}

export const ASK_AI_LEASE_HANDOFF_FOOTER =
  "I gathered tenant data and information, market analysis, recent comparable leases and proposed terms and conditions. ";
export const ASK_AI_LEASE_HANDOFF_CTA_QUESTION = "Do you want to continue the process?";
