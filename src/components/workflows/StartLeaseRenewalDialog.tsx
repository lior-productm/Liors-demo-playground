"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDownRight, FolderOpen, Grid2x2, Home, Search, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  getAllLeaseTenantsForScope,
  getLeaseEntityOptions,
  getLeasePortfolioOptions,
  getLeasePropertyOptions,
} from "@/src/lib/leaseBackendData";
import type { LeaseRenewalContext } from "@/src/types/leaseRenewal";
import type { WorkflowTenantOption } from "@/src/types/workflows";

type DialogStep = "asset" | "tenant";

/** Three 216px pills + 16px gaps — matches Figma filter row width (680px). */
const LEASE_RENEWAL_FILTER_ROW_PX = 216 * 3 + 16 * 2;

type TenantCardDetails = {
  energy: string;
  assetUse: string;
  tenantType: string;
  gri: string;
  rent: string;
  trendPct: string;
  avatarBg: string;
  avatar: string;
};

const TENANT_CARD_DETAILS: Record<string, TenantCardDetails> = {
  "scalehub iii b.v.": {
    energy: "C",
    assetUse: "Office",
    tenantType: "Single-tenant",
    gri: "€156,000",
    rent: "€185/sqm/yr",
    trendPct: "1.5%",
    avatarBg: "#E8F4FD",
    avatar: "SH",
  },
  "caesar consulting b.v.": {
    energy: "B",
    assetUse: "Office",
    tenantType: "Single-tenant",
    gri: "€142,000",
    rent: "€178/sqm/yr",
    trendPct: "1.2%",
    avatarBg: "#F3E8FD",
    avatar: "CC",
  },
  "logistics plus gmbh": {
    energy: "C",
    assetUse: "Industrial",
    tenantType: "Multi-tenant",
    gri: "€156,000",
    rent: "€165/sqm/yr",
    trendPct: "1.5%",
    avatarBg: "#E6F6F3",
    avatar: "LP",
  },
  "meridian retail ltd.": {
    energy: "C",
    assetUse: "Retail",
    tenantType: "Single-tenant",
    gri: "€156,000",
    rent: "€185/sqm/yr",
    trendPct: "1.5%",
    avatarBg: "#FFF4E5",
    avatar: "MR",
  },
  "verizon nederland b.v.": {
    energy: "C",
    assetUse: "Retail",
    tenantType: "Single-tenant",
    gri: "€156,000",
    rent: "€185/sqm/yr",
    trendPct: "1.5%",
    avatarBg: "#E8EEF8",
    avatar: "VZ",
  },
  "globex corporation": {
    energy: "C",
    assetUse: "Industrial",
    tenantType: "Multi-tenant",
    gri: "€156,000",
    rent: "€165/sqm/yr",
    trendPct: "1.5%",
    avatarBg: "#F0F2F5",
    avatar: "GC",
  },
  "schweppes international ltd.": {
    energy: "C",
    assetUse: "Parking",
    tenantType: "Multi-tenant",
    gri: "€156,000",
    rent: "€185/sqm/yr",
    trendPct: "1.5%",
    avatarBg: "#FFF0F0",
    avatar: "SI",
  },
};

const DEFAULT_TENANT_CARD: TenantCardDetails = {
  energy: "C",
  assetUse: "Office",
  tenantType: "Single-tenant",
  gri: "€156,000",
  rent: "€185/sqm/yr",
  trendPct: "1.5%",
  avatarBg: "#E6E8EB",
  avatar: "TN",
};

function tenantCardDetails(name: string): TenantCardDetails {
  const preset = TENANT_CARD_DETAILS[name.toLowerCase()];
  if (preset) return preset;
  const initials = name
    .split(/\s+/)
    .map((part) => part.replace(/[^A-Za-z0-9]/g, ""))
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2);
  return { ...DEFAULT_TENANT_CARD, avatar: initials || "TN" };
}

function FilterClearButton({
  ariaLabel,
  onClear,
}: {
  ariaLabel: string;
  onClear: () => void;
}) {
  return (
    <span
      role="button"
      tabIndex={0}
      className="flex size-6 shrink-0 translate-y-0.5 cursor-pointer items-center justify-center rounded-full hover:bg-black/5"
      aria-label={ariaLabel}
      onPointerDown={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          onClear();
        }
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClear();
      }}
    >
      <X className="size-4 text-[#39393A]" strokeWidth={1.75} />
    </span>
  );
}

