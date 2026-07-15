"use client";

import { useCallback, useEffect, useState } from "react";
import { SHELL_CHAT_TOP_PX } from "@/src/lib/shellLayout";

/** Measure anchor top for a fixed floating panel — set once on open/resize, not on scroll. */
export function useLeaseRenewalPanelAnchorTop(
  anchorId: string,
  enabled: boolean,
  deps: unknown[] = [],
) {
  const [top, setTop] = useState(SHELL_CHAT_TOP_PX);

  const measure = useCallback(() => {
    const anchor = document.getElementById(anchorId);
    if (!anchor) {
      setTop(SHELL_CHAT_TOP_PX);
      return;
    }
    const rect = anchor.getBoundingClientRect();
    setTop(Math.max(SHELL_CHAT_TOP_PX, Math.round(rect.top)));
  }, [anchorId]);

  useEffect(() => {
    if (!enabled) {
      setTop(SHELL_CHAT_TOP_PX);
      return;
    }
    measure();
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(measure);
    });
    const timer = window.setTimeout(measure, 150);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      window.removeEventListener("resize", measure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, measure, ...deps]);

  return top;
}
