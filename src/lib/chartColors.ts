/** Shared bar column sizing for commercial overview / lease expiry charts. */
export const COMMERCIAL_BAR_CHART_BAR_CLASS =
  "mx-auto w-[68%] min-w-[24px] max-w-[40px] shrink-0 cursor-pointer rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#010309] focus-visible:ring-offset-2";

/** Mix a hex color toward white — one step lighter for bar hover/highlight. */
export function lightenHexColor(hex: string, amount = 0.18): string {
  const normalized = hex.trim().replace(/^#/, "");
  if (normalized.length !== 6) return hex;

  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  const mix = (channel: number) =>
    Math.min(255, Math.round(channel + (255 - channel) * amount));
  const toHex = (n: number) => n.toString(16).padStart(2, "0");

  return `#${toHex(mix(r))}${toHex(mix(g))}${toHex(mix(b))}`;
}
