"use client";

import { useEffect } from "react";
import { LANGUAGES } from "@/src/lib/i18n";
import { useInterfaceLanguage } from "@/src/hooks/useI18n";

/**
 * Keeps <html lang/dir> in sync with the stored interface language so the whole
 * app flips to RTL for Hebrew. Rendered once near the root; renders nothing.
 */
export function I18nProvider({ children }: { children: React.ReactNode }) {
  const lang = useInterfaceLanguage();

  useEffect(() => {
    const meta = LANGUAGES[lang];
    const root = document.documentElement;
    root.lang = meta.code;
    root.dir = meta.dir;
  }, [lang]);

  return <>{children}</>;
}
