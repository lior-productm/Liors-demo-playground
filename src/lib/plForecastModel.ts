import type { ReportPlRow } from "@/src/lib/reportingMockData";

/** Accounts the user can type into (budget + FY forecast). */
export const PL_FORECAST_INPUT_ACCOUNTS = new Set([
  "Rental income",
  "Taxes & Insurance",
  "Management fees",
  "Other general expenses",
  "Depreciation",
  "Financial expenses",
  "Capital distributions / Contributions",
  "Loan repayment",
  "Changes in WC",
]);

export type ForecastExplanation = {
  id: string;
  title: string;
  formula: string;
  result: string;
  /** Account labels whose edit should highlight this explanation. */
  drivenBy: string[];
};

export function parseEuro(value?: string): number {
  if (!value) return 0;
  const trimmed = value.trim();
  if (!trimmed || trimmed === "-" || trimmed === "€" || trimmed === "€-") return 0;
  const parenNegative = /^\(.*\)$/.test(trimmed);
  const negative = parenNegative || /[-−]/.test(trimmed.replace(/^€/, ""));
  const digits = trimmed.replace(/[^0-9]/g, "");
  if (!digits) return 0;
  const amount = Number.parseInt(digits, 10);
  if (!Number.isFinite(amount)) return 0;
  return negative ? -amount : amount;
}

export function formatEuro(amount: number): string {
  const rounded = Math.round(amount);
  const grouped = Math.abs(rounded)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  if (rounded < 0) return `€-${grouped}`;
  return `€${grouped}`;
}

export function formatVariance(amount: number): string {
  if (amount === 0) return "-";
  return formatEuro(amount);
}

function byAccount(rows: ReportPlRow[], account: string): ReportPlRow | undefined {
  return rows.find((row) => row.account === account);
}

function amount(row: ReportPlRow | undefined, field: "budget" | "q1Actual"): number {
  return parseEuro(row?.[field]);
}

function setComputed(
  row: ReportPlRow | undefined,
  budget: number,
  forecast: number,
): ReportPlRow | undefined {
  if (!row) return row;
  return {
    ...row,
    budget: formatEuro(budget),
    q1Actual: formatEuro(forecast),
    vsBudget: formatVariance(forecast - budget),
  };
}

/**
 * Recalculate totals, NOI, profit, cash flow and variances from input lines.
 * `preserve` keeps the cell the user is typing so it is not reformatted mid-keystroke.
 */
