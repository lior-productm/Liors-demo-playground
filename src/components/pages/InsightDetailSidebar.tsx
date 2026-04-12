"use client";

import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Download, Eye, FileSpreadsheet, FileText, Landmark, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { InsightActionButtons } from "@/src/components/pages/InsightActionButtons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  KANBAN_COLUMNS,
  kanbanStatusTagClass,
  type InsightCardModel,
  type KanbanColumnId,
} from "@/src/components/pages/InsightsManageInsightsSection";

type AttachmentItem = {
  id: string;
  name: string;
  meta: string;
  iconBg: string;
  icon: LucideIcon;
};

type CommentItem = {
  id: string;
  author: string;
  initials: string;
  when: string;
  body: string;
};

type SidebarPack = {
  attachments: AttachmentItem[];
  comments: CommentItem[];
  descriptionExtra: string;
};

const DEFAULT_PACK: SidebarPack = {
  attachments: [
    {
      id: "a1",
      name: "Portfolio evidence pack.xlsx",
      meta: "09:12 AM, 3 Dec 2024",
      iconBg: "bg-[#EBF0FE]",
      icon: FileSpreadsheet,
    },
    {
      id: "a2",
      name: "Asset manager briefing.pdf",
      meta: "15:48 PM, 2 Dec 2024",
      iconBg: "bg-[#F2F4F7]",
      icon: FileText,
    },
  ],
  comments: [
    {
      id: "c1",
      author: "Elena Visser",
      initials: "EV",
      when: "18 Feb 2025",
      body: "Can we align this trigger with the latest budget cycle assumptions?",
    },
    {
      id: "c2",
      author: "Tom Hendriks",
      initials: "TH",
      when: "Just now",
      body: "Any update from property finance on the underlying GL lines?",
    },
  ],
  descriptionExtra:
    "This insight is evaluated against your portfolio rules and rent roll / accounting feeds. Adjust thresholds in Manage Insights or ask Amiio for a variance narrative and next actions.",
};

const RENTAL_INCOME_PACK: SidebarPack = {
  attachments: [
    {
      id: "a1",
      name: "Rent roll — income lines (export).xlsx",
      meta: "08:45 AM, 10 Dec 2024",
      iconBg: "bg-[#EBF0FE]",
      icon: FileSpreadsheet,
    },
    {
      id: "a2",
      name: "Lease schedule — affected units.pdf",
      meta: "14:20 PM, 9 Dec 2024",
      iconBg: "bg-[#F2F4F7]",
      icon: FileText,
    },
  ],
  comments: [
    {
      id: "c1",
      author: "Marta Kowalski",
      initials: "MK",
      when: "21 Jan 2025",
      body: "Does the €3.000 minimum still hold after the Q3 indexation on the retail strip?",
    },
    {
      id: "c2",
      author: "Jim Duddley",
      initials: "JD",
      when: "Just now",
      body: "Please link the dip to vacant units vs rent-free — need that split for IC.",
    },
  ],
  descriptionExtra:
    "Rental income movements are checked against lease events, indexation, and vacancy. Use attached rent roll export to reconcile to GL; Amiio can summarise drivers by asset.",
};

const EXPENSE_PACK: SidebarPack = {
  attachments: [
    {
      id: "a1",
      name: "OPEX / G&A bridge — YTD.xlsx",
      meta: "11:05 AM, 8 Dec 2024",
      iconBg: "bg-[#EBF0FE]",
      icon: FileSpreadsheet,
    },
    {
      id: "a2",
      name: "Cost centre mapping notes.pdf",
      meta: "16:30 PM, 7 Dec 2024",
      iconBg: "bg-[#FEFAF2]",
      icon: FileText,
    },
  ],
  comments: [
    {
      id: "c1",
      author: "Finance Ops",
      initials: "FO",
      when: "5 Feb 2025",
      body: "Flag if any reclasses hit after the November close — we rebased the benchmark.",
    },
    {
      id: "c2",
      author: "Sanne de Vries",
      initials: "SV",
      when: "Just now",
      body: "Happy to walk through the Z C.V. entity filter if this is entity-specific.",
    },
  ],
  descriptionExtra:
    "Expense insights compare actuals to budget and prior periods across the selected scope. Attachments support reconciliation to property and entity-level reporting packs.",
};

const OPEX_PACK: SidebarPack = {
  attachments: [
    {
      id: "a1",
      name: "Consecutive OPEX months — trend.xlsx",
      meta: "07:50 AM, 5 Dec 2024",
      iconBg: "bg-[#EBF0FE]",
      icon: FileSpreadsheet,
    },
    {
      id: "a2",
      name: "Property OPEX commentary.pdf",
      meta: "13:15 PM, 4 Dec 2024",
      iconBg: "bg-[#F2F4F7]",
      icon: FileText,
    },
  ],
  comments: [
    {
      id: "c1",
      author: "Asset lead — North",
      initials: "AN",
      when: "12 Jan 2025",
      body: "Check if energy pass-through is distorting the run-rate before we escalate.",
    },
    {
      id: "c2",
      author: "Elena Visser",
      initials: "EV",
      when: "Just now",
      body: "Do we have the same pattern on the peer assets in the cluster?",
    },
  ],
  descriptionExtra:
    "OPEX trend detection looks at month-on-month behaviour and materiality vs your rules. Use the trend workbook to isolate category and property drivers.",
};

