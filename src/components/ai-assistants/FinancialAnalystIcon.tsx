import { cn } from "@/lib/utils";

/** Financial Analyst glyph — banknote with currency mark. */
export function FinancialAnalystIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-6 text-[#4F65E5]", className)}
      aria-hidden
    >
      <rect
        x="2.25"
        y="6"
        width="19.5"
        height="12"
        rx="2.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="12"
        r="2.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 9.75V14.25M18 9.75V14.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
