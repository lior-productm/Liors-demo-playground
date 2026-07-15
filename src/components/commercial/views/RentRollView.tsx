"use client";

import { useMemo, useRef, useState } from "react";
import { Lightbulb, CalendarDays, ChevronDown, ChevronRight, Plus, Pencil, Check, Trash2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { amiioCardHoverSurface, cn } from "@/lib/utils";
import { WidgetExportMenu } from "@/src/components/commercial/WidgetExportMenu";
import {
  AmiioAiDisclaimerTrigger,
  defaultLampTooltipSummary,
} from "@/src/components/commercial/AmiioAiDisclaimerTooltip";
import type { ExcelSheetInput } from "@/src/lib/commercial-export";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface RentRollRow {
  units: string;
  tenant: string;
  startDate: string;
  endDate: string;
  nextIndexation: string;
  noticePeriod: number;
  invoicePeriod: "Quarterly" | "Monthly";
  fi?: boolean;
}

interface BuildingGroup {
  building: string;
  rows: RentRollRow[];
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const rentRollData: BuildingGroup[] = [
  {
    building: "Gloucester 120",
    rows: [
      { units: "Archive space, C0001, C0101, C0201", tenant: "Leweer Jewellery B.V.", startDate: "01 May 2021", endDate: "31 Aug 2026", nextIndexation: "01 May 2028", noticePeriod: 12, invoicePeriod: "Quarterly" },
    ],
  },
  {
    building: "Gloucester 140",
    rows: [
      { units: "0A, 0C1", tenant: "Tech RnD B.V.", startDate: "01 Oct 2022", endDate: "30 Sep 2027", nextIndexation: "01 Oct 2025", noticePeriod: 12, invoicePeriod: "Quarterly" },
      { units: "0B, 0C2", tenant: "Vancouver Holdings B.V.", startDate: "01 Sep 2021", endDate: "31 Aug 2031", nextIndexation: "01 Sep 2025", noticePeriod: 12, invoicePeriod: "Quarterly" },
      { units: "1A, 1B, 1C1, 1C2, 1C3", tenant: "Caesar Consulting B.V.", startDate: "31 Dec 2021", endDate: "30 Dec 2031", nextIndexation: "01 Jan 2026", noticePeriod: 12, invoicePeriod: "Monthly" },
      { units: "2A", tenant: "Aristotle Holdings B.V.", startDate: "01 Feb 2024", endDate: "30 Dec 2030", nextIndexation: "01 Feb 2026", noticePeriod: 12, invoicePeriod: "Quarterly" },
      { units: "2B", tenant: "DevOps Advisors B.V.", startDate: "01 Nov 2022", endDate: "31 Oct 2027", nextIndexation: "01 Nov 2025", noticePeriod: 12, invoicePeriod: "Quarterly" },
    ],
  },
  {
    building: "Antwerp 160",
    rows: [
      { units: "0A, 0B, 0C", tenant: "Pandora B.V.", startDate: "01 May 2022", endDate: "31 Oct 2030", nextIndexation: "01 Jan 2026", noticePeriod: 12, invoicePeriod: "Quarterly" },
      { units: "1A, 1B, 1C", tenant: "New York Tech B.V.", startDate: "01 Nov 2020", endDate: "31 Oct 2030", nextIndexation: "01 Jan 2025", noticePeriod: 12, invoicePeriod: "Quarterly" },
      { units: "2A", tenant: "Chinchilla Holdings B.V.", startDate: "01 Nov 2021", endDate: "31 Oct 2031", nextIndexation: "01 Jan 2026", noticePeriod: 9, invoicePeriod: "Monthly" },
      { units: "2B", tenant: "Chinchilla Holdings B.V.", startDate: "01 July 2023", endDate: "31 Mar 2030", nextIndexation: "01 Apr 2026", noticePeriod: 7, invoicePeriod: "Monthly" },
    ],
  },
  {
    building: "Antwerp 160 (continued)",
    rows: [
      { units: "0A, 0B, 0C, 1A, 1B, 1C, 2A, 2B, 2C", tenant: "Venus Holdings B.V.", startDate: "31 Dec 2022", endDate: "31 Dec 2032", nextIndexation: "01 Jan 2028", noticePeriod: 12, invoicePeriod: "Quarterly" },
    ],
  },
  {
    building: "Queens 1B",
    rows: [
      { units: "0A, 0B, 0C, 1A, 1B, 1C, 2A, 2B, 2C", tenant: "Caesar Advisors B.V.", startDate: "31 Jan 2018", endDate: "31 Dec 2027", nextIndexation: "01 Jan 2026", noticePeriod: 12, invoicePeriod: "Quarterly" },
      { units: "2A5", tenant: "New Avenues B.V.", startDate: "01 Sep 2023", endDate: "31 Mar 2026", nextIndexation: "01 Apr 2026", noticePeriod: 3, invoicePeriod: "Monthly" },
      { units: "2A6, 2A7, 2A8", tenant: "Clarus Offices B.V.", startDate: "01 Jul 2021", endDate: "31 Jul 2026", nextIndexation: "01 July 2026", noticePeriod: 3, invoicePeriod: "Quarterly" },
      { units: "2A10, 2A9", tenant: "Penny Holdings B.V.", startDate: "01 Jan 2022", endDate: "31 Dec 2025", nextIndexation: "01 Jan 2026", noticePeriod: 3, invoicePeriod: "Quarterly" },
      { units: "3A1, 3A2, 3A3, 3A4", tenant: "Pernilla Management", startDate: "01 Jan 2017", endDate: "31 Dec 2025", nextIndexation: "01 Jan 2026", noticePeriod: 9, invoicePeriod: "Quarterly" },
      { units: "3A5, 3A6, 3A7", tenant: "Windsor KY B.V.", startDate: "01 Jan 2022", endDate: "31 Dec 2026", nextIndexation: "01 Jan 2026", noticePeriod: 8, invoicePeriod: "Monthly" },
      { units: "3A8", tenant: "Venn Estates B.V.", startDate: "01 Jul 2023", endDate: "30 Jun 2026", nextIndexation: "01 July 2026", noticePeriod: 3, invoicePeriod: "Monthly" },
      { units: "3A9", tenant: "Claudius B.V.", startDate: "01 Feb 2022", endDate: "31 Jan 2026", nextIndexation: "01 Feb 2026", noticePeriod: 3, invoicePeriod: "Monthly" },
    ],
  },
];

const signedLeaseData: BuildingGroup[] = [
  {
    building: "Gloucester 120",
    rows: [
      { units: "Archive space, C0001, C0101, C0201", tenant: "Leweer Jewellery B.V.", startDate: "01 May 2021", endDate: "31 Aug 2026", nextIndexation: "01 May 2028", noticePeriod: 12, invoicePeriod: "Quarterly" },
    ],
  },
  {
    building: "Gloucester 140",
    rows: [
      { units: "0A, 0C1", tenant: "Tech RnD B.V.", startDate: "01 Oct 2022", endDate: "30 Sep 2027", nextIndexation: "01 Oct 2025", noticePeriod: 12, invoicePeriod: "Quarterly" },
    ],
  },
];

const subTotalRows = [
  { label: "Sub Total Leased", pct: "100%", area: "149 Spaces", walt: "4.4 Years", griExcl: "€2,897,090", griIncl: "€732,475", bold: false },
  { label: "Vacancy", pct: "0%", area: "10 Spaces", walt: "—", griExcl: "—", griIncl: "€75,098", bold: false },
  { label: "GRAND TOTAL", pct: "100%", area: "159 Spaces", walt: "4.4 Years", griExcl: "€2,897,090", griIncl: "€807,573", bold: true },
];

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

const colHeaders = [
  "Units",
  "Tenant Name",
  "Start Date",
  "End Date",
  "Next Indexation",
  "Notice Period",
  "Invoice Period",
  "FI",
];

function rentRollGroupsToSheet(
  groups: BuildingGroup[],
  sheetName: string,
): ExcelSheetInput {
  const rows: (string | number)[][] = [];
  for (const g of groups) {
    rows.push([`— ${g.building} —`, "", "", "", "", "", "", ""]);
    for (const r of g.rows) {
      rows.push([
        r.units,
        r.tenant,
        r.startDate,
        r.endDate,
        r.nextIndexation,
        r.noticePeriod,
        r.invoicePeriod,
        r.fi ? "Y" : "",
      ]);
    }
  }
  return { name: sheetName, columns: colHeaders, rows };
}

function InvoiceBadge({ period }: { period: "Quarterly" | "Monthly" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[12px] font-semibold text-white whitespace-nowrap",
        period === "Quarterly" ? "bg-[#233FDE]" : "bg-[#353638]",
      )}
    >
      {period}
    </span>
  );
}

