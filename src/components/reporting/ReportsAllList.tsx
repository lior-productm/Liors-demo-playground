import { ALL_REPORTS_LIST } from "@/src/lib/reportingMockData";
import { cn } from "@/lib/utils";

const STATUS_STYLES = {
  "In Review": "bg-[#EEF0FF] text-[#1B32B3]",
  Completed: "bg-[#E8F5E9] text-[#2E7D32]",
  Draft: "bg-[#F3F4F6] text-[#6B7280]",
} as const;

export function ReportsAllList() {
  return (
    <div className="rounded-xl border border-[#E8EAED] bg-white shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)]">
      <div className="grid grid-cols-[1fr_auto_auto] gap-4 border-b border-[#E8EAED] px-6 py-3 text-[12px] font-medium uppercase tracking-wide text-[#6B7280]">
        <span>Report</span>
        <span>Status</span>
        <span>Updated</span>
      </div>
      <ul>
        {ALL_REPORTS_LIST.map((report) => (
          <li
            key={report.title}
            className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-[#E8EAED] px-6 py-4 last:border-b-0"
          >
            <span className="text-[14px] font-medium leading-[1.24] text-[#111]">
              {report.title}
            </span>
            <span
              className={cn(
                "inline-flex rounded-full px-2.5 py-1 text-[12px] font-medium leading-4",
                STATUS_STYLES[report.status],
              )}
            >
              {report.status}
            </span>
            <span className="text-[14px] leading-[1.24] text-[#6B7280]">
              {report.updated}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
