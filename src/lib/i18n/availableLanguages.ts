import { readLocalJson, writeLocalJson } from "@/src/lib/browserStorage";
import { LANGUAGE_CODES, isLanguageCode, type LanguageCode } from "@/src/lib/i18n";

const STORAGE_KEY = "amiio:available-languages";
const CHANGE_EVENT = "amiio:available-languages-change";

/** Shared stable reference for "all languages" so getSnapshot never churns. */
const ALL_CODES: LanguageCode[] = [...LANGUAGE_CODES];

/** Keeps the stored codes in the canonical LANGUAGE_CODES order and drops anything no longer supported. */
function normalize(codes: readonly LanguageCode[]): LanguageCode[] {
  return LANGUAGE_CODES.filter((code) => codes.includes(code));
}

// Cache the parsed snapshot keyed on the raw string so useSyncExternalStore
// receives a stable reference until the stored value actually changes.
let cachedRaw: string | null | undefined;
let cachedValue: LanguageCode[] = ALL_CODES;

function computeFromRaw(raw: string | null): LanguageCode[] {
  if (!raw) return ALL_CODES;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return ALL_CODES;
    const valid = normalize(parsed.filter(isLanguageCode));
    // A corrupt/empty saved value falls back to showing everything.
    return valid.length > 0 ? valid : ALL_CODES;
  } catch {
    return ALL_CODES;
  }
}

/**
 * Returns the codes the user has chosen to expose in language selectors.
 * Defaults to every supported language when nothing has been saved yet, so
 * existing users (and anyone who never opens the manager) see no change.
 */
export function getAvailableLanguages(): LanguageCode[] {
  if (typeof window === "undefined") return ALL_CODES;
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    raw = null;
  }
  if (raw === cachedRaw) return cachedValue;
  cachedRaw = raw;
  cachedValue = computeFromRaw(raw);
  return cachedValue;
}

/** Stable server/initial snapshot. */
export function getAvailableLanguagesServerSnapshot(): LanguageCode[] {
  return ALL_CODES;
}

export function setAvailableLanguages(codes: readonly LanguageCode[]) {
  writeLocalJson(STORAGE_KEY, normalize(codes));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
  }
}

/** Subscribe to available-language changes (same tab + cross-tab). */
export function subscribeAvailableLanguages(callback: () => void): () => void {
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
