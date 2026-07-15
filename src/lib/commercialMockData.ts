/**
 * Shared commercial-dashboard mock data — keep chart values aligned with
 * property KPIs (GRI €3,146,703, WAULT 4.2 yrs, occupancy 94%, etc.).
 */

export const CHART_YEARS = ["2025", "2026", "2027", "2028", "2029", "2035"] as const;

/** Y-axis ticks for year-bar overview cards (values in €K). */
export const CHART_AXIS_EUR_K = [350, 280, 210, 140, 70, 0] as const;

export const CHART_AXIS_MAX_K = 350;

/** Canonical lease expiry profile — used by Lease Expiry chart + overview cards. */
export const LEASE_EXPIRY_MAX_EUR = 350_000;

export const LEASE_EXPIRY_PROFILE = [
  { year: "2025", euros: 143_243 },
  { year: "2026", euros: 147_843 },
  { year: "2027", euros: 350_000 },
  { year: "2028", euros: 293_243 },
  { year: "2029", euros: 204_054 },
  { year: "2035", euros: 128_378 },
] as const;

export const LEASE_EXPIRY_Y_TICKS_EUR = [
  350_000, 280_000, 210_000, 140_000, 70_000, 0,
] as const;

const ANNUAL_GRI_EUR = 3_146_703;
const MONTHLY_GRI_K = Math.round(ANNUAL_GRI_EUR / 12 / 1000);

/** Lease expiry bars on overview cards (€K) — mirrors LEASE_EXPIRY_PROFILE. */
export const LEASE_EXPIRY_CHART_VALUES_K = LEASE_EXPIRY_PROFILE.map((d) =>
  Math.round(d.euros / 1000),
);

/**
 * Monthly GRI run-rate (€K) — annual GRI €3,146,703 with modest YoY uplift
 * (+4.2% vs budget narrative in property summary).
 */
export const RENTAL_INCOME_TREND_K = [
  MONTHLY_GRI_K - 14,
  MONTHLY_GRI_K - 8,
  MONTHLY_GRI_K,
  MONTHLY_GRI_K + 6,
  MONTHLY_GRI_K + 12,
  MONTHLY_GRI_K + 28,
] as const;

/**
 * Occupied income (€K monthly) — occupancy improving 92% → 96% on GRI base.
 * Aligns with property summary (92% occupancy, +2.3% QoQ).
 */
export const OCCUPANCY_TREND_K = [
  Math.round(MONTHLY_GRI_K * 0.92),
  Math.round(MONTHLY_GRI_K * 0.93),
  Math.round(MONTHLY_GRI_K * 0.94),
  Math.round(MONTHLY_GRI_K * 0.945),
  Math.round(MONTHLY_GRI_K * 0.95),
  Math.round(MONTHLY_GRI_K * 0.96),
] as const;

/**
 * WALT trend (€K bar scale) — WALT declining 5.0 → 3.5 yrs (×60 for shared axis).
 * Matches historical WALT row (4.4 yrs) and hub strip (4.2 yrs).
 */
export const WALT_TREND_K = [300, 288, 276, 252, 234, 210] as const;

export function eurosToChartK(euros: number): number {
  return Math.round(euros / 1000);
}

export function leaseExpiryBarHeightPx(
  euros: number,
  plotH = 288,
  maxEur = LEASE_EXPIRY_MAX_EUR,
): number {
  return Math.round((euros / maxEur) * plotH);
}

export function formatLeaseExpiryAxis(n: number): string {
  return `€${n / 1000}K`;
}

export function formatLeaseExpiryTooltip(n: number): string {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

export type PerformanceVsBudgetRow = {
  label: string;
  actual: string;
  budget: string;
  actualPct: number;
  budgetPct: number;
  delta: string;
};

/** Performance vs budget horizontal bars — aligned with financial mock (NOI €3,036,050). */
export const PERFORMANCE_VS_BUDGET_ROWS: PerformanceVsBudgetRow[] = [
  {
    label: "Income (GRI)",
    actual: "€3,149,596",
    budget: "€3,100,000",
    actualPct: 92,
    budgetPct: 88,
    delta: "↗ 1.6%",
  },
  {
    label: "NOI",
    actual: "€3,036,050",
    budget: "€2,963,640",
    actualPct: 85,
    budgetPct: 78,
    delta: "↗ 2.4%",
  },
  {
    label: "OPEX",
    actual: "€812,460",
    budget: "€850,000",
    actualPct: 55,
    budgetPct: 50,
    delta: "↘ 4.4%",
  },
  {
    label: "CAPEX",
    actual: "€575,200",
    budget: "€620,000",
    actualPct: 65,
    budgetPct: 60,
    delta: "↘ 7.2%",
  },
  {
    label: "Debt service",
    actual: "€935,000",
    budget: "€920,000",
    actualPct: 66,
    budgetPct: 62,
    delta: "↗ 1.6%",
  },
];

export type OverviewBarChartMock = {
  title: string;
  color: string;
  chatTopic: string;
  chatLabel: string;
  values: readonly number[];
  valueSuffix?: string;
};

export const PORTFOLIO_OVERVIEW_BAR_CHARTS: OverviewBarChartMock[] = [
  {
    title: "Rental Income Trend",
    color: "#2437B8",
    chatTopic:
      "Review rental income trend, inflection points, and current leasing momentum.",
    chatLabel: "Rental Income Trend",
    values: RENTAL_INCOME_TREND_K,
    valueSuffix: "K/mo",
  },
  {
    title: "WALT Trend",
    color: "#7B8CEB",
    chatTopic: "Explain WALT trend and upcoming lease expiry pressure.",
    chatLabel: "WALT Trend",
    values: WALT_TREND_K,
    valueSuffix: " yrs index",
  },
  {
    title: "Occupancy Trend",
    color: "#303552",
    chatTopic: "Explain occupancy trend and what is driving the current level.",
    chatLabel: "Occupancy Trend",
    values: OCCUPANCY_TREND_K,
    valueSuffix: "K/mo",
  },
  {
    title: "Lease Expiry",
    color: "#70A4AC",
    chatTopic:
      "Review lease expiry concentration and highlight the biggest near-term rollover years.",
    chatLabel: "Lease Expiry",
    values: LEASE_EXPIRY_CHART_VALUES_K,
    valueSuffix: "K",
  },
];

export function formatOverviewBarTooltip(
  year: string,
  valueK: number,
  chartTitle: string,
): string {
  switch (chartTitle) {
    case "Lease Expiry": {
      const row = LEASE_EXPIRY_PROFILE.find((d) => d.year === year);
      return row
        ? `${year}: ${formatLeaseExpiryTooltip(row.euros)} expiring`
        : `${year}: €${valueK}K expiring`;
    }
    case "Rental Income Trend":
      return `${year}: €${valueK}K/mo GRI run-rate`;
    case "Occupancy Trend":
      return `${year}: €${valueK}K/mo occupied income`;
    case "WALT Trend":
      return `${year}: ${(valueK / 60).toFixed(1)} yrs WALT`;
    default:
      return `${year}: €${valueK}K`;
  }
}
