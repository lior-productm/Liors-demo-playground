import type { WorkflowTenantOption } from "@/src/types/workflows";

type LeaseBackendRow = {
  portfolio: string;
  entity: string;
  property: string;
  tenant_name: string;
  /** Existing backend field used for lease-renewal ranking. */
  lease_expiry_date: string;
};

type LeaseScopeDef = {
  portfolio: string;
  entity: string;
  property: string;
  tenants: readonly [string, string, string, string, string];
};

/** Exactly five tenants per portfolio · entity · property scope. */
const LEASE_SCOPE_DEFINITIONS: LeaseScopeDef[] = [
  {
    portfolio: "All portfolio",
    entity: "Entity X",
    property: "Wenckebachweg 90-98",
    tenants: [
      "Hey Jude B.V.",
      "Verizon Nederland B.V.",
      "Globex Corporation",
      "Schweppes International Ltd.",
      "Caesar Consulting B.V.",
    ],
  },
  {
    portfolio: "All portfolio",
    entity: "Entity X",
    property: "H.J.E. Wenckebachweg 123",
    tenants: [
      "Hey Jude B.V.",
      "Amsterdam Office Group B.V.",
      "Atlas Legal B.V.",
      "FinEdge Partners B.V.",
      "TechVenture Amsterdam B.V.",
    ],
  },
  {
    portfolio: "All portfolio",
    entity: "Entity Y",
    property: "Herengracht Offices",
    tenants: [
      "Atlas Legal B.V.",
      "Vertex Capital B.V.",
      "Holland Strategy Group",
      "Dutch Design Collective B.V.",
      "Canal House Legal B.V.",
    ],
  },
  {
    portfolio: "All portfolio",
    entity: "Entity Y",
    property: "Prinsengracht 100",
    tenants: [
      "Canal View Holdings B.V.",
      "Heritage Capital B.V.",
      "Gallery Nine B.V.",
      "WestEnd Workspace B.V.",
      "Prinsengracht Retail B.V.",
    ],
  },
  {
    portfolio: "All portfolio",
    entity: "Entity Z",
    property: "Zuidas Tower",
    tenants: [
      "BlueNova Analytics B.V.",
      "FinEdge Partners B.V.",
      "Summit Advisory B.V.",
      "Nordic Capital Amsterdam B.V.",
      "CloudNine Software B.V.",
    ],
  },
  {
    portfolio: "All portfolio",
    entity: "Z holdings",
    property: "Amsterdam Science Park",
    tenants: [
      "LabCore Research B.V.",
      "BioNova Labs B.V.",
      "GreenLeaf Co-working B.V.",
      "Oranje Media Group B.V.",
      "DataPulse Analytics B.V.",
    ],
  },
  {
    portfolio: "All portfolio",
    entity: "Z holdings",
    property: "Rotterdam Harbour Offices",
    tenants: [
      "Harbourline Shipping B.V.",
      "Delta Freight B.V.",
      "North Sea Logistics B.V.",
      "Portside Trading B.V.",
      "Maritime Lease Co. B.V.",
    ],
  },
  {
    portfolio: "All portfolio",
    entity: "Penny Lane",
    property: "Wenckebachweg 90-98",
    tenants: [
      "Penny Lane Tenant Co.",
      "North Quarter Retail B.V.",
      "MetroLink Offices B.V.",
      "UrbanMetric B.V.",
      "Beacon Retail Group",
    ],
  },
  {
    portfolio: "Portfolio A",
    entity: "Entity X",
    property: "Wenckebachweg 90-98",
    tenants: [
      "Hey Jude B.V.",
      "Logistics Plus GmbH",
      "Meridian Retail Ltd.",
      "Nova Workspace AG",
      "Northline Ventures B.V.",
    ],
  },
  {
    portfolio: "Portfolio A",
    entity: "Entity X",
    property: "H.J.E. Wenckebachweg 123",
    tenants: [
      "Amsterdam Office Group B.V.",
      "Verizon Nederland B.V.",
      "Globex Corporation",
      "Schweppes International Ltd.",
      "Riverside Foods B.V.",
    ],
  },
  {
    portfolio: "Portfolio A",
    entity: "Entity X",
    property: "Amsterdam Science Park",
    tenants: [
      "BioNova Labs B.V.",
      "LabCore Research B.V.",
      "Genomics Hub B.V.",
      "CleanTech Labs B.V.",
      "Pharma Lease NL B.V.",
    ],
  },
  {
    portfolio: "Portfolio A",
    entity: "Penny Lane",
    property: "Wenckebachweg 90-98",
    tenants: [
      "North Quarter Retail B.V.",
      "Penny Lane Tenant Co.",
      "GreenLeaf Co-working B.V.",
      "Amstel Business Center B.V.",
      "Oranje Media Group B.V.",
    ],
  },
  {
    portfolio: "Portfolio A",
    entity: "Penny Lane",
    property: "Sloterdijk Central",
    tenants: [
      "MetroLink Offices B.V.",
      "Central Station Retail B.V.",
      "Transit Hub Offices B.V.",
      "RailSide Logistics B.V.",
      "Sloterdijk Retail B.V.",
    ],
  },
  {
    portfolio: "Portfolio A",
    entity: "Z holdings",
    property: "Rotterdam Harbour Offices",
    tenants: [
      "Delta Freight B.V.",
      "Harbourline Shipping B.V.",
      "EuroPort Tenants B.V.",
      "Container Line NL B.V.",
      "Harbour View Offices B.V.",
    ],
  },
  {
    portfolio: "Portfolio A",
    entity: "Z holdings",
    property: "Utrecht Central Plaza",
    tenants: [
      "Central Station Retail B.V.",
      "Utrecht Finance Hub B.V.",
      "Plaza Retail Group B.V.",
      "Central Link B.V.",
      "Utrecht Workspace B.V.",
    ],
  },
  {
    portfolio: "Portfolio B",
    entity: "Entity Y",
    property: "Herengracht Offices",
    tenants: [
      "Holland Strategy Group",
      "Vertex Capital B.V.",
      "Amsterdam Heritage Fund B.V.",
      "Summit Advisory B.V.",
      "Herengracht Legal B.V.",
    ],
  },
  {
    portfolio: "Portfolio B",
    entity: "Entity Y",
    property: "Prinsengracht 100",
    tenants: [
      "Heritage Capital B.V.",
      "Canal View Holdings B.V.",
      "Gallery Nine B.V.",
      "WestEnd Workspace B.V.",
      "Canal Retail Partners B.V.",
    ],
  },
  {
    portfolio: "Portfolio B",
    entity: "Entity Y",
    property: "Haarlemmerweg Complex",
    tenants: [
      "WestEnd Workspace B.V.",
      "Haarlemmer Offices B.V.",
      "Creative District B.V.",
      "WestPort Studios B.V.",
      "Canal Works B.V.",
    ],
  },
  {
    portfolio: "Portfolio B",
    entity: "Entity B1",
    property: "Utrecht Central Plaza",
    tenants: [
      "Utrecht Finance Hub B.V.",
      "Policy Advisory Group B.V.",
      "Central Plaza Retail B.V.",
      "Utrecht Leasehold B.V.",
      "Finance Row B.V.",
    ],
  },
  {
    portfolio: "Portfolio B",
    entity: "Entity B1",
    property: "Den Haag Government Center",
    tenants: [
      "Policy Advisory Group B.V.",
      "Public Sector Alliance B.V.",
      "Government Lease NL B.V.",
      "Civic Center Tenants B.V.",
      "The Hague Offices B.V.",
    ],
  },
  {
    portfolio: "Portfolio C",
    entity: "Entity Z",
    property: "Logistics Hub West",
    tenants: [
      "Dockline Logistics B.V.",
      "Logistics Plus GmbH",
      "WestPort Distribution B.V.",
      "FreightLine B.V.",
      "Hub West Tenants B.V.",
    ],
  },
  {
    portfolio: "Portfolio C",
    entity: "Entity Z",
    property: "Zuidas Tower",
    tenants: [
      "Summit Advisory B.V.",
      "BlueNova Analytics B.V.",
      "LegalWorks International B.V.",
      "Metro Insurance Group B.V.",
      "Zuidas Finance B.V.",
    ],
  },
  {
    portfolio: "Portfolio C",
    entity: "Entity Z",
    property: "Eindhoven Tech Campus",
    tenants: [
      "ChipWorks Netherlands B.V.",
      "LabCore Research B.V.",
      "Eindhoven Labs B.V.",
      "Semiconductor Lease B.V.",
      "Tech Campus South B.V.",
    ],
  },
  {
    portfolio: "Portfolio C",
    entity: "Entity C1",
    property: "Tilburg Distribution Center",
    tenants: [
      "Brabant Logistics B.V.",
      "SouthNet Warehousing B.V.",
      "Tilburg Freight B.V.",
      "Distribution South B.V.",
      "Brabant Storage B.V.",
    ],
  },
  {
    portfolio: "Portfolio C",
    entity: "Entity C1",
    property: "Breda Industrial Park",
    tenants: [
      "SouthNet Warehousing B.V.",
      "Breda Industrial Tenants B.V.",
      "SouthWest Logistics B.V.",
      "Park Breda Lease B.V.",
      "Industrial South B.V.",
    ],
  },
];

