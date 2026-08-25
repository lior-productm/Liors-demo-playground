import type { ServiceChargeSettlementStage } from "@/src/types/workflows";

/**
 * Status enum matching the backend design spec (see serviceChargeSettlement.DESIGN.md).
 * The frontend `ServiceChargeSettlementStage` maps 1:1 to these for display/logging.
 */
export const SETTLEMENT_STATUS: Record<ServiceChargeSettlementStage, string> = {
  "anomaly-detection": "ANOMALY_DETECTION_COMPLETED",
  "data-review": "PENDING_USER_REVIEW",
  assumptions: "READY_FOR_SETTLEMENT",
  "settlement-preview": "INITIAL_SETTLEMENT_GENERATED",
};

/** Ordered stages of the service charge settlement process (case status). */
export const SERVICE_CHARGE_STAGES: {
  id: ServiceChargeSettlementStage;
  title: string;
  description: string;
  /** Status label shown for a saved case once this stage is the furthest reached. */
  statusLabel: string;
}[] = [
  {
    id: "anomaly-detection",
    title: "Anomaly Detection",
    description: "Quality-control check on postings",
    statusLabel: "Anomaly detection completed",
  },
  {
    id: "data-review",
    title: "Data Review",
    description: "Confirm findings & data readiness",
    statusLabel: "Pending user review",
  },
  {
    id: "assumptions",
    title: "Assumptions",
    description: "Validate settlement assumptions",
    statusLabel: "Ready for settlement",
  },
  {
    id: "settlement-preview",
    title: "Settlement Preview",
    description: "Interactive draft & Excel output",
    statusLabel: "Initial settlement generated",
  },
] as const;

export function getStageIndex(stage: ServiceChargeSettlementStage): 0 | 1 | 2 | 3 {
  const idx = SERVICE_CHARGE_STAGES.findIndex((s) => s.id === stage);
  return (idx === -1 ? 0 : idx) as 0 | 1 | 2 | 3;
}

export function getStageStatusLabel(stage: ServiceChargeSettlementStage): string {
  return SERVICE_CHARGE_STAGES.find((s) => s.id === stage)?.statusLabel ?? "";
}

export function getSettlementStatus(stage: ServiceChargeSettlementStage): string {
  return SETTLEMENT_STATUS[stage] ?? SETTLEMENT_STATUS["anomaly-detection"];
}

/** Default demo scope. */
export const SERVICE_CHARGE_PROPERTY = "Property Partners";
export const SERVICE_CHARGE_YEAR = "2025";
export const SERVICE_CHARGE_SOURCE_SYSTEM = "Exact";

export type SettlementAnomalySeverity = "error" | "warning" | "info";

export type SettlementAnomaly = {
  id: string;
  severity: SettlementAnomalySeverity;
  title: string;
  detail: string;
  /** e.g. account / supplier reference for context. */
  reference: string;
};

/** Step 1 — anomalies / errors / unusual postings surfaced by the QC check. */
export const SERVICE_CHARGE_ANOMALIES: SettlementAnomaly[] = [
  {
    id: "anom-1",
    severity: "error",
    title: "Invoice booked to the wrong cost category",
    detail:
      "A €12,480 cleaning invoice from supplier Abbey Facilities is posted under “Repairs & Maintenance” instead of “Cleaning”. This would misallocate the cost across tenants.",
    reference: "Account 4200 · Invoice INV-2025-0413",
  },
  {
    id: "anom-2",
    severity: "warning",
    title: "Duplicate posting detected",
    detail:
      "Two identical €3,920 security invoices (same amount, same date) from Strawberry Security appear in December. One is likely a duplicate.",
    reference: "Account 4310 · Invoices INV-8841 / INV-8842",
  },
  {
    id: "anom-3",
    severity: "warning",
    title: "Utility cost outside expected range",
    detail:
      "Electricity for Q3 is 41% above the trailing 4-quarter average with no meter-reading note attached. May indicate an estimated invoice not yet reconciled.",
    reference: "Account 4110 · Period Q3 2025",
  },
  {
    id: "anom-4",
    severity: "info",
    title: "Charging-station invoices not yet allocated",
    detail:
      "€6,150 of EV charging-station invoices are unallocated. You previously allocated these to tenant GHL — please confirm the same treatment for 2025.",
    reference: "Account 4180 · Supplier VoltGrid",
  },
  {
    id: "anom-5",
    severity: "info",
    title: "Non-recoverable cost flagged as recoverable",
    detail:
      "A €2,100 legal fee is currently marked recoverable. Legal costs of this type are typically owner-borne and excluded from the settlement.",
    reference: "Account 4600 · Invoice INV-2025-0502",
  },
];