function TableHeaderRow() {
  return (
    <tr className="bg-[#F2F4F7]">
      {colHeaders.map((h) => (
        <th
          key={h}
          className="whitespace-nowrap px-3 py-2 text-left text-[12px] font-medium text-[#65686B]"
        >
          {h}
        </th>
      ))}
    </tr>
  );
}

function BuildingSection({ group, onOpenTenantHub }: { group: BuildingGroup; onOpenTenantHub?: () => void }) {
  return (
    <>
      <tr className="bg-[#F8F9FA]">
        <td
          colSpan={colHeaders.length}
          className="px-3 py-2 text-[12px] font-medium text-[#353638]"
        >
          {group.building}
        </td>
      </tr>
      {group.rows.map((row, i) => (
        <tr
          key={`${group.building}-${i}`}
          className="border-b border-[#F2F4F7] last:border-b-0 hover:bg-[#FAFBFC] transition-colors"
        >
          <td className="whitespace-nowrap px-3 py-2.5 text-[12px] text-[#353638]">
            {row.units}
          </td>
          <td className="whitespace-nowrap px-3 py-2.5 text-[12px] text-[#353638]">
            <span
              className={onOpenTenantHub ? "cursor-pointer hover:text-[#233FDE] hover:underline" : ""}
              onClick={onOpenTenantHub}
            >{row.tenant}</span>
          </td>
          <td className="whitespace-nowrap px-3 py-2.5 text-[12px] text-[#353638]">
            {row.startDate}
          </td>
          <td className="whitespace-nowrap px-3 py-2.5 text-[12px] text-[#353638]">
            {row.endDate}
          </td>
          <td className="whitespace-nowrap px-3 py-2.5 text-[12px] text-[#353638]">
            {row.nextIndexation}
          </td>
          <td className="whitespace-nowrap px-3 py-2.5 text-[12px] text-[#353638] text-center">
            {row.noticePeriod}
          </td>
          <td className="whitespace-nowrap px-3 py-2.5">
            <InvoiceBadge period={row.invoicePeriod} />
          </td>
          <td className="whitespace-nowrap px-3 py-2.5 text-center">
            <span className="inline-block h-2 w-2 rounded-full bg-[#22C55E]" />
          </td>
        </tr>
      ))}
    </>
  );
}

