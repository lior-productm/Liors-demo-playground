import { readLocalJson, writeLocalJson } from "@/src/lib/browserStorage";
import { DEFAULT_LANGUAGE, isLanguageCode, type LanguageCode } from "@/src/lib/i18n";

const STORAGE_KEY = "amiio:interface-language";
const CHANGE_EVENT = "amiio:language-change";

export function getStoredLanguage(): LanguageCode {
  const value = readLocalJson<LanguageCode>(STORAGE_KEY, DEFAULT_LANGUAGE);
  return isLanguageCode(value) ? value : DEFAULT_LANGUAGE;
}

export function setStoredLanguage(lang: LanguageCode) {
  writeLocalJson(STORAGE_KEY, lang);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: lang }));
  }
}

/** Subscribe to interface-language changes (same tab + cross-tab). */
export function subscribeLanguage(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === STORAGE_KEY) callback();
  };
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", onStorage);
  };
}