const LEASE_EXPIRY_DATES = [
  "2026-06-12",
  "2026-07-18",
  "2026-08-22",
  "2026-09-30",
  "2026-11-05",
] as const;

function rowsFromScopes(scopes: LeaseScopeDef[]): LeaseBackendRow[] {
  scopes.forEach((scope) => {
    if (scope.tenants.length !== 5) {
      throw new Error(
        `Lease scope ${scope.portfolio} / ${scope.entity} / ${scope.property} must have exactly 5 tenants.`,
      );
    }
  });
  return scopes.flatMap((scope) =>
    scope.tenants.map((tenant_name, index) => ({
      portfolio: scope.portfolio,
      entity: scope.entity,
      property: scope.property,
      tenant_name,
      lease_expiry_date: LEASE_EXPIRY_DATES[index],
    })),
  );
}

/**
 * Demo lease rows shaped like backend payload.
 * Keep `lease_expiry_date` in ISO format for stable sorting.
 */
const LEASE_BACKEND_ROWS: LeaseBackendRow[] = rowsFromScopes(LEASE_SCOPE_DEFINITIONS);

function getScopedLeaseRows(
  portfolio: string,
  entity: string,
  property: string,
): LeaseBackendRow[] {
  const exact = LEASE_BACKEND_ROWS.filter(
    (r) => r.portfolio === portfolio && r.entity === entity && r.property === property,
  );
  if (exact.length > 0) return exact;
  if (portfolio === "All portfolio") return [];
  return LEASE_BACKEND_ROWS.filter(
    (r) =>
      r.portfolio === "All portfolio" &&
      r.entity === entity &&
      r.property === property,
  );
}