export function recomputePlForecast(
  rows: ReportPlRow[],
  preserve?: { index: number; field: "budget" | "q1Actual" | "account" | "vsBudget" },
): { rows: ReportPlRow[]; explanations: ForecastExplanation[] } {
  const rental = byAccount(rows, "Rental income");
  const taxes = byAccount(rows, "Taxes & Insurance");
  const mgmt = byAccount(rows, "Management fees");
  const other = byAccount(rows, "Other general expenses");
  const depreciation = byAccount(rows, "Depreciation");
  const financial = byAccount(rows, "Financial expenses");
  const distributions = byAccount(rows, "Capital distributions / Contributions");
  const loan = byAccount(rows, "Loan repayment");
  const wc = byAccount(rows, "Changes in WC");
  const opening = byAccount(rows, "Start of the year");

  const rentalB = amount(rental, "budget");
  const rentalF = amount(rental, "q1Actual");
  const taxesB = amount(taxes, "budget");
  const taxesF = amount(taxes, "q1Actual");
  const mgmtB = amount(mgmt, "budget");
  const mgmtF = amount(mgmt, "q1Actual");
  const otherB = amount(other, "budget");
  const otherF = amount(other, "q1Actual");
  const depB = amount(depreciation, "budget");
  const depF = amount(depreciation, "q1Actual");
  const finB = amount(financial, "budget");
  const finF = amount(financial, "q1Actual");
  const distB = amount(distributions, "budget");
  const distF = amount(distributions, "q1Actual");
  const loanB = amount(loan, "budget");
  const loanF = amount(loan, "q1Actual");
  const wcB = amount(wc, "budget");
  const wcF = amount(wc, "q1Actual");
  const openingCash = amount(opening, "q1Actual");

  const incomeB = rentalB;
  const incomeF = rentalF;
  const opexB = taxesB + mgmtB + otherB;
  const opexF = taxesF + mgmtF + otherF;
  const noiB = incomeB - opexB;
  const noiF = incomeF - opexF;
  const profitB = noiB - depB - finB;
  const profitF = noiF - depF - finF;
  const ncfB = profitB - distB - loanB - wcB;
  const ncfF = profitF - distF - loanF - wcF;
  const closingF = openingCash + ncfF;

  const next = rows.map((row, index) => {
    let updated: ReportPlRow = { ...row };

    if (row.kind !== "column-header" && row.kind !== "bank-start" && row.kind !== "bank-end") {
      const budget = parseEuro(row.budget);
      const forecast = parseEuro(row.q1Actual);
      if (PL_FORECAST_INPUT_ACCOUNTS.has(row.account)) {
        updated = {
          ...updated,
          vsBudget: formatVariance(forecast - budget),
        };
      }
    }

    if (row.account === "Total Income") {
      updated = setComputed(row, incomeB, incomeF) ?? updated;
    } else if (row.account === "Total expenses") {
      updated = setComputed(row, opexB, opexF) ?? updated;
    } else if (row.account === "NOI") {
      updated = setComputed(row, noiB, noiF) ?? updated;
    } else if (row.kind === "profit") {
      updated = setComputed(row, profitB, profitF) ?? updated;
    } else if (row.account === "Levered net cash flow") {
      updated = setComputed(row, ncfB, ncfF) ?? updated;
    } else if (row.kind === "bank-end") {
      updated = {
        ...row,
        q1Actual: formatEuro(closingF),
        vsBudget: "",
      };
    }

    if (preserve && preserve.index === index) {
      const field = preserve.field;
      if (field === "budget" || field === "q1Actual" || field === "account" || field === "vsBudget") {
        return { ...updated, [field]: rows[index][field] };
      }
    }
    return updated;
  });

  const explanations: ForecastExplanation[] = [
    {
      id: "variance",
      title: "Forecast vs Budget",
      formula: "FY Forecast − Budget FY",
      result: "Each line variance updates as you edit budget or forecast.",
      drivenBy: [...PL_FORECAST_INPUT_ACCOUNTS],
    },
    {
      id: "income",
      title: "Total income",
      formula: `Rental income = ${formatEuro(incomeF)}`,
      result: formatEuro(incomeF),
      drivenBy: ["Rental income"],
    },
    {
      id: "opex",
      title: "Total expenses",
      formula: `Taxes & Insurance + Management fees + Other general expenses = ${formatEuro(taxesF)} + ${formatEuro(mgmtF)} + ${formatEuro(otherF)}`,
      result: formatEuro(opexF),
      drivenBy: ["Taxes & Insurance", "Management fees", "Other general expenses"],
    },
    {
      id: "noi",
      title: "NOI",
      formula: `Total income − Total expenses = ${formatEuro(incomeF)} − ${formatEuro(opexF)}`,
      result: formatEuro(noiF),
      drivenBy: [
        "Rental income",
        "Taxes & Insurance",
        "Management fees",
        "Other general expenses",
      ],
    },
    {
      id: "profit",
      title: "Profit",
      formula: `NOI − Depreciation − Financial expenses = ${formatEuro(noiF)} − ${formatEuro(depF)} − ${formatEuro(finF)}`,
      result: formatEuro(profitF),
      drivenBy: [
        "Rental income",
        "Taxes & Insurance",
        "Management fees",
        "Other general expenses",
        "Depreciation",
        "Financial expenses",
      ],
    },
    {
      id: "ncf",
      title: "Levered net cash flow",
      formula: `Profit − Distributions − Loan repayment − Changes in WC = ${formatEuro(profitF)} − ${formatEuro(distF)} − ${formatEuro(loanF)} − ${formatEuro(wcF)}`,
      result: formatEuro(ncfF),
      drivenBy: [
        "Rental income",
        "Taxes & Insurance",
        "Management fees",
        "Other general expenses",
        "Depreciation",
        "Financial expenses",
        "Capital distributions / Contributions",
        "Loan repayment",
        "Changes in WC",
      ],
    },
    {
      id: "closing",
      title: "End of year cash",
      formula: `Start of the year + Levered net cash flow = ${formatEuro(openingCash)} + ${formatEuro(ncfF)}`,
      result: formatEuro(closingF),
      drivenBy: ["Start of the year", ...PL_FORECAST_INPUT_ACCOUNTS],
    },
  ];

  return { rows: next, explanations };
}

export function isPlForecastInputCell(
  row: ReportPlRow,
  field: "account" | "budget" | "q1Actual" | "vsBudget",
): boolean {
  if (field === "account" || field === "vsBudget") return false;
  if (row.kind === "bank-start") return field === "q1Actual";
  if (row.kind === "bank-end" || row.kind === "column-header") return false;
  if (row.kind === "subtotal" || row.kind === "highlight" || row.kind === "profit") {
    return false;
  }
  return PL_FORECAST_INPUT_ACCOUNTS.has(row.account) && (field === "budget" || field === "q1Actual");
}

export type ForecastInsight = {
  id: string;
  title: string;
  body: string[];
  scrollTarget: string;
  anchorOffsetPx: number;
  reviewed: boolean;
};

/** Insights for the report rail, derived from the live P&L forecast formulas. */
export function buildForecastInsights(
  sectionId: string,
  rows: ReportPlRow[],
): ForecastInsight[] {
  const { explanations } = recomputePlForecast(rows);
  return explanations
    .filter((item) => item.id !== "variance")
    .map((item, index) => ({
      id: `forecast-${sectionId}-${item.id}`,
      title: `${item.title} is ${item.result}`,
      body: [
        item.formula,
        "This updates live as budget and FY forecast figures are edited in the P&L.",
      ],
      scrollTarget: sectionId,
      anchorOffsetPx: 72 + index * 36,
      reviewed: false,
    }));
}
