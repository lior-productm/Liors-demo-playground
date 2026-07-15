"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { clearPinnedAiAssistants } from "@/src/lib/aiAssistantNavState";

/** Demo helper: `/ai-assistants?fresh-ai-nav=1` clears pinned assistant sidebar state. */
export function AiAssistantNavReset() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("fresh-ai-nav") !== "1") return;
    if (!pathname.startsWith("/ai-assistants")) return;

    clearPinnedAiAssistants();

    const next = new URLSearchParams(searchParams.toString());
    next.delete("fresh-ai-nav");
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }, [pathname, router, searchParams]);

  return null;
}