function daysUntil(dateIso: string) {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const target = new Date(dateIso).getTime();
  return Math.round((target - start) / (1000 * 60 * 60 * 24));
}

function expiryLabel(dateIso: string) {
  const d = new Date(dateIso);
  const formatted = d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const days = daysUntil(dateIso);
  if (days < 0) return `Expired ${formatted} · ${Math.abs(days)} days ago`;
  return `Expires ${formatted} · ${days} days`;
}

function sortByClosestUpcomingExpiry(a: LeaseBackendRow, b: LeaseBackendRow) {
  const aDays = daysUntil(a.lease_expiry_date);
  const bDays = daysUntil(b.lease_expiry_date);
  const aUpcoming = aDays >= 0;
  const bUpcoming = bDays >= 0;

  if (aUpcoming !== bUpcoming) return aUpcoming ? -1 : 1;
  if (aUpcoming && bUpcoming) return aDays - bDays;

  return Math.abs(aDays) - Math.abs(bDays);
}

export function getTopLeaseExpiryTenantsForScope({
  portfolio,
  entity,
  property,
  limit = 5,
}: {
  portfolio: string;
  entity: string;
  property: string;
  limit?: number;
}): WorkflowTenantOption[] {
  const scoped = getScopedLeaseRows(portfolio, entity, property).sort(
    sortByClosestUpcomingExpiry,
  );

  const uniqueByTenant = new Map<string, LeaseBackendRow>();
  scoped.forEach((row) => {
    const key = row.tenant_name.toLowerCase();
    if (!uniqueByTenant.has(key)) uniqueByTenant.set(key, row);
  });

  const rows = Array.from(uniqueByTenant.values()).slice(0, limit);

  return rows.map((row, i) => ({
    id: `tenant-${i}-${row.tenant_name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    name: row.tenant_name,
    expiryLabel: expiryLabel(row.lease_expiry_date),
    daysToExpiry: daysUntil(row.lease_expiry_date),
  }));
}

export function getLeasePortfolioOptions() {
  const values = new Set(LEASE_BACKEND_ROWS.map((r) => r.portfolio));
  const ordered = ["All portfolio", "Portfolio A", "Portfolio B", "Portfolio C"];
  return ordered.filter((p) => values.has(p) || p === "All portfolio");
}

/** Dashboard filter bar — excludes “All portfolio”. */
export function getFilterPortfolioOptions() {
  return getLeasePortfolioOptions().filter((portfolio) => portfolio !== "All portfolio");
}

function scopeRowsForPortfolio(portfolio: string) {
  if (portfolio === "All portfolio") {
    return LEASE_BACKEND_ROWS.filter((row) => row.portfolio === "All portfolio");
  }
  return LEASE_BACKEND_ROWS.filter(
    (row) => row.portfolio === portfolio || row.portfolio === "All portfolio",
  );
}

export function getLeaseEntityOptions(portfolio: string) {
  return Array.from(new Set(scopeRowsForPortfolio(portfolio).map((r) => r.entity))).sort();
}

/** Dashboard filter bar entity list for the selected portfolio. */
export function getFilterEntityOptions(portfolio: string) {
  return getLeaseEntityOptions(portfolio);
}

export function getLeasePropertyOptions(portfolio: string, entity: string) {
  if (!entity) return [];
  const scoped = scopeRowsForPortfolio(portfolio).filter((r) => r.entity === entity);
  return Array.from(new Set(scoped.map((r) => r.property))).sort();
}

/** Dashboard filter bar property list for the selected portfolio + entity. */
export function getFilterPropertyOptions(portfolio: string, entity: string) {
  return getLeasePropertyOptions(portfolio, entity);
}

export function getAllLeaseTenantsForScope({
  portfolio,
  entity,
  property,
}: {
  portfolio: string;
  entity: string;
  property: string;
}): WorkflowTenantOption[] {
  const rows = getScopedLeaseRows(portfolio, entity, property).sort(
    sortByClosestUpcomingExpiry,
  );

  const uniqueByTenant = new Map<string, LeaseBackendRow>();
  rows.forEach((row) => {
    const key = row.tenant_name.toLowerCase();
    if (!uniqueByTenant.has(key)) uniqueByTenant.set(key, row);
  });

  return Array.from(uniqueByTenant.values()).map((row, i) => ({
    id: `all-tenant-${i}-${row.tenant_name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    name: row.tenant_name,
    expiryLabel: expiryLabel(row.lease_expiry_date),
    daysToExpiry: daysUntil(row.lease_expiry_date),
  }));
}
