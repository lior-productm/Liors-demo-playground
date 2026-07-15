"use client";

import { useEffect, useState } from "react";
import {
  SHELL_COLUMN_GAP_PX,
  computeWorkflowSidePanelWidthPx,
} from "@/src/lib/shellLayout";

const LG_PX = 1024;

/** Right inset (px) for a fixed bottom dock when the workflow side panel is open on lg+. */
export function useWorkflowSidePanelReserve(panelOpen: boolean) {
  const [rightPx, setRightPx] = useState(0);

  useEffect(() => {
    if (!panelOpen) {
      setRightPx(0);
      return;
    }

    const update = () => {
      if (window.innerWidth < LG_PX) {
        setRightPx(0);
        return;
      }
      const panelWidth = computeWorkflowSidePanelWidthPx(window.innerWidth);
      setRightPx(panelWidth + SHELL_COLUMN_GAP_PX);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [panelOpen]);

  return rightPx;
}
