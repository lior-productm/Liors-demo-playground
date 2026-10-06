"use client";

import { useSyncExternalStore } from "react";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_LIST,
  getI18n,
  type I18n,
  type LanguageCode,
  type LanguageMeta,
} from "@/src/lib/i18n";
import {
  getStoredLanguage,
  setStoredLanguage,
  subscribeLanguage,
} from "@/src/lib/i18n/languagePreference";
import {
  getAvailableLanguages,
  getAvailableLanguagesServerSnapshot,
  setAvailableLanguages,
  subscribeAvailableLanguages,
} from "@/src/lib/i18n/availableLanguages";

/** Reads the active interface language (localStorage-backed, cross-tab aware). */
export function useInterfaceLanguage(): LanguageCode {
  return useSyncExternalStore(
    subscribeLanguage,
    getStoredLanguage,
    () => DEFAULT_LANGUAGE,
  );
}

/** Persists a new interface language; notifies every subscriber. */
export function setInterfaceLanguage(lang: LanguageCode) {
  setStoredLanguage(lang);
}

/** Reads the raw list of codes the user has chosen to expose (localStorage-backed). */
export function useAvailableLanguageCodes(): LanguageCode[] {
  return useSyncExternalStore(
    subscribeAvailableLanguages,
    getAvailableLanguages,
    getAvailableLanguagesServerSnapshot,
  );
}

/**
 * Language metadata for the selectors, filtered to the user's chosen languages.
 * The active interface language is always included so a user can never be
 * stranded on a language that has been hidden from the list.
 */
export function useAvailableLanguages(): LanguageMeta[] {
  const activeLang = useInterfaceLanguage();
  const codes = useAvailableLanguageCodes();
  return LANGUAGE_LIST.filter(
    (meta) => codes.includes(meta.code) || meta.code === activeLang,
  );
}

/** Persists a new set of available languages; notifies every subscriber. */
export function setInterfaceAvailableLanguages(codes: readonly LanguageCode[]) {
  setAvailableLanguages(codes);
}

/**
 * Returns the translator/formatter bound to the current interface language.
 * Components destructure `{ t, fmt, account }` or read `dir`/`lang`.
 */
export function useI18n(): I18n {
  const lang = useInterfaceLanguage();
  return getI18n(lang);
}
