"use client";

import { useState } from "react";
import { Check, Languages, Lock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { LANGUAGE_LIST, type LanguageCode } from "@/src/lib/i18n";
import {
  setInterfaceAvailableLanguages,
  useAvailableLanguageCodes,
  useI18n,
  useInterfaceLanguage,
} from "@/src/hooks/useI18n";

/** Lets a user choose which languages appear in every language selector. */
export function ManageLanguagesModal({ onClose }: { onClose: () => void }) {
  const { t } = useI18n();
  const activeLang = useInterfaceLanguage();
  const savedCodes = useAvailableLanguageCodes();
  const [selected, setSelected] = useState<LanguageCode[]>(() =>
    // The active interface language is always part of the selection.
    Array.from(new Set<LanguageCode>([...savedCodes, activeLang])),
  );

  const toggle = (code: LanguageCode) => {
    if (code === activeLang) return;
    setSelected((current) =>
      current.includes(code)
        ? current.filter((value) => value !== code)
        : [...current, code],
    );
  };

  const canSave = selected.length > 0;

  const handleSave = () => {
    if (!canSave) return;
    setInterfaceAvailableLanguages(selected);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[130] flex items-center justify-center bg-black/30 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="flex max-h-[88vh] w-full max-w-[460px] flex-col overflow-hidden rounded-2xl border border-[#E6E8EB] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.16)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-[#E6E8EB] px-6 py-4">
          <div className="flex items-center gap-2">
            <Languages className="size-5 text-[#4C61DB]" strokeWidth={1.75} />
            <h3 className="text-[16px] font-semibold leading-[1.25] text-[#05091F]">
              {t("Available languages")}
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

        <div className="flex flex-col gap-4 overflow-y-auto px-6 py-5">
          <p className="text-[13px] leading-[1.5] text-[#65686B]">
            {t("Choose which languages appear in language selectors across the platform.")}
          </p>

          <ul className="flex flex-col gap-2">
            {LANGUAGE_LIST.map((meta) => {
              const isChecked = selected.includes(meta.code);
              const isLocked = meta.code === activeLang;
              return (
                <li key={meta.code}>
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={isChecked}
                    aria-disabled={isLocked}
                    onClick={() => toggle(meta.code)}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 rounded-lg border px-3.5 py-3 text-start transition-colors",
                      isChecked
                        ? "border-[#A7B2F2] bg-[#F7F8FF]"
                        : "border-[#E6E8EB] bg-white hover:bg-[#FAFBFC]",
                      isLocked && "cursor-default",
                    )}
                  >
                    <span className="flex items-center gap-2.5">
                      <span
                        className={cn(
                          "flex size-5 shrink-0 items-center justify-center rounded-[6px] border",
                          isChecked
                            ? "border-[#4C61DB] bg-[#4C61DB] text-white"
                            : "border-[#C7CBD1] bg-white text-transparent",
                        )}
                      >
                        <Check className="size-3.5" strokeWidth={2.4} />
                      </span>
                      <span className="flex items-center gap-2 text-[14px] font-medium leading-[1.24] text-[#171717]">
                        <span aria-hidden className="text-[16px] leading-none">
                          {meta.flag}
                        </span>
                        <span>{meta.nativeLabel}</span>
                        {meta.nativeLabel !== meta.englishLabel ? (
                          <span className="text-[#969A9E]">({meta.englishLabel})</span>
                        ) : null}
                      </span>
                    </span>
                    {isLocked ? (
                      <span className="flex items-center gap-1.5 text-[12px] leading-[1.4] text-[#65686B]">
                        <Lock className="size-3.5 shrink-0 text-[#969A9E]" strokeWidth={1.9} />
                        {t("Current")}
                      </span>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>

          {!canSave ? (
            <p className="rounded-lg bg-[#FFF4F4] px-3.5 py-3 text-[12px] leading-[1.5] text-[#B4232A]">
              {t("Select at least one language.")}
            </p>
          ) : (
            <p className="rounded-lg bg-[#F7F8FA] px-3.5 py-3 text-[12px] leading-[1.5] text-[#65686B]">
              {t("Your current interface language is always available.")}
            </p>
          )}
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
            onClick={handleSave}
            disabled={!canSave}
            className="flex h-10 items-center gap-1.5 rounded-lg bg-[#111] px-4 text-[14px] font-medium leading-[1.24] text-white transition-colors hover:bg-[#333] disabled:cursor-not-allowed disabled:bg-[#C7CBD1]"
          >
            {t("Save")}
          </button>
        </div>
      </div>
    </div>
  );
}
