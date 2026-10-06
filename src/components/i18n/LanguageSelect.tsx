"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { LANGUAGES, type LanguageCode } from "@/src/lib/i18n";
import {
  setInterfaceLanguage,
  useAvailableLanguages,
  useInterfaceLanguage,
} from "@/src/hooks/useI18n";

/** Flag + native name, reused in the selector and the locked report pill. */
export function LanguageOptionLabel({
  code,
  className,
  showEnglish = false,
}: {
  code: LanguageCode;
  className?: string;
  showEnglish?: boolean;
}) {
  const meta = LANGUAGES[code];
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span aria-hidden className="text-[16px] leading-none">
        {meta.flag}
      </span>
      <span>{meta.nativeLabel}</span>
      {showEnglish && meta.nativeLabel !== meta.englishLabel ? (
        <span className="text-[#969A9E]">({meta.englishLabel})</span>
      ) : null}
    </span>
  );
}

type LanguageSelectProps = {
  /** Controlled value. Omit to bind directly to the interface-language store. */
  value?: LanguageCode;
  onChange?: (lang: LanguageCode) => void;
  className?: string;
};

/** Flag-labelled dropdown for picking a language. */
export function LanguageSelect({ value, onChange, className }: LanguageSelectProps) {
  const storeLang = useInterfaceLanguage();
  const languages = useAvailableLanguages();
  const selected = value ?? storeLang;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const choose = (lang: LanguageCode) => {
    setOpen(false);
    if (onChange) onChange(lang);
    else setInterfaceLanguage(lang);
  };

  return (
    <div ref={rootRef} className={cn("relative w-full max-w-xs", className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex h-11 w-full items-center justify-between gap-3 rounded-lg border border-[#E8EAED] bg-white px-3.5 text-[14px] font-medium leading-[1.24] text-[#171717] transition-colors hover:bg-[#F7F8FA]"
      >
        <LanguageOptionLabel code={selected} />
        <ChevronDown
          className={cn("size-4 text-[#6B7280] transition-transform", open && "rotate-180")}
          strokeWidth={1.9}
        />
      </button>

      {open ? (
        <ul
          role="listbox"
          className="absolute z-50 mt-2 w-full overflow-hidden rounded-lg border border-[#E8EAED] bg-white py-1 shadow-[0_12px_32px_rgba(16,24,40,0.12)]"
        >
          {languages.map((meta) => {
            const isSelected = meta.code === selected;
            return (
              <li key={meta.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => choose(meta.code)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-start text-[14px] font-medium leading-[1.24] transition-colors",
                    isSelected ? "bg-[#F0F2F5] text-[#171717]" : "text-[#353638] hover:bg-[#F7F8FA]",
                  )}
                >
                  <LanguageOptionLabel code={meta.code} showEnglish />
                  {isSelected ? (
                    <Check className="size-4 text-[#4C61DB]" strokeWidth={2.2} />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
