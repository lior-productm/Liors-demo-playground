"use client";

import { useId, useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrendPill } from "@/src/components/commercial/TrendPill";

type TenantAvatarKind = "scalehub" | "verizon" | "globex" | "schweppes";

const tenants: Array<{
  name: string;
  avatar: TenantAvatarKind;
  details: string;
  gri: string;
  price: string;
  trend: string;
}> = [
  {
    name: "Hey Jude B.V.",
    avatar: "scalehub",
    details: "Energy: C | Condition: Average | Available: Q3 2026",
    gri: "€156,000",
    price: "€185/sqm/yr",
    trend: "+1.5%",
  },
  {
    name: "Verizon Nederland B.V.",
    avatar: "verizon",
    details: "Energy: C | Condition: Average | Available: Q3 2026",
    gri: "€156,000",
    price: "€185/sqm/yr",
    trend: "+1.5%",
  },
  {
    name: "Globex Corporation",
    avatar: "globex",
    details: "Energy: C | Condition: Average | Available: Q3 2026",
    gri: "€156,000",
    price: "€165/sqm/yr",
    trend: "+1.5%",
  },
  {
    name: "Schweppes International Ltd.",
    avatar: "schweppes",
    details: "Energy: C | Condition: Average | Available: Q3 2026",
    gri: "€156,000",
    price: "€185/sqm/yr",
    trend: "+1.5%",
  },
];

/** Logo-style 60×60 tiles (Figma tenant picker); illustrative SVGs for demo — swap for brand assets if supplied. */
function TenantRowAvatar({ kind }: { kind: TenantAvatarKind }) {
  const globeGradientId = `globe-shine-${useId().replace(/:/g, "")}`;
  const box = "flex h-[60px] w-[60px] shrink-0 items-center justify-center overflow-hidden rounded-[8px]";
  switch (kind) {
    case "scalehub":
      return (
        <div className={cn(box, "border border-[#E6E8EB] bg-white")} aria-hidden>
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <path d="M22 6L34 22L22 38L10 22L22 6Z" fill="#233FDE" />
            <path d="M22 12L30 22L22 32L14 22L22 12Z" fill="#2DD4BF" />
          </svg>
        </div>
      );
    case "verizon":
      return (
        <div className={cn(box, "bg-[#0A0A0A]")} aria-hidden>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <path
              d="M10 9L18 27L26 9"
              stroke="#E60012"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );
    case "globex":
      return (
        <div className={cn(box, "bg-gradient-to-br from-[#9CA3AF] to-[#6B7280]")} aria-hidden>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="13" stroke="#E7E5E4" strokeWidth="1.5" />
            <ellipse cx="20" cy="20" rx="5" ry="13" stroke="#D6D3D1" strokeWidth="1.2" />
            <line x1="7" y1="20" x2="33" y2="20" stroke="#D6D3D1" strokeWidth="1" />
            <path
              d="M20 7C14 12 12 20 20 33C28 20 26 12 20 7Z"
              fill={`url(#${globeGradientId})`}
              opacity="0.35"
            />
            <defs>
              <linearGradient id={globeGradientId} x1="12" y1="8" x2="28" y2="32" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F5F5F4" />
                <stop offset="1" stopColor="#78716C" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      );
    case "schweppes":
      return (
        <div
          className={cn(box, "bg-[#0A0A0A] px-1")}
          aria-hidden
        >
          <span
            className="text-center font-serif text-[11px] font-semibold italic leading-[1.05] tracking-tight text-[#C9A227]"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Schweppes
          </span>
        </div>
      );
    default:
      return <div className={cn(box, "bg-[#E6E8EB]")} aria-hidden />;
  }
}

export function TenantModal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (tenantName: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  if (!open) return null;

  const filtered = tenants.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.gri.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative flex w-[905px] flex-col gap-5 rounded-xl bg-[#FBFBFB] px-[31px] py-8 shadow-[0px_10px_28px_0px_rgba(0,0,0,0.14)]">
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-3 flex h-6 w-6 items-center justify-center rounded-full hover:bg-[#E6E8EB]"
        >
          <X className="h-4 w-4 text-[#65686B]" />
        </button>

        {/* Header */}
        <p className="text-[14px] font-medium text-[#7E8185]">TENANT HUB</p>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h2 className="text-[20px] font-medium text-[#121212]">
              Select a tenant
            </h2>
            <p className="text-[16px] text-[#2C2C2C]">
              View detailed portfolio details per tenant.
            </p>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#838697]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, ID or GRI value..."
                className="h-12 w-full rounded-full bg-[#E6E8EB] pl-12 pr-4 text-[16px] text-[#121212] placeholder:text-[#838697] outline-none focus:ring-2 focus:ring-[#233FDE]/20"
              />
            </div>
          </div>

          {/* Tenant Cards */}
          <div className="flex flex-col gap-4">
            {filtered.map((t) => (
              <button
                key={t.name}
                type="button"
                onClick={() => setSelected(t.name)}
                className={cn(
                  "flex items-center justify-between rounded-2xl border p-4 transition-all",
                  selected === t.name
                    ? "border-[#233FDE] bg-[#EEF0FF]/40 shadow-[0_0_0_2px_rgba(35,63,222,0.15)]"
                    : "border-[rgba(230,231,232,0.7)] hover:border-[#B3B8BD] hover:shadow-sm",
                )}
              >
                <div className="flex min-w-0 items-center gap-4" style={{ width: 400 }}>
                  <TenantRowAvatar kind={t.avatar} />
                  <div className="min-w-0 flex flex-col items-start text-left">
                    <span className="text-[14px] font-semibold text-[#010309]">
                      {t.name}
                    </span>
                    <span className="text-[12px] text-[#65686B]">
                      {t.details}
                    </span>
                  </div>
                </div>

                <span className="w-[88px] text-[12px] font-medium text-[#65686B]">
                  GRI: {t.gri}
                </span>

                <div className="flex items-center gap-3">
                  <span className="w-[103px] text-right text-[14px] font-medium text-[#010309]">
                    {t.price}
                  </span>
                  <div className="flex w-[103px] items-center justify-end gap-0.5">
                    <TrendPill direction="up" pct={t.trend} />
                    <span className="text-[12px] text-[#65686B]">
                      vs subject
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex h-12 w-[92px] items-center justify-center rounded-full border border-[#B3B8BD] text-[14px] font-medium text-[#010309] transition-colors hover:bg-[#F2F4F7]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (selected) {
                onConfirm(selected);
                setSelected(null);
                setSearch("");
              }
            }}
            disabled={!selected}
            className={cn(
              "flex h-12 items-center justify-center rounded-full px-4 text-[14px] font-medium transition-colors",
              selected
                ? "bg-[#121212] text-[#F0F2F5] hover:bg-[#353638]"
                : "bg-[#B3B8BD] text-[#F0F2F5] cursor-not-allowed",
            )}
          >
            Confirm Selection
          </button>
        </div>
      </div>
    </div>
  );
}
