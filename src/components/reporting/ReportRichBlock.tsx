"use client";

import { ImageIcon } from "lucide-react";
import type { ReportDocumentBlock } from "@/src/lib/reportingMockData";

/**
 * Renders the "fitted" custom-section block types (heading, table, chart,
 * photos) shared between the report document and the builder preview.
 * Returns null for block types handled elsewhere (prose, metrics, …).
 */
export function ReportRichBlock({ block }: { block: ReportDocumentBlock }) {
  if (block.type === "heading") {
    return (
      <header className="flex flex-col gap-1 border-b border-[#E6E8EB] pb-4">
        <h2 className="text-[28px] font-semibold leading-[1.2] text-[#05091F]">
          {block.title}
        </h2>
        {block.subtitle ? (
          <p className="text-[13px] leading-[1.5] text-[#65686B]">{block.subtitle}</p>
        ) : null}
      </header>
    );
  }

  if (block.type === "table") {
    return (
      <div className="overflow-hidden rounded-lg border border-[#E6E8EB]">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-[#FAFBFC]">
              {block.columns.map((column) => (
                <th
                  key={column}
                  className="border-b border-[#E6E8EB] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.4px] text-[#65686B]"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="even:bg-[#FAFBFC]">
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="border-b border-[#F0F2F5] px-3 py-2 text-[12px] leading-[1.5] text-[#353638] last:font-medium"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (block.type === "chart") {
    return (
      <div className="flex flex-col gap-3 rounded-lg border border-[#E6E8EB] bg-white p-4">
        {block.items.map((item) => (
          <div key={item.label} className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-[12px] leading-[1.4]">
              <span className="text-[#65686B]">{item.label}</span>
              <span className="font-medium text-[#05091F]">{item.value}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#F0F2F5]">
              <div
                className="h-full rounded-full bg-[#A7B2F2]"
                style={{ width: `${Math.max(8, Math.round(item.ratio * 100))}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (block.type === "photos") {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {block.items.map((item) => (
          <div
            key={item.label}
            className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[#D1D5D9] bg-[#FAFBFC] text-[#9AA0A6]"
          >
            <ImageIcon className="size-6" strokeWidth={1.5} />
            <span className="px-2 text-center text-[11px] leading-[1.3] text-[#65686B]">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return null;
}