const SERVICE_CHARGE_PACK: SidebarPack = {
  attachments: [
    {
      id: "a1",
      name: "Service charge — advances vs actuals YTD.xlsx",
      meta: "10:22 AM, 18 Aug 2025",
      iconBg: "bg-[#EBF0FE]",
      icon: FileSpreadsheet,
    },
    {
      id: "a2",
      name: "Tenant SC reconciliation pack.pdf",
      meta: "09:05 AM, 17 Aug 2025",
      iconBg: "bg-[#EDE9FE]",
      icon: Landmark,
    },
  ],
  comments: [
    {
      id: "c1",
      author: "@jimduddley",
      initials: "JD",
      when: "12 Sep 2025",
      body: "10% YTD gap — confirm if Q4 true-up is already accrued on the landlord side.",
    },
    {
      id: "c2",
      author: "Property accountant",
      initials: "PA",
      when: "Just now",
      body: "Waiting on facilities for the capex carve-out before we close the loop.",
    },
  ],
  descriptionExtra:
    "Service charge discrepancies are tracked against advances, expenses, and budget. The reconciliation pack supports tenant billing and year-end true-up discussions.",
};

const TENANT_PACK: SidebarPack = {
  attachments: [
    {
      id: "a1",
      name: "Aged debt — tenant ledger export.xlsx",
      meta: "08:00 AM, 28 Jul 2025",
      iconBg: "bg-[#EBF0FE]",
      icon: FileSpreadsheet,
    },
    {
      id: "a2",
      name: "Lease payment terms — X Ltd.pdf",
      meta: "15:40 PM, 27 Jul 2025",
      iconBg: "bg-[#F2F4F7]",
      icon: FileText,
    },
  ],
  comments: [
    {
      id: "c1",
      author: "Collections",
      initials: "CL",
      when: "22 Jul 2025",
      body: "Last reminder sent — no promise-to-pay logged yet for the open balance.",
    },
    {
      id: "c2",
      author: "Asset manager",
      initials: "AM",
      when: "Just now",
      body: "Should we pair this with a covenant review on the parent guarantee?",
    },
  ],
  descriptionExtra:
    "Payment and arrears insights combine lease terms, billing history, and collections status. Attachments help align asset management and finance on next steps.",
};

function getSidebarPack(insight: InsightCardModel): SidebarPack {
  const t = `${insight.title} ${insight.subtitle}`.toLowerCase();
  if (t.includes("rental income") || (t.includes("rental") && t.includes("income"))) {
    return RENTAL_INCOME_PACK;
  }
  if (t.includes("service charge")) {
    return SERVICE_CHARGE_PACK;
  }
  if (t.includes("opex")) {
    return OPEX_PACK;
  }
  if (t.includes("delayed payment") || t.includes("tenant") || t.includes("late payment")) {
    return TENANT_PACK;
  }
  if (t.includes("expense")) {
    return EXPENSE_PACK;
  }
  return DEFAULT_PACK;
}

