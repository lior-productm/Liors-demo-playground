import { en } from "./i18n/locales/en";
import { nl } from "./i18n/locales/nl";
import { he } from "./i18n/locales/he";
import { accountsEn, accountsHe, accountsNl } from "./i18n/locales/accounts";
import { contentHe, contentNl } from "./i18n/locales/content";

export type LanguageCode = "en" | "nl" | "he";
export type TextDirection = "ltr" | "rtl";

export const LANGUAGE_CODES: readonly LanguageCode[] = ["en", "nl", "he"] as const;
export const DEFAULT_LANGUAGE: LanguageCode = "en";

export type LanguageMeta = {
  code: LanguageCode;
  /** Native name shown in selectors (e.g. "עברית"). */
  nativeLabel: string;
  /** English name shown next to the native one. */
  englishLabel: string;
  dir: TextDirection;
  /** BCP-47 tag used for Intl formatting. */
  locale: string;
  /** Regional flag emoji. */
  flag: string;
};

export const LANGUAGES: Record<LanguageCode, LanguageMeta> = {
  en: {
    code: "en",
    nativeLabel: "English",
    englishLabel: "English",
    dir: "ltr",
    locale: "en-GB",
    flag: "🇬🇧",
  },
  nl: {
    code: "nl",
    nativeLabel: "Nederlands",
    englishLabel: "Dutch",
    dir: "ltr",
    locale: "nl-NL",
    flag: "🇳🇱",
  },
  he: {
    code: "he",
    nativeLabel: "עברית",
    englishLabel: "Hebrew",
    dir: "rtl",
    locale: "he-IL",
    flag: "🇮🇱",
  },
};

export const LANGUAGE_LIST: readonly LanguageMeta[] = LANGUAGE_CODES.map(
  (code) => LANGUAGES[code],
);

export function isLanguageCode(value: unknown): value is LanguageCode {
  return typeof value === "string" && LANGUAGE_CODES.includes(value as LanguageCode);
}

type Dictionary = Record<string, string>;

const DICTIONARIES: Record<LanguageCode, Dictionary> = {
  en,
  nl: { ...contentNl, ...nl },
  he: { ...contentHe, ...he },
};
const ACCOUNT_GLOSSARIES: Record<LanguageCode, Dictionary> = {
  en: accountsEn,
  nl: accountsNl,
  he: accountsHe,
};

export type TranslateValues = Record<string, string | number>;
export type TranslateOptions = {
  values?: TranslateValues;
  /** Optional disambiguator; a "{context}::{key}" entry wins over the plain key. */
  context?: string;
};

function interpolate(template: string, values?: TranslateValues): string {
  if (!values) return template;
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

export type Formatter = {
  /** Locale-aware "23 Nov 2025" style date. */
  shortDate: (date: Date) => string;
  /** Formats numbers with locale grouping; passes strings through unchanged. */
  amount: (value: string | number) => string;
  /** Localizes a P&L month header such as "June 2024". */
  monthLabel: (month: string) => string;
};

export type I18n = {
  lang: LanguageCode;
  dir: TextDirection;
  locale: string;
  /** Translate an English source string, falling back to the string itself. */
  t: (key: string, options?: TranslateOptions) => string;
  /** Translate a P&L account / glossary term, falling back to the term. */
  account: (label: string) => string;
  fmt: Formatter;
};

const CACHE = new Map<LanguageCode, I18n>();

export function getI18n(lang: LanguageCode): I18n {
  const cached = CACHE.get(lang);
  if (cached) return cached;

  const meta = LANGUAGES[lang] ?? LANGUAGES[DEFAULT_LANGUAGE];
  const dict = DICTIONARIES[lang] ?? {};
  const accounts = ACCOUNT_GLOSSARIES[lang] ?? {};

  const t = (key: string, options?: TranslateOptions) => {
    const scoped = options?.context ? dict[`${options.context}::${key}`] : undefined;
    return interpolate(scoped ?? dict[key] ?? key, options?.values);
  };

  const account = (label: string) => accounts[label] ?? label;

  const fmt: Formatter = {
    shortDate: (date: Date) =>
      new Intl.DateTimeFormat(meta.locale, {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(date),
    amount: (value: string | number) => {
      if (typeof value === "number") {
        return new Intl.NumberFormat(meta.locale).format(value);
      }
      return value;
    },
    monthLabel: (month: string) => dict[month] ?? month,
  };

  const instance: I18n = {
    lang: meta.code,
    dir: meta.dir,
    locale: meta.locale,
    t,
    account,
    fmt,
  };
  CACHE.set(lang, instance);
  return instance;
}
