import { reportsHe, reportsNl } from "./reports";
import { financialHe, financialNl } from "./financial";
import { commercialHe, commercialNl } from "./commercial";
import { analystsHe, analystsNl } from "./analysts";
import { secondaryHe, secondaryNl } from "./secondary";

/** Merged CONTENT dictionaries (feature data strings), kept separate from chrome. */
export const contentHe: Record<string, string> = {
  ...reportsHe,
  ...financialHe,
  ...commercialHe,
  ...analystsHe,
  ...secondaryHe,
};

export const contentNl: Record<string, string> = {
  ...reportsNl,
  ...financialNl,
  ...commercialNl,
  ...analystsNl,
  ...secondaryNl,
};