export type SettlementAssumption = {
  id: string;
  /** Machine key used for calculation + the assumption log. */
  key: "management_fee" | "vat" | "allocation_basis" | "ev_allocation" | "utilities_basis";
  /** The agent's question / assumption statement. */
  question: string;
  /** Short label used in the settlement notes. */
  label: string;
  /** The value the agent assumes / the confirmed answer. */
  defaultAnswer: string;
  /** Quick-reply chips the user can pick. */
  options: string[];
  kind: "confirm" | "choice" | "text";
};

/** Step 3 — assumptions & questions pulled from the Excel notes. */
export const SERVICE_CHARGE_ASSUMPTIONS: SettlementAssumption[] = [
  {
    id: "assume-mgmt-fee",
    key: "management_fee",
    question: "I assume the management fee is 5% of recoverable costs. Please confirm.",
    label: "Management fee",
    defaultAnswer: "5%",
    options: ["Confirm 5%", "Use 3%", "Use 7%"],
    kind: "confirm",
  },
  {
    id: "assume-vat",
    key: "vat",
    question: "I assume VAT is 21%. Please confirm.",
    label: "VAT rate",
    defaultAnswer: "21%",
    options: ["Confirm 21%", "Use 9%", "Use 0%"],
    kind: "confirm",
  },
  {
    id: "assume-allocation",
    key: "allocation_basis",
    question:
      "How should shared costs be allocated between tenants — by leased area (m²) or by an equal split?",
    label: "Allocation basis",
    defaultAnswer: "By leased area (m²)",
    options: ["By leased area (m²)", "Equal split", "Custom per cost"],
    kind: "choice",
  },
  {
    id: "assume-ev",
    key: "ev_allocation",
    question:
      "Should all charging-station invoices be allocated to tenant GHL, as in prior years?",
    label: "EV charging allocation",
    defaultAnswer: "Yes — allocate to tenant GHL",
    options: ["Yes — allocate to GHL", "Split across all tenants"],
    kind: "confirm",
  },
  {
    id: "assume-utilities",
    key: "utilities_basis",
    question:
      "Utility costs — divide based on meter readings where available, and fall back to area for the rest?",
    label: "Utilities basis",
    defaultAnswer: "Meter readings, area fallback",
    options: ["Meter readings, area fallback", "Area only"],
    kind: "confirm",
  },
];

/** Parse a management-fee / VAT answer chip into a decimal rate (e.g. "Use 3%" -> 0.03). */
export function parsePercentAnswer(answer: string | undefined, fallback: number): number {
  if (!answer) return fallback;
  const match = answer.match(/(\d+(?:\.\d+)?)\s*%/);
  if (!match) return fallback;
  return Number(match[1]) / 100;
}

export type SettlementLineItem = {
  id: string;
  /** Cost category. */
  category: string;
  /** How it's allocated (mirrors confirmed assumptions). */
  basis: string;
  /** Recoverable gross cost for the category, in EUR (drives recalculation). */
  grossAmount: number;
  /** True for base cost lines; false for derived lines (e.g. management fee). */
  isBaseCost: boolean;
  /** Contextual note / assumption applied — shown as a hint pill. */
  note?: string;
  /** Analyse-further prompt injected into chat when the row is clicked. */
  analysePrompt: string;
  /** Popover summary shown before "Analyse further". */
  summary: string;
};

/** Step 4/5 — base recoverable cost lines (the eventual Excel rows). */
export const SERVICE_CHARGE_BASE_LINES: SettlementLineItem[] = [
  {
    id: "line-cleaning",
    category: "Cleaning",
    basis: "By leased area (m²)",
    grossAmount: 48220,
    isBaseCost: true,
    note: "Reclassified €12,480 from Repairs (anomaly #1 fixed)",
    summary:
      "Cleaning costs total €48,220 after reclassifying a €12,480 invoice that was mis-posted to Repairs & Maintenance.",
    analysePrompt:
      "the Cleaning line — verify the €12,480 reclassification from Repairs and confirm the per-m² allocation is correct",
  },
  {
    id: "line-security",
    category: "Security",
    basis: "By leased area (m²)",
    grossAmount: 44140,
    isBaseCost: true,
    note: "Duplicate €3,920 invoice removed (anomaly #2)",
    summary:
      "Security costs total €44,140 after removing a duplicate €3,920 December invoice from Strawberry Security.",
    analysePrompt:
      "the Security line — confirm the duplicate invoice was correctly removed and the remaining total is right",
  },
  {
    id: "line-utilities",
    category: "Utilities (electricity, water, heating)",
    basis: "Meter readings, area fallback",
    grossAmount: 96510,
    isBaseCost: true,
    note: "Q3 electricity pending meter reconciliation (anomaly #3)",
    summary:
      "Utilities total €96,510, split by meter readings where available. Q3 electricity is 41% above trend and awaits meter reconciliation.",
    analysePrompt:
      "the Utilities line — the Q3 electricity amount appears high; recalculate using meter readings and flag if an estimate is included",
  },
  {
    id: "line-ev",
    category: "EV charging stations",
    basis: "Allocated to tenant GHL",
    grossAmount: 6150,
    isBaseCost: true,
    note: "Confirmed 100% to tenant GHL",
    summary:
      "€6,150 of EV charging-station costs are allocated entirely to tenant GHL, consistent with prior years.",
    analysePrompt:
      "the EV charging line — confirm 100% allocation to tenant GHL and show the impact if it were split across all tenants",
  },
];

