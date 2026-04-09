"use client";

import { forwardRef } from "react";
import { Lightbulb } from "lucide-react";

/** Compact “Analyse with Amiio” trigger (matches Property Hub / lease expiry charts). */
export const AmiioAnalyseIcon = forwardRef<
  HTMLButtonElement,
  {
    onClick?: () => void;
    /** Set to `false` when using a custom tooltip (e.g. Radix) to avoid duplicate browser tooltips */
    nativeTitle?: string | false;
  }
>(function AmiioAnalyseIcon({ onClick, nativeTitle = "Analyse" }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      {...(nativeTitle !== false ? { title: nativeTitle } : {})}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#D1D5D9] transition-colors hover:border-[#233FDE] hover:bg-[#EEF0FF]"
    >
      <Lightbulb className="h-4 w-4 text-[#969A9E]" />
    </button>
  );
});