function LeaseRenewalScopePill({
  icon: Icon,
  placeholder,
  value,
  options,
  onChange,
  onClear,
  disabled,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  placeholder: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  onClear?: () => void;
  disabled?: boolean;
}) {
  const hasValue = Boolean(value);
  const showClear = hasValue && Boolean(onClear);

  return (
    <Select
      value={hasValue ? value : undefined}
      onValueChange={onChange}
      disabled={disabled}
    >
      <SelectTrigger
        hideIcon={showClear}
        icon={
          showClear ? (
            <FilterClearButton ariaLabel={`Clear ${placeholder}`} onClear={onClear!} />
          ) : undefined
        }
        className={cn(
          "h-10 w-[216px] shrink-0 gap-2 rounded-[32px] border border-solid bg-[#F0F2F5] px-3 py-2 shadow-none focus:ring-0 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-60 [&>span:last-child]:shrink-0 [&>svg:last-child]:size-6 [&>svg:last-child]:text-[#353638]",
          hasValue
            ? "border-[#65686B] font-medium text-[#353638]"
            : "border-[#D1D5D9] font-normal text-[#7E8185]",
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-1.5 pr-1">
          <Icon className="size-4 shrink-0 text-[#353638]" strokeWidth={1.75} />
          <SelectValue
            placeholder={placeholder}
            className={cn(
              "min-w-0 flex-1 truncate text-left text-[16px] leading-[1.5]",
              hasValue ? "font-medium text-[#353638]" : "font-normal text-[#7E8185]",
            )}
          />
        </div>
      </SelectTrigger>
      <SelectContent
        position="popper"
        side="bottom"
        align="start"
        sideOffset={8}
        avoidCollisions={false}
        className="z-[250] max-h-72 rounded-[8px] border border-[#E6E8EB] p-2 shadow-[0_10px_28px_rgba(0,0,0,0.14)] [&>div:nth-child(2)]:!h-auto [&>div:nth-child(2)]:max-h-60"
      >
        {options.map((opt) => (
          <SelectItem
            key={opt}
            value={opt}
            className="h-[41px] cursor-pointer rounded-[4px] px-1.5 text-[16px] font-normal leading-[1.25] text-[#353638] data-[highlighted]:bg-[#F7F8FA]"
          >
            {opt}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function LeaseRenewalTenantCard({
  tenant,
  selected,
  onSelect,
}: {
  tenant: WorkflowTenantOption;
  selected: boolean;
  onSelect: () => void;
}) {
  const details = tenantCardDetails(tenant.name);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-center justify-between gap-4 rounded-2xl border border-[rgba(230,231,232,0.7)] p-4 text-left transition-colors",
        selected
          ? "border-[#65686B] bg-[#F7F8FA] ring-2 ring-[#A7B2F2]/40"
          : "bg-white hover:bg-[#FAFBFC]",
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <div
          className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-[rgba(230,231,232,0.7)] text-[12px] font-semibold text-[#353638]"
          style={{ backgroundColor: details.avatarBg }}
        >
          {details.avatar}
        </div>
        <div className="min-w-0">
          <p className="truncate text-[14px] font-semibold leading-5 text-[#010309]">
            {tenant.name}
          </p>
          <p className="mt-0.5 truncate text-[12px] leading-4 text-[#65686B]">
            Energy: {details.energy} | Asset use: {details.assetUse} | Tenant type:{" "}
            {details.tenantType}
          </p>
        </div>
      </div>
      <div className="hidden shrink-0 flex-col items-start sm:flex">
        <span className="text-[12px] font-medium leading-[1.25] text-[#65686B]">
          GRI: {details.gri}
        </span>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-0.5">
        <span className="text-[14px] font-medium leading-[1.24] text-[#010309]">
          {details.rent}
        </span>
        <div className="flex items-center gap-1">
          <span className="inline-flex items-center gap-0.5 rounded-lg bg-[#E6F6F3] px-1 py-0.5 text-[12px] font-medium text-[#1F9E8B]">
            <ArrowDownRight className="size-4 rotate-180" strokeWidth={1.75} />
            {details.trendPct}
          </span>
          <span className="text-[12px] text-[#65686B]">vs subject</span>
        </div>
      </div>
    </button>
  );
}

function DialogFooter({
  canStart,
  onCancel,
  onStart,
}: {
  canStart: boolean;
  onCancel: () => void;
  onStart: () => void;
}) {
  return (
    <div className="flex w-full justify-end gap-4">
      <button
        type="button"
        onClick={onCancel}
        className="inline-flex h-12 min-w-[92px] items-center justify-center rounded-full border border-[#B3B8BD] px-4 text-[14px] font-medium leading-[1.24] text-[#010309] hover:bg-[#F3F6FA]"
      >
        Cancel
      </button>
      <button
        type="button"
        disabled={!canStart}
        onClick={onStart}
        className={cn(
          "inline-flex h-12 min-w-[123px] items-center justify-center rounded-full px-4 text-[14px] font-medium leading-[1.24] transition-colors",
          canStart
            ? "cursor-pointer bg-[#B3B8BD] text-[#353638] hover:bg-[#010309] hover:text-[#F0F2F5] active:bg-[#010309] active:text-[#F0F2F5] focus-visible:bg-[#010309] focus-visible:text-[#F0F2F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#233FDE]/25"
            : "cursor-not-allowed bg-[#B3B8BD] text-[#7E8185]",
        )}
      >
        Start process
      </button>
    </div>
  );
}

export function StartLeaseRenewalDialog({
  open,
  onOpenChange,
  onStart,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStart: (context: LeaseRenewalContext) => void;
}) {
  const [step, setStep] = useState<DialogStep>("asset");
  const [portfolio, setPortfolio] = useState("All portfolio");
  const [entity, setEntity] = useState("");
  const [property, setProperty] = useState("");
  const [selectedTenantId, setSelectedTenantId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!open) return;
    setStep("asset");
    setPortfolio("All portfolio");
    setEntity("");
    setProperty("");
    setSelectedTenantId("");
    setSearchQuery("");
  }, [open]);

  const portfolioOptions = getLeasePortfolioOptions();
  const entityOptions = getLeaseEntityOptions(portfolio);
  const propertyOptions = getLeasePropertyOptions(portfolio, entity);

  const tenantOptions = useMemo(
    () =>
      property
        ? getAllLeaseTenantsForScope({ portfolio, entity, property })
        : [],
    [portfolio, entity, property],
  );

  const filteredTenants = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return tenantOptions;
    return tenantOptions.filter((tenant) => {
      const details = tenantCardDetails(tenant.name);
      return (
        tenant.name.toLowerCase().includes(q) ||
        tenant.id.toLowerCase().includes(q) ||
        details.gri.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, tenantOptions]);

  const selectedTenant = tenantOptions.find((t) => t.id === selectedTenantId);

  const assetComplete = Boolean(portfolio && entity && property);
  const canStartProcess =
    step === "asset" ? assetComplete : Boolean(selectedTenant);

  const closeDialog = () => onOpenChange(false);

  const startWorkflow = (tenant: WorkflowTenantOption) => {
    onStart({
      tenantName: tenant.name,
      portfolio,
      entity,
      property,
    });
    closeDialog();
  };

  const handleStartProcess = () => {
    if (step === "asset") {
      if (!assetComplete) return;
      setStep("tenant");
      return;
    }
    if (!selectedTenant) return;
    startWorkflow(selectedTenant);
  };

  const handlePropertyChange = (value: string) => {
    setProperty(value);
    setSelectedTenantId("");
    setSearchQuery("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "gap-0 overflow-y-auto rounded-xl border border-[rgba(230,231,232,0.7)] bg-[#FBFBFB] p-0 shadow-[0px_10px_14px_rgba(0,0,0,0.14)]",
          step === "tenant"
            ? "w-full max-w-[min(905px,calc(100vw-2rem))] max-h-[min(90vh,860px)]"
            : "w-fit max-w-[calc(100vw-2rem)] max-h-[min(90vh,480px)]",
        )}
      >
        <DialogTitle className="sr-only">Start Lease Renewal</DialogTitle>
        <div
          className={cn(
            "relative flex flex-col gap-5 px-8 pb-8 pt-8",
            step === "asset" && "w-fit max-w-full",
          )}
        >
          <button
            type="button"
            onClick={closeDialog}
            className="absolute right-5 top-2 flex size-6 items-center justify-center rounded-full p-1.5 text-[#65686B] hover:bg-[#F3F6FA]"
            aria-label="Close"
          >
            <X className="size-4" strokeWidth={1.75} />
          </button>

          <p className="text-[14px] font-medium leading-[1.5] text-[#7E8185]">
            LEASING RENEWAL PROCESS
          </p>

          <div className={cn("flex flex-col", step === "tenant" && "gap-8")}>
            <div className="flex flex-col gap-5">
              <h2 className="text-[20px] font-medium leading-[1.25] text-[#121212]">
                Select an asset
              </h2>
              <div
                className="flex w-max max-w-full flex-nowrap items-start gap-x-4 gap-y-2"
                style={{ maxWidth: LEASE_RENEWAL_FILTER_ROW_PX }}
              >
                <LeaseRenewalScopePill
                  icon={Grid2x2}
                  placeholder="All portfolio"
                  value={portfolio}
                  options={portfolioOptions}
                  onChange={(value) => {
                    setPortfolio(value);
                    setEntity("");
                    setProperty("");
                    setSelectedTenantId("");
                    setSearchQuery("");
                    setStep("asset");
                  }}
                />
                <LeaseRenewalScopePill
                  icon={FolderOpen}
                  placeholder="Selected entity"
                  value={entity}
                  options={entityOptions}
                  disabled={entityOptions.length === 0}
                  onChange={(value) => {
                    setEntity(value);
                    setProperty("");
                    setSelectedTenantId("");
                    setSearchQuery("");
                    setStep("asset");
                  }}
                  onClear={
                    entity
                      ? () => {
                          setEntity("");
                          setProperty("");
                          setSelectedTenantId("");
                          setSearchQuery("");
                          setStep("asset");
                        }
                      : undefined
                  }
                />
                <LeaseRenewalScopePill
                  icon={Home}
                  placeholder="Select property"
                  value={property}
                  options={propertyOptions}
                  disabled={!entity || propertyOptions.length === 0}
                  onChange={handlePropertyChange}
                  onClear={
                    property
                      ? () => {
                          setProperty("");
                          setSelectedTenantId("");
                          setSearchQuery("");
                          setStep("asset");
                        }
                      : undefined
                  }
                />
              </div>
            </div>

            {step === "tenant" ? (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <h2 className="text-[20px] font-medium leading-[1.25] text-[#121212]">
                    Select a tenant
                  </h2>
                  <p className="text-[16px] font-normal leading-[1.5] text-[#2C2C2C]">
                    View detailed portfolio details per tenant.
                  </p>
                  <label className="relative block w-full">
                    <Search
                      className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-[#838697]"
                      strokeWidth={1.75}
                    />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name, ID or GRI value..."
                      className="h-12 w-full rounded-[50px] border-0 bg-[#E6E8EB] py-3.5 pl-12 pr-4 text-[16px] text-[#353638] placeholder:text-[#838697] outline-none focus-visible:ring-2 focus-visible:ring-[#233FDE]/20"
                    />
                  </label>
                </div>

                <div className="flex max-h-[min(52vh,420px)] flex-col gap-4 overflow-y-auto pr-1">
                  {filteredTenants.length === 0 ? (
                    <p className="rounded-2xl border border-dashed border-[#E6E8EB] px-4 py-8 text-center text-[14px] text-[#65686B]">
                      No tenants match your search for this property.
                    </p>
                  ) : (
                    filteredTenants.map((tenant) => (
                      <LeaseRenewalTenantCard
                        key={tenant.id}
                        tenant={tenant}
                        selected={selectedTenantId === tenant.id}
                        onSelect={() => {
                          setSelectedTenantId(tenant.id);
                          startWorkflow(tenant);
                        }}
                      />
                    ))
                  )}
                </div>
              </div>
            ) : null}
          </div>

          <DialogFooter
            canStart={canStartProcess}
            onCancel={closeDialog}
            onStart={handleStartProcess}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function buildLeaseRenewalLaunchHref(context: LeaseRenewalContext) {
  const params = new URLSearchParams({
    launch: "overview",
    tenant: context.tenantName,
  });
  if (context.portfolio) params.set("portfolio", context.portfolio);
  if (context.entity) params.set("entity", context.entity);
  if (context.property) params.set("property", context.property);
  return `/workflows/leasing-renewal?${params.toString()}`;
}