/** Non-recoverable costs excluded from the settlement (from anomaly review). */
export const SERVICE_CHARGE_EXCLUSIONS: { label: string; amount: number; reason: string }[] = [
  {
    label: "Legal fees",
    amount: 2100,
    reason: "Owner-borne — excluded per anomaly #5",
  },
];

export type ComputedSettlement = {
  baseLines: SettlementLineItem[];
  managementFee: SettlementLineItem;
  recoverableSubtotal: number;
  managementFeeRate: number;
  vatRate: number;
  netTotal: number;
  vatAmount: number;
  grossTotal: number;
};

export function formatEuro(value: number): string {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

/**
 * Deterministic recalculation — mirrors the server-side formulas in the design spec.
 * Recompute whenever an assumption changes or an adjustment is applied.
 *
 * @param answers  confirmed assumption answers keyed by assumption id
 * @param overrides optional per-line gross overrides applied by adjustments
 */
export function computeSettlement(
  answers: Record<string, string>,
  overrides: Record<string, number> = {},
): ComputedSettlement {
  const feeAssumption = SERVICE_CHARGE_ASSUMPTIONS.find((a) => a.key === "management_fee");
  const vatAssumption = SERVICE_CHARGE_ASSUMPTIONS.find((a) => a.key === "vat");
  const managementFeeRate = parsePercentAnswer(
    feeAssumption ? answers[feeAssumption.id] : undefined,
    0.05,
  );
  const vatRate = parsePercentAnswer(vatAssumption ? answers[vatAssumption.id] : undefined, 0.21);

  const baseLines = SERVICE_CHARGE_BASE_LINES.map((line) => ({
    ...line,
    grossAmount: overrides[line.id] ?? line.grossAmount,
  }));

  const recoverableSubtotal = baseLines.reduce((sum, line) => sum + line.grossAmount, 0);
  const managementFeeAmount = recoverableSubtotal * managementFeeRate;

  const managementFee: SettlementLineItem = {
    id: "line-management-fee",
    category: `Management fee (${Math.round(managementFeeRate * 100)}%)`,
    basis: `${Math.round(managementFeeRate * 100)}% of recoverable costs`,
    grossAmount: managementFeeAmount,
    isBaseCost: false,
    note: `Assumption confirmed: ${Math.round(managementFeeRate * 100)}%`,
    summary: `The management fee is ${formatEuro(
      managementFeeAmount,
    )}, calculated as ${Math.round(managementFeeRate * 100)}% of total recoverable costs.`,
    analysePrompt:
      "the Management fee line — show the calculation base and confirm the rate was applied to recoverable costs only",
  };

  const netTotal = recoverableSubtotal + managementFeeAmount;
  const vatAmount = netTotal * vatRate;
  const grossTotal = netTotal + vatAmount;

  return {
    baseLines,
    managementFee,
    recoverableSubtotal,
    managementFeeRate,
    vatRate,
    netTotal,
    vatAmount,
    grossTotal,
  };
}

/**
 * Very small NL parser for demo adjustment instructions — returns a per-line gross override
 * so the preview visibly recalculates. Real logic lives server-side (see design spec).
 */
export function parseAdjustmentInstruction(
  instruction: string,
  current: Record<string, number>,
): { overrides: Record<string, number>; reply: string } | null {
  const text = instruction.toLowerCase();
  const amountMatch = instruction.replace(/[,\s]/g, "").match(/€?(\d+(?:\.\d+)?)/);

  const target = SERVICE_CHARGE_BASE_LINES.find((line) => {
    const first = line.category.toLowerCase().split(" ")[0];
    return text.includes(first);
  });

  if (target && amountMatch) {
    const value = Number(amountMatch[1]);
    if (!Number.isNaN(value)) {
      return {
        overrides: { ...current, [target.id]: value },
        reply: `Updated ${target.category} to ${formatEuro(value)} and recalculated the settlement.`,
      };
    }
  }

  // "remove"/"reduce" utilities by an amount
  if (target && (text.includes("reduce") || text.includes("lower") || text.includes("remove")) && amountMatch) {
    const delta = Number(amountMatch[1]);
    const base = current[target.id] ?? target.grossAmount;
    const next = Math.max(0, base - delta);
    return {
      overrides: { ...current, [target.id]: next },
      reply: `Reduced ${target.category} by ${formatEuro(delta)} to ${formatEuro(next)} and recalculated.`,
    };
  }

  return null;
}
