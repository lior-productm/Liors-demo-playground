"use client";

import { useEffect, useState } from "react";
import {
  SHELL_WORKFLOW_CHAT_COLUMN_MAX_PX,
  computeWorkflowChatColumnMaxPx,
} from "@/src/lib/shellLayout";

/** Fluid workflow column width — up to 734px on full displays, scales when side panel is open. */
export function useWorkflowChatColumnMaxPx(sidePanelOpen: boolean) {
  const [maxPx, setMaxPx] = useState(SHELL_WORKFLOW_CHAT_COLUMN_MAX_PX);

  useEffect(() => {
    const update = () => {
      setMaxPx(computeWorkflowChatColumnMaxPx(window.innerWidth, sidePanelOpen));
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [sidePanelOpen]);

  return maxPx;
}
