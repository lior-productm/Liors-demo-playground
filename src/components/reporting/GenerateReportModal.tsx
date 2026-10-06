"use client";

import { useState } from "react";
import { ChevronDown, FilePlus2, Lock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { LanguageSelect } from "@/src/components/i18n/LanguageSelect";
import { useI18n, useInterfaceLanguage } from "@/src/hooks/useI18n";
import type { LanguageCode } from "@/src/lib/i18n";
import {
  addGeneratedReport,
  type GeneratedReport,
  type ReportOwnerType,
} from "@/src/lib/reportGenerated";
import { uid } from "@/src/lib/aiAnalystsUi";

const OWNERS: Record<ReportOwnerType, readonly string[]> = {
  entity: ["Come Together B.V.", "Let It Be Holdings", "Abbey Road Entity"],
  property: ["Penny Lane 1", "Strawberry Fields", "Octopus Garden"],
};

const PERIODS = ["Q1 2025", "Q2 2025", "Q3 2025", "Q4 2025", "Annual 2024"] as const;

/** Collects owner, period and (locked) report language before generating a report. */
export function GenerateReportModal({
  onClose,
  onGenerated,
}: {
  onClose: () => void;
  onGenerated: (report: GeneratedReport) => void;
}) {
  const { t } = useI18n();
  const interfaceLang = useInterfaceLanguage();
  const [ownerType, setOwnerType] = useState<ReportOwnerType>("entity");
  const [ownerName, setOwnerName] = useState(OWNERS.entity[0]);
  const [period, setPeriod] = useState<string>(PERIODS[2]);
  const [language, setLanguage] = useState<LanguageCode>(interfaceLang);

  const changeOwnerType = (next: ReportOwnerType) => {
    setOwnerType(next);
    setOwnerName(OWNERS[next][0]);
  };

  const handleGenerate = () => {
    const report: GeneratedReport = {
      id: uid("report"),
      title: `${ownerName} ${period}`,
      createdAt: new Date().toISOString(),
      language,
      ownerType,
      ownerName,
      period,
    };
    addGeneratedReport(report);
    onGenerated(report);
  };

  return (
    <div
      className="fixed inset-0 z-[130] flex items-center justify-center bg-black/30 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="flex max-h-[88vh] w-full max-w-[520px] flex-col overflow-hidden rounded-2xl border border-[#E6E8EB] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.16)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-[#E6E8EB] px-6 py-4">
          <div className="flex items-center gap-2">
            <FilePlus2 className="size-5 text-[#4C61DB]" strokeWidth={1.75} />
            <h3 className="text-[16px] font-semibold leading-[1.25] text-[#05091F]">
              {t("New report")}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-lg text-[#65686B] hover:bg-[#F0F2F5]"
            aria-label={t("Cancel")}
          >
            <X className="size-5" strokeWidth={1.75} />
          </button>
        </div>

        <div className="flex flex-col gap-5 overflow-y-auto px-6 py-5">
          <div className="flex flex-col gap-1.5">
            <span className="text-[12px] font-medium leading-[1.25] text-[#353638]">
              {t("Report owner")}
            </span>
            <div className="flex gap-2">
              {(Object.keys(OWNERS) as ReportOwnerType[]).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => changeOwnerType(value)}
                  className={cn(
                    "flex h-10 flex-1 items-center justify-center rounded-lg border text-[13px] font-medium leading-[1.24] transition-colors",
                    ownerType === value
                      ? "border-2 border-[#A7B2F2] bg-[#F7F8FF] text-[#353638]"
                      : "border-[#E6E8EB] bg-white text-[#65686B] hover:bg-[#FAFBFC]",
                  )}
                >
                  {value === "entity" ? t("Entity") : t("Property")}
                </button>
              ))}
            </div>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-[12px] font-medium leading-[1.25] text-[#353638]">
              {ownerType === "entity" ? t("Entity") : t("Property")}
            </span>
            <div className="relative">
              <select
                value={ownerName}
                onChange={(event) => setOwnerName(event.target.value)}
                className="h-10 w-full appearance-none rounded-lg border border-[#E8EAED] bg-white py-2 ps-3 pe-9 text-[14px] leading-[1.24] text-[#111] outline-none focus:border-[#A7B2F2]"
              >
                {OWNERS[ownerType].map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute end-2.5 top-1/2 size-4 -translate-y-1/2 text-[#6B7280]" />
            </div>
          </label>

          <div className="flex flex-col gap-1.5">
            <span className="text-[12px] font-medium leading-[1.25] text-[#353638]">
              {t("Period")}
            </span>
            <div className="flex flex-wrap gap-2">
              {PERIODS.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setPeriod(value)}
                  className={cn(
                    "flex h-9 items-center rounded-full border px-3.5 text-[13px] font-medium leading-[1.24] transition-colors",
                    period === value
                      ? "border-2 border-[#A7B2F2] bg-[#F7F8FF] text-[#353638]"
                      : "border-[#E6E8EB] bg-white text-[#65686B] hover:bg-[#FAFBFC]",
                  )}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[12px] font-medium leading-[1.25] text-[#353638]">
              {t("Report language")}
            </span>
            <LanguageSelect value={language} onChange={setLanguage} className="max-w-none" />
            <p className="mt-1 flex items-center gap-1.5 text-[12px] leading-[1.5] text-[#65686B]">
              <Lock className="size-3.5 shrink-0 text-[#969A9E]" strokeWidth={1.9} />
              {t("The report language cannot be changed after the report is created.")}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[#E6E8EB] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 items-center rounded-lg border border-[#B3B8BD] px-4 text-[14px] font-medium leading-[1.24] text-[#111] hover:bg-[#F7F8FA]"
          >
            {t("Cancel")}
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            className="flex h-10 items-center gap-1.5 rounded-lg bg-[#111] px-4 text-[14px] font-medium leading-[1.24] text-white hover:bg-[#333]"
          >
            {t("Continue")}
          </button>
        </div>
      </div>
    </div>
  );
}
