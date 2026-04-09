"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Info, Search as SearchIcon } from "lucide-react";
import type { LeaseRow, LeaseStatus } from "@/src/types/commercial";
import { cn } from "@/lib/utils";
import { LeaseDetailsModal } from "./LeaseDetailsModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type SortKey = "leaseEnd" | "deltaPct" | "confidencePct" | "assetName";
type SortDir = "asc" | "desc";

const statusOptions: Array<{ id: "All" | LeaseStatus; label: string }> = [
  { id: "All", label: "All statuses" },
  { id: "Expiring", label: "Expiring" },
  { id: "Renewal", label: "Renewal" },
  { id: "Active", label: "Active" },
];

function sortValue(row: LeaseRow, key: SortKey) {
  switch (key) {
    case "leaseEnd":
      return new Date(row.leaseEnd + "T00:00:00").getTime();
    case "deltaPct":
      return row.deltaPct;
    case "confidencePct":
      return row.confidencePct;
    case "assetName":
      return row.assetName.toLowerCase();
    default:
      return row.leaseEnd;
  }
}

function formatPct(n: number) {
  const sign = n >= 0 ? "+" : "";
  return `${sign}${n.toFixed(1)}%`;
}

export function LeaseContractsTable({
  rows,
  query,
  onQueryChange,
}: {
  rows: LeaseRow[];
  query: string;
  onQueryChange: (v: string) => void;
}) {
  const [status, setStatus] = useState<"All" | LeaseStatus>("All");
  const [sortKey, setSortKey] = useState<SortKey>("leaseEnd");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<LeaseRow | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows
      .filter((r) => (status === "All" ? true : r.status === status))
      .filter((r) => {
        if (!q) return true;
        return (
          r.assetName.toLowerCase().includes(q) ||
          r.assetType.toLowerCase().includes(q) ||
          r.status.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        const av = sortValue(a, sortKey);
        const bv = sortValue(b, sortKey);
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
  }, [query, rows, sortDir, sortKey, status]);

  const countText = filtered.length === 1 ? "1 lease" : `${filtered.length} leases`;

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDir("asc");
  };

  const SortIcon = ({ keyFor }: { keyFor: SortKey }) => {
    if (sortKey !== keyFor) return null;
    return sortDir === "asc" ? (
      <ArrowUp className="h-3.5 w-3.5 text-muted-foreground" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 text-muted-foreground" />
    );
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-bold text-foreground">Lease information</div>
          <div className="text-[11px] font-semibold text-muted-foreground mt-0.5">
            Search and review negotiation-ready lease expirations
          </div>
        </div>
        <div className="rounded-full bg-primary/5 px-3 py-1 text-[11px] font-bold text-primary">
          {countText}
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-9 pl-9 text-sm font-semibold"
            placeholder="Search assets or status…"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Status
          </Label>
          <Select value={status} onValueChange={(v) => setStatus(v as any)}>
            <SelectTrigger className="h-9 w-[160px] text-sm font-semibold">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((o) => (
                <SelectItem key={o.id} value={o.id}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-3 overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader className="bg-background">
            <TableRow>
              <TableHead className="whitespace-nowrap">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 focus:outline-none"
                  onClick={() => toggleSort("assetName")}
                >
                  Property <SortIcon keyFor="assetName" />
                </button>
              </TableHead>
              <TableHead className="whitespace-nowrap">Asset type</TableHead>
              <TableHead className="whitespace-nowrap">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 focus:outline-none"
                  onClick={() => toggleSort("leaseEnd")}
                >
                  Lease end <SortIcon keyFor="leaseEnd" />
                </button>
              </TableHead>
              <TableHead className="whitespace-nowrap">Current rent</TableHead>
              <TableHead className="whitespace-nowrap">Market rent</TableHead>
              <TableHead className="whitespace-nowrap">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 focus:outline-none"
                  onClick={() => toggleSort("deltaPct")}
                >
                  Delta <SortIcon keyFor="deltaPct" />
                </button>
              </TableHead>
              <TableHead className="whitespace-nowrap">Status</TableHead>
              <TableHead className="whitespace-nowrap">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 focus:outline-none"
                  onClick={() => toggleSort("confidencePct")}
                >
                  Confidence <SortIcon keyFor="confidencePct" />
                </button>
              </TableHead>
              <TableHead className="whitespace-nowrap">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="py-10 text-center text-xs font-semibold text-muted-foreground">
                  No leases match your filters.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((r) => {
                const deltaIsPositive = r.deltaPct >= 0;
                return (
                  <TableRow key={r.id}>
                    <TableCell className="font-semibold text-foreground">
                      {r.assetName}
                    </TableCell>
                    <TableCell className="font-semibold text-muted-foreground">
                      {r.assetType}
                    </TableCell>
                    <TableCell className="font-semibold text-foreground whitespace-nowrap">
                      {r.leaseEnd}
                    </TableCell>
                    <TableCell className="font-semibold text-foreground whitespace-nowrap">
                      ${r.currentRentPerSqm.toLocaleString()}/sqm
                    </TableCell>
                    <TableCell className="font-semibold text-foreground whitespace-nowrap">
                      ${r.marketRentPerSqm.toLocaleString()}/sqm
                    </TableCell>
                    <TableCell className="font-semibold whitespace-nowrap">
                      <span className={deltaIsPositive ? "text-accent" : "text-destructive"}>
                        {formatPct(r.deltaPct)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={r.status === "Expiring" ? "destructive" : r.status === "Renewal" ? "default" : "secondary"}
                        className={cn(
                          "text-[11px]",
                          r.status === "Active" && "bg-accent text-accent-foreground hover:bg-accent/90",
                        )}
                      >
                        {r.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-foreground whitespace-nowrap">
                      {r.confidencePct}%
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1.5 text-[11px] font-bold"
                        onClick={() => {
                          setSelected(r);
                          setOpen(true);
                        }}
                      >
                        <Info className="h-3.5 w-3.5" />
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <LeaseDetailsModal
        open={open}
        row={selected}
        onClose={() => {
          setOpen(false);
          setSelected(null);
        }}
      />
    </div>
  );
}

