/**
 * Amiio Design Vision tokens — Financial dashboard frame (830:52765).
 * Typography maps to `.typo-*` utilities in app/globals.css.
 */
export const DS_COLORS = {
  primary1100: "#010309",
  neutral900: "#353638",
  neutral800: "#2E3033",
  neutral800Chart: "#2C2C2C",
  neutral700: "#65686B",
  neutral600: "#7E8185",
  neutral500: "#969A9E",
  neutral400: "#B3B8BD",
  neutral300: "#D1D5D9",
  neutral200: "#E6E8EB",
  neutral150: "rgba(230, 231, 232, 0.7)",
  success700: "#1F9E8B",
  success100: "#E6F6F3",
  error700: "#9F2D3A",
  error100: "#FBEAEC",
  tertiary700: "#1B32B3",
  tertiary400: "#7B8CEB",
  tertiary300: "#A7B2F2",
  tertiary200: "#D3D9F8",
  white100: "#F0F2F5",
} as const;

/** Figma line chart series — Income / Expense / Profit */
export const DS_CHART = {
  income: DS_COLORS.tertiary700,
  expense: DS_COLORS.tertiary400,
  profit: DS_COLORS.success700,
  grid: DS_COLORS.neutral200,
  axis: DS_COLORS.neutral700,
  legend: DS_COLORS.neutral800Chart,
} as const;

export const DS_CARD_GRADIENT =
  "linear-gradient(-88deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.9) 100%)";

/** Metric tile — 8px radius, 20px padding, gradient fill */
export const dsMetricCard =
  "rounded-[8px] border border-[#E6E8EB] p-5 bg-white";

/** Chart widget — 8px radius, 24px padding, gradient fill */
export const dsChartCard =
  "rounded-[8px] border border-[rgba(230,231,232,0.7)] p-6 bg-white";

/** Large dashboard panel — P&L table, minor metrics strip */
export const dsPanelCard =
  "rounded-[24px] border border-[rgba(230,231,232,0.85)] bg-white shadow-[0px_2px_12px_rgba(0,0,0,0.04)]";

/** Figma Widget Filter pill */
export const dsWidgetFilter =
  "inline-flex h-6 items-center justify-between gap-2 rounded-[35px] border border-[#D1D5D9] bg-[#E6E8EB] px-3 py-1 typo-l3-b text-[#676A6E]";

/** Shared 204×203 doughnut ring — GRI (Commercial) + Operational Expenses (Financial). */
export const DS_DONUT_204 = {
  width: 204,
  height: 203,
  outerRadius: 101,
  innerRadius: 76,
  centerInset: {
    top: "18%",
    right: "22%",
    bottom: "18%",
    left: "22%",
  },
} as const;

/**
 * Financial dashboard typography — aligned with Commercial overview widgets
 * (OverviewTrendBarChartCard, PortfolioOverviewView KPI cards, MajorMetricCard).
 */
export const dsFinTypo = {
  widgetTitle: "typo-h4 text-[#353638]",
  sectionTitle: "typo-h5 text-[#2C2C2C]",
  kpiLabel: "typo-l3-b text-[#676A6E]",
  kpiValue: "text-[22px] font-semibold leading-tight tracking-tight tabular-nums text-[#010309]",
  kpiValueMd: "typo-h3 tabular-nums text-[#353638]",
  kpiSub: "typo-l3-r text-[#7E8185]",
  kpiSubMuted: "typo-l3-b text-[#969A9E]",
  body: "typo-p2-r text-[#353638]",
  bodySm: "typo-p3-r text-[#353638]",
  meta: "typo-l3-r text-[#65686B]",
  rowTitle: "typo-l2-b font-semibold text-[#2C2C2C]",
  rowValue: "typo-l2-b font-semibold tabular-nums text-[#353638]",
  tableHeader: "typo-l3-b uppercase tracking-[0.04em] text-[#969A9E]",
  tableCell: "typo-l2-r tabular-nums text-[#353638]",
  tableCellMedium: "typo-l2-b tabular-nums text-[#353638]",
  tableCellStrong: "typo-l2-b font-semibold tabular-nums text-[#010309]",
  link: "typo-l2-b text-[#233FDE] underline-offset-2 hover:underline",
  btn: "typo-l2-b",
  btnPrimary: "typo-l2-b text-white",
  analyseBtn: "typo-l2-b text-[#353638]",
  badge: "typo-l3-b font-semibold",
  alertTitle: "typo-h5 font-semibold text-[#146B3A]",
  chartAxis: "typo-chart-axis text-[#65686B]",
  chartLegend: "typo-l2-r text-[#65686B]",
  chartLegendValue: "typo-l2-b tabular-nums text-[#121212]",
  chartFilter: dsWidgetFilter,
  donutCenterLabel: "typo-l2-r text-[#65686B]",
  donutCenterValue: "typo-h2 tabular-nums text-[#303552]",
} as const;
