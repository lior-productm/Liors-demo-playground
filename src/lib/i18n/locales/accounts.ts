/**
 * P&L account / glossary terms, kept separate from the UI dictionary so
 * `account()` can fall back independently of `t()`. English terms map to
 * themselves implicitly (empty object → fallback to the source label).
 */
export const accountsEn: Record<string, string> = {};

export const accountsNl: Record<string, string> = {
  Revenue: "Omzet",
  "Rental income": "Huurinkomsten",
  "Operating expenses": "Bedrijfskosten",
  "Management fees": "Beheervergoedingen",
  "Net operating income": "Netto bedrijfsresultaat",
  "Interest expense": "Rentelasten",
  "Net result": "Nettoresultaat",
};

export const accountsHe: Record<string, string> = {
  Revenue: "הכנסות",
  "Rental income": "הכנסות משכירות",
  "Operating expenses": "הוצאות תפעול",
  "Management fees": "דמי ניהול",
  "Net operating income": "רווח תפעולי נקי",
  "Interest expense": "הוצאות ריבית",
  "Net result": "תוצאה נקייה",
};