function EditableBuildingSection({
  group,
  groupIdx,
  isEditing,
  editingRow,
  editDraft,
  onEditRow,
  onSaveRow,
  onCancelEdit,
  onDeleteRow,
  onUpdateDraft,
}: {
  group: BuildingGroup;
  groupIdx: number;
  isEditing: boolean;
  editingRow: { groupIdx: number; rowIdx: number } | null;
  editDraft: RentRollRow | null;
  onEditRow: (gi: number, ri: number) => void;
  onSaveRow: () => void;
  onCancelEdit: () => void;
  onDeleteRow: (gi: number, ri: number) => void;
  onUpdateDraft: (draft: RentRollRow | null) => void;
}) {
  return (
    <>
      <tr className="bg-[#F8F9FA]">
        <td
          colSpan={colHeaders.length + (isEditing ? 1 : 0)}
          className="px-3 py-2 text-[12px] font-medium text-[#353638]"
        >
          {group.building}
        </td>
      </tr>
      {group.rows.map((row, ri) => {
        const isCurrentlyEditing =
          editingRow?.groupIdx === groupIdx && editingRow?.rowIdx === ri;
        return (
          <tr
            key={`${group.building}-${ri}`}
            className={cn(
              "border-b border-[#F2F4F7] last:border-b-0 transition-colors",
              isEditing && !isCurrentlyEditing && "hover:bg-[#EEF0FF] cursor-pointer",
              isCurrentlyEditing && "bg-[#EEF0FF]",
            )}
            onClick={() => {
              if (isEditing && !isCurrentlyEditing) onEditRow(groupIdx, ri);
            }}
          >
            {isCurrentlyEditing && editDraft ? (
              <>
                <td className="px-3 py-1.5">
                  <input
                    className="w-full rounded border border-[#233FDE] bg-white px-2 py-1 text-[12px] text-[#353638] outline-none"
                    value={editDraft.units}
                    onChange={(e) => onUpdateDraft({ ...editDraft, units: e.target.value })}
                  />
                </td>
                <td className="px-3 py-1.5">
                  <input
                    className="w-full rounded border border-[#233FDE] bg-white px-2 py-1 text-[12px] text-[#353638] outline-none"
                    value={editDraft.tenant}
                    onChange={(e) => onUpdateDraft({ ...editDraft, tenant: e.target.value })}
                  />
                </td>
                <td className="px-3 py-1.5">
                  <input
                    className="w-full rounded border border-[#233FDE] bg-white px-2 py-1 text-[12px] text-[#353638] outline-none"
                    value={editDraft.startDate}
                    onChange={(e) => onUpdateDraft({ ...editDraft, startDate: e.target.value })}
                  />
                </td>
                <td className="px-3 py-1.5">
                  <input
                    className="w-full rounded border border-[#233FDE] bg-white px-2 py-1 text-[12px] text-[#353638] outline-none"
                    value={editDraft.endDate}
                    onChange={(e) => onUpdateDraft({ ...editDraft, endDate: e.target.value })}
                  />
                </td>
                <td className="px-3 py-1.5">
                  <input
                    className="w-full rounded border border-[#233FDE] bg-white px-2 py-1 text-[12px] text-[#353638] outline-none"
                    value={editDraft.nextIndexation}
                    onChange={(e) => onUpdateDraft({ ...editDraft, nextIndexation: e.target.value })}
                  />
                </td>
                <td className="px-3 py-1.5">
                  <input
                    type="number"
                    className="w-16 rounded border border-[#233FDE] bg-white px-2 py-1 text-center text-[12px] text-[#353638] outline-none"
                    value={editDraft.noticePeriod}
                    onChange={(e) => onUpdateDraft({ ...editDraft, noticePeriod: Number(e.target.value) })}
                  />
                </td>
                <td className="px-3 py-1.5">
                  <select
                    className="rounded border border-[#233FDE] bg-white px-2 py-1 text-[12px] text-[#353638] outline-none"
                    value={editDraft.invoicePeriod}
                    onChange={(e) => onUpdateDraft({ ...editDraft, invoicePeriod: e.target.value as "Quarterly" | "Monthly" })}
                  >
                    <option value="Quarterly">Quarterly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </td>
                <td className="whitespace-nowrap px-3 py-1.5">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onSaveRow(); }}
                      className="rounded bg-[#1F9E8B] p-1 text-white hover:bg-[#1a8a79]"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onCancelEdit(); }}
                      className="rounded bg-[#969A9E] p-1 text-white hover:bg-[#7E8185]"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </>
            ) : (
              <>
                <td className="whitespace-nowrap px-3 py-2.5 text-[12px] text-[#353638]">
                  {row.units}
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 text-[12px] text-[#353638]">
                  {row.tenant}
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 text-[12px] text-[#353638]">
                  {row.startDate}
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 text-[12px] text-[#353638]">
                  {row.endDate}
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 text-[12px] text-[#353638]">
                  {row.nextIndexation}
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 text-[12px] text-[#353638] text-center">
                  {row.noticePeriod}
                </td>
                <td className="whitespace-nowrap px-3 py-2.5">
                  <InvoiceBadge period={row.invoicePeriod} />
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 text-center">
                  {isEditing ? (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onDeleteRow(groupIdx, ri); }}
                      className="rounded p-1 text-[#9F2D3A] hover:bg-[#FBEAEC]"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  ) : (
                    <span className="inline-block h-2 w-2 rounded-full bg-[#22C55E]" />
                  )}
                </td>
              </>
            )}
          </tr>
        );
      })}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export function RentRollView({
  onOpenTenantHub,
  onAnalyseWithAmiio,
}: {
  onOpenTenantHub?: () => void;
  onAnalyseWithAmiio?: (topic: string) => void;
} = {}) {
  const [signedLeaseOpen, setSignedLeaseOpen] = useState(true);
  const [isEditingSigned, setIsEditingSigned] = useState(false);
  const [signedLeases, setSignedLeases] = useState(signedLeaseData);
  const [editingRow, setEditingRow] = useState<{ groupIdx: number; rowIdx: number } | null>(null);
  const [editDraft, setEditDraft] = useState<RentRollRow | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const excelWorkbook = useMemo((): ExcelSheetInput[] => {
    return [
      rentRollGroupsToSheet(rentRollData, "Rent Roll"),
      rentRollGroupsToSheet(signedLeases, "Signed Leased"),
      {
        name: "Sub Total Lease",
        columns: [
          "After Start Signed Leases",
          "Type",
          "Area (m²)/Unit",
          "WALT",
          "Total GRI (excl. parking)",
          "Total GRI (incl. parking)",
        ],
        rows: subTotalRows.map((r) => [
          r.label,
          "",
          r.area,
          r.walt,
          r.griExcl,
          r.griIncl,
        ]),
      },
    ];
  }, [signedLeases]);

  const handleEditRow = (groupIdx: number, rowIdx: number) => {
    setEditingRow({ groupIdx, rowIdx });
    setEditDraft({ ...signedLeases[groupIdx].rows[rowIdx] });
  };

  const handleSaveRow = () => {
    if (!editingRow || !editDraft) return;
    setSignedLeases((prev) => {
      const next = prev.map((g, gi) => {
        if (gi !== editingRow.groupIdx) return g;
        return {
          ...g,
          rows: g.rows.map((r, ri) => (ri === editingRow.rowIdx ? editDraft : r)),
        };
      });
      return next;
    });
    setEditingRow(null);
    setEditDraft(null);
  };

  const handleDeleteRow = (groupIdx: number, rowIdx: number) => {
    setSignedLeases((prev) =>
      prev
        .map((g, gi) => {
          if (gi !== groupIdx) return g;
          return { ...g, rows: g.rows.filter((_, ri) => ri !== rowIdx) };
        })
        .filter((g) => g.rows.length > 0),
    );
  };

  const handleAddRow = () => {
    const newRow: RentRollRow = {
      units: "New Unit",
      tenant: "New Tenant B.V.",
      startDate: "01 Jan 2026",
      endDate: "31 Dec 2030",
      nextIndexation: "01 Jan 2027",
      noticePeriod: 12,
      invoicePeriod: "Quarterly",
    };
    if (signedLeases.length > 0) {
      setSignedLeases((prev) => {
        const next = [...prev];
        next[0] = { ...next[0], rows: [...next[0].rows, newRow] };
        return next;
      });
    } else {
      setSignedLeases([{ building: "New Building", rows: [newRow] }]);
    }
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        "rounded-2xl border border-[rgba(230,231,232,0.7)] bg-[rgba(255,255,255,0.8)] p-6",
        amiioCardHoverSurface,
      )}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <h2 className="text-[18px] font-medium text-[#2C2C2C]">Rent Roll</h2>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#E6E8EB] bg-white px-3 py-1.5 text-[12px] font-medium text-[#353638] hover:bg-[#F8F9FA] transition-colors"
          >
            <CalendarDays className="h-3.5 w-3.5 text-[#969A9E]" />
            Select date
            <ChevronDown className="h-3 w-3 text-[#969A9E]" />
          </button>

          <WidgetExportMenu
            variant="table"
            fileName="rent-roll"
            captureRef={cardRef}
            excelWorkbook={excelWorkbook}
          />

          <AmiioAiDisclaimerTrigger
            variant="lamp"
            lampSummary={defaultLampTooltipSummary(
              "Rent roll",
              "Active leases by building: tenants, terms, indexation, notice, and billing cadence.",
            )}
          >
            <button
              type="button"
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#D1D5D9] text-[#969A9E] transition-colors hover:border-[#233FDE] hover:bg-[#EEF0FF]"
              aria-label="Analyse with Amiio"
              onClick={() =>
                onAnalyseWithAmiio?.(
                  "the rent roll — expiries, indexation dates, and tenant concentration",
                )
              }
            >
              <Lightbulb className="h-4 w-4" />
            </button>
          </AmiioAiDisclaimerTrigger>
        </div>
      </div>

      {/* Main Rent Roll table */}
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full min-w-[900px] border-collapse">
          <thead>
            <TableHeaderRow />
          </thead>
          <tbody>
            {rentRollData.map((group) => (
              <BuildingSection key={group.building} group={group} onOpenTenantHub={onOpenTenantHub} />
            ))}

            <tr className="border-t-2 border-[#E6E8EB] bg-[#F2F4F7]">
              <td
                colSpan={colHeaders.length}
                className="px-3 py-2.5 text-[14px] font-semibold text-[#353638]"
              >
                Total Rent Roll
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Signed Leased Section - Editable */}
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setSignedLeaseOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#233FDE] hover:text-[#1a2fb0] transition-colors"
          >
            {signedLeaseOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            <Plus className="h-3.5 w-3.5" />
            Signed Leased
          </button>

          {signedLeaseOpen && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditingSigned(!isEditingSigned)}
                className={cn(
                  "flex items-center gap-1 rounded-lg px-3 py-1 text-[12px] font-medium transition-colors",
                  isEditingSigned
                    ? "bg-[#233FDE] text-white hover:bg-[#1a2fb0]"
                    : "border border-[#E6E8EB] text-[#353638] hover:bg-[#F8F9FA]",
                )}
              >
                {isEditingSigned ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Done Editing
                  </>
                ) : (
                  <>
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </>
                )}
              </button>
              {isEditingSigned && (
                <button
                  type="button"
                  onClick={handleAddRow}
                  className="flex items-center gap-1 rounded-lg bg-[#1F9E8B] px-3 py-1 text-[12px] font-medium text-white hover:bg-[#1a8a79] transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Row
                </button>
              )}
            </div>
          )}
        </div>

        {signedLeaseOpen && (
          <div className={cn(
            "overflow-x-auto scrollbar-hide rounded-lg transition-all",
            isEditingSigned && "ring-2 ring-[#233FDE]/20",
          )}>
            <table className="w-full min-w-[900px] border-collapse">
              <thead>
                <TableHeaderRow />
                {isEditingSigned && (
                  <tr className="bg-[#EEF0FF]">
                    <th colSpan={colHeaders.length} className="px-3 py-1 text-left text-[12px] font-medium text-[#233FDE]">
                      Editing mode — click a row to edit, or use the action buttons
                    </th>
                  </tr>
                )}
              </thead>
              <tbody>
                {signedLeases.map((group, gi) => (
                  <EditableBuildingSection
                    key={`signed-${group.building}`}
                    group={group}
                    groupIdx={gi}
                    isEditing={isEditingSigned}
                    editingRow={editingRow}
                    editDraft={editDraft}
                    onEditRow={handleEditRow}
                    onSaveRow={handleSaveRow}
                    onCancelEdit={() => { setEditingRow(null); setEditDraft(null); }}
                    onDeleteRow={handleDeleteRow}
                    onUpdateDraft={setEditDraft}
                  />
                ))}

                <tr className="border-t-2 border-[#E6E8EB] bg-[#F2F4F7]">
                  <td
                    colSpan={colHeaders.length + (isEditingSigned ? 1 : 0)}
                    className="px-3 py-2.5 text-[14px] font-semibold text-[#353638]"
                  >
                    Total Signed Lease
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Sub Total Lease Section */}
      <div className="mt-6">
        <div className="mb-2 flex items-center gap-1.5 text-[14px] font-medium text-[#353638]">
          <span className="text-[#969A9E]">→</span> Sub Total Lease
        </div>

        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full min-w-[700px] border-collapse">
            <thead>
              <tr className="bg-[#F2F4F7]">
                <th className="whitespace-nowrap px-3 py-2 text-left text-[12px] font-medium uppercase text-[#969A9E]">
                  After Start Signed Leases
                </th>
                <th className="whitespace-nowrap px-3 py-2 text-left text-[12px] font-medium uppercase text-[#969A9E]">
                  Type
                </th>
                <th className="whitespace-nowrap px-3 py-2 text-right text-[12px] font-medium uppercase text-[#969A9E]">
                  Area (m²)/Unit
                </th>
                <th className="whitespace-nowrap px-3 py-2 text-right text-[12px] font-medium uppercase text-[#969A9E]">
                  WALT
                </th>
                <th className="whitespace-nowrap px-3 py-2 text-right text-[12px] font-medium uppercase text-[#969A9E]">
                  Total GRI (excl. parking)
                </th>
                <th className="whitespace-nowrap px-3 py-2 text-right text-[12px] font-medium uppercase text-[#969A9E]">
                  Total GRI (incl. parking)
                </th>
              </tr>
            </thead>
            <tbody>
              {subTotalRows.map((row) => (
                <tr
                  key={row.label}
                  className={cn(
                    "border-b border-[#F2F4F7]",
                    row.bold && "bg-[#F2F4F7] border-t-2 border-t-[#E6E8EB]",
                  )}
                >
                  <td
                    className={cn(
                      "whitespace-nowrap px-3 py-2.5 text-[14px] text-[#353638]",
                      row.bold ? "font-bold" : "font-semibold",
                    )}
                  >
                    {row.label}
                  </td>
                  <td
                    className={cn(
                      "whitespace-nowrap px-3 py-2.5 text-[14px] text-[#353638]",
                      row.bold ? "font-bold" : "font-semibold",
                    )}
                  >
                    {row.pct}
                  </td>
                  <td
                    className={cn(
                      "whitespace-nowrap px-3 py-2.5 text-right text-[14px] text-[#353638]",
                      row.bold ? "font-bold" : "font-semibold",
                    )}
                  >
                    {row.area}
                  </td>
                  <td
                    className={cn(
                      "whitespace-nowrap px-3 py-2.5 text-right text-[14px] text-[#353638]",
                      row.bold ? "font-bold" : "font-semibold",
                    )}
                  >
                    {row.walt}
                  </td>
                  <td
                    className={cn(
                      "whitespace-nowrap px-3 py-2.5 text-right text-[14px] text-[#353638]",
                      row.bold ? "font-bold" : "font-semibold",
                    )}
                  >
                    {row.griExcl}
                  </td>
                  <td
                    className={cn(
                      "whitespace-nowrap px-3 py-2.5 text-right text-[14px] text-[#353638]",
                      row.bold ? "font-bold" : "font-semibold",
                    )}
                  >
                    {row.griIncl}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