export function InsightDetailSidebar({
  insight,
  onClose,
  onKanbanChange,
}: {
  insight: InsightCardModel;
  onClose: () => void;
  onKanbanChange: (column: KanbanColumnId) => void;
}) {
  const [tab, setTab] = useState<"comments" | "actions">("comments");
  const [commentDraft, setCommentDraft] = useState("");

  const pack = useMemo(() => getSidebarPack(insight), [insight]);

  const updates = useMemo(
    () => [
      {
        title: "Rule reviewed",
        body: `Thresholds for “${insight.title}” were checked against the latest budget upload.`,
        when: "2 days ago",
      },
      {
        title: insight.active ? "Active on portfolio" : "Set inactive",
        body: insight.active
          ? "Insight is firing on live data for scoped properties."
          : "Insight paused — excluded from proactive alerts until re-enabled.",
        when: "1 week ago",
      },
    ],
    [insight.active, insight.title],
  );

  return (
    <div className="flex h-full min-h-0 w-full flex-col rounded-[12px] border-2 border-[rgba(255,255,255,0.6)] bg-[linear-gradient(90deg,rgba(255,255,255,0.35)_1.2%,rgba(255,255,255,0.2)_100%)] shadow-[0_8px_24px_rgba(0,0,0,0.12)] backdrop-blur-[20px]">
      <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[#E6E8EB] px-4 py-3">
        <div className="min-w-0 flex-1 pr-2">
          <h2 className="text-[16px] font-semibold leading-[1.35] text-[#010309]">{insight.title}</h2>
          <p className="mt-0.5 text-[12px] font-medium text-[#676A6E]">
            {insight.active ? "Active insight" : "Inactive insight"}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Select
            value={insight.kanbanColumn}
            onValueChange={(v) => onKanbanChange(v as KanbanColumnId)}
          >
            <SelectTrigger
              aria-label="Board column"
              className={cn(
                "h-auto w-fit max-w-[min(100%,11rem)] shrink-0 cursor-pointer gap-1.5 rounded-full border-0 px-3 py-1.5 text-[12px] font-semibold shadow-none ring-offset-0 hover:opacity-95 focus:ring-2 focus:ring-[#233FDE]/35 data-[placeholder]:text-inherit [&>svg]:size-3.5 [&>svg]:shrink-0 [&>svg]:opacity-65",
                kanbanStatusTagClass(insight.kanbanColumn),
              )}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              className="border-[#E6E8EB] bg-white text-[#353638]"
              position="popper"
              sideOffset={4}
            >
              {KANBAN_COLUMNS.map((col) => (
                <SelectItem
                  key={col.id}
                  value={col.id}
                  className="text-[13px] focus:bg-[#F2F4F7] focus:text-[#010309]"
                >
                  {col.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-[#353638] transition-colors hover:bg-[#F0F2F5]"
            aria-label="Close detail panel"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <section className="mb-6">
          <h3 className="text-[14px] font-semibold text-[#010309]">Description</h3>
          <div className="mt-2 divide-y divide-[#E6E8EB] text-[14px] leading-[1.5] text-[#4E4F52]">
            <p className="pb-3">{insight.subtitle}</p>
            <p className="pt-3">{pack.descriptionExtra}</p>
          </div>
        </section>

        <section className="mb-6">
          <h3 className="text-[14px] font-semibold text-[#010309]">Attachments</h3>
          <ul className="mt-3 flex flex-col gap-3">
            {pack.attachments.map((file) => {
              const Icon = file.icon;
              return (
                <li
                  key={file.id}
                  className="flex items-start gap-3 rounded-xl border border-[#E6E8EB] bg-white/90 px-3 py-3"
                >
                  <div
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-lg",
                      file.iconBg,
                    )}
                  >
                    <Icon className="size-5 text-[#353638]" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-[14px] font-medium text-[#353638]">{file.name}</p>
                        <p className="mt-0.5 text-[12px] text-[#969A9E]">{file.meta}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 text-[12px] font-medium text-[#233FDE] hover:underline"
                          onClick={() =>
                            window.dispatchEvent(
                              new CustomEvent("amiio:toast", { detail: { message: `View ${file.name}` } }),
                            )
                          }
                        >
                          <Eye className="size-3.5" />
                          View
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 text-[12px] font-medium text-[#233FDE] hover:underline"
                          onClick={() =>
                            window.dispatchEvent(
                              new CustomEvent("amiio:toast", {
                                detail: { message: `Download ${file.name}` },
                              }),
                            )
                          }
                        >
                          <Download className="size-3.5" />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section>
          <div className="flex border-b border-[#E6E8EB]">
            {(["comments", "actions"] as const).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={cn(
                  "relative flex-1 pb-2.5 text-center text-[14px] font-medium capitalize transition-colors",
                  tab === key ? "text-[#010309]" : "text-[#969A9E] hover:text-[#676A6E]",
                )}
              >
                {key}
                {tab === key ? (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-[#010309]" />
                ) : null}
              </button>
            ))}
          </div>

          {tab === "comments" ? (
            <div className="mt-4 flex flex-col gap-4">
              {pack.comments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#D3D9F8] text-[11px] font-semibold text-[#233FDE]"
                    aria-hidden
                  >
                    {c.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] text-[#676A6E]">
                      <span className="font-medium text-[#353638]">{c.author}</span>
                      <span className="mx-1">•</span>
                      <span>{c.when}</span>
                    </p>
                    <p className="mt-1 text-[14px] leading-[1.45] text-[#353638]">{c.body}</p>
                  </div>
                </div>
              ))}
              <label className="sr-only" htmlFor="insight-comment">
                Add a comment
              </label>
              <input
                id="insight-comment"
                type="text"
                value={commentDraft}
                onChange={(e) => setCommentDraft(e.target.value)}
                placeholder="Add a comment..."
                className="h-10 w-full rounded-lg border border-[#D1D5D9] bg-white px-3 text-[14px] text-[#353638] placeholder:text-[#969A9E] outline-none focus-visible:ring-2 focus-visible:ring-[#233FDE]/30"
              />
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              <InsightActionButtons insightTitle={insight.title} />
              <div className="space-y-3 border-t border-[#E6E8EB] pt-4">
              {updates.map((u) => (
                <div
                  key={u.title}
                  className="flex gap-3 rounded-lg border border-[#E6E8EB] bg-white/80 px-3 py-2.5"
                >
                  <FileText className="mt-0.5 size-4 shrink-0 text-[#676A6E]" />
                  <div>
                    <p className="text-[14px] font-medium text-[#353638]">{u.title}</p>
                    <p className="mt-0.5 text-[13px] text-[#676A6E]">{u.body}</p>
                    <p className="mt-1 text-[12px] text-[#969A9E]">{u.when}</p>
                  </div>
                </div>
              ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
