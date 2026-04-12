"use client";

import { Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemo, useState } from "react";

export type EntityPropertyFilterBarProps = {
  className?: string;
  /** Shown on the entity (first) control — e.g. selected entity name */
  entityLabel?: string;
  /** Shown on the property (second) control */
  propertyLabel?: string;
  /** Optional entity options for dropdown */
  entityOptions?: string[];
  /** Optional property options for dropdown */
  propertyOptions?: string[];
  /** Toast message when Clear is pressed */
  clearToastMessage?: string;
  /** Optional extra handler when Clear is pressed */
  onClear?: () => void;
};

/**
 * Shared main filter bar: Entity + Property (same pattern as Commercial).
 * Dropdowns are demo UI; wire to real data sources when APIs exist.
 */
export function EntityPropertyFilterBar({
  className,
  entityLabel = "Z holdings",
  propertyLabel = "Select property",
  entityOptions,
  propertyOptions,
  clearToastMessage = "Cleared filters",
  onClear,
}: EntityPropertyFilterBarProps) {
  const resolvedEntityOptions = useMemo(
    () =>
      entityOptions ?? ["Z holdings", "A holdings", "Northstar REIT", "Urban Core Group"],
    [entityOptions],
  );
  const resolvedPropertyOptions = useMemo(
    () =>
      propertyOptions ?? [
        "Select property",
        "Wenckebachweg 90-98",
        "Zuidas Tower",
        "Herengracht Offices",
        "Logistics Hub West",
      ],
    [propertyOptions],
  );
  const [selectedEntity, setSelectedEntity] = useState(entityLabel);
  const [selectedProperty, setSelectedProperty] = useState(propertyLabel);

  const handleClear = () => {
    setSelectedEntity(entityLabel);
    setSelectedProperty(propertyLabel);
    onClear?.();
    window.dispatchEvent(
      new CustomEvent("amiio:toast", { detail: { message: clearToastMessage } }),
    );
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <div className="flex min-h-[52px] items-center gap-2 rounded-full border border-[#E6E8EB] bg-white py-1 pl-2 pr-2 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
        <Select
          value={selectedEntity}
          onValueChange={(value) => {
            setSelectedEntity(value);
            window.dispatchEvent(
              new CustomEvent("amiio:toast", { detail: { message: `Entity: ${value}` } }),
            );
          }}
        >
          <SelectTrigger
            aria-label="Select entity"
            className="h-8 w-auto min-w-[132px] rounded-full border-[#E6E8EB] bg-white px-3 typo-l3-b text-[#353638]"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {resolvedEntityOptions.map((entity) => (
              <SelectItem
                key={entity}
                value={entity}
                className="data-[highlighted]:bg-[#F7F8FA] data-[highlighted]:text-[#353638]"
              >
                {entity}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={selectedProperty}
          onValueChange={(value) => {
            setSelectedProperty(value);
            window.dispatchEvent(
              new CustomEvent("amiio:toast", { detail: { message: `Property: ${value}` } }),
            );
          }}
        >
          <SelectTrigger
            aria-label="Select property"
            className="h-8 w-auto min-w-[170px] rounded-full border-[#E6E8EB] bg-white px-3 typo-l3-b text-[#969A9E]"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {resolvedPropertyOptions.map((property) => (
              <SelectItem
                key={property}
                value={property}
                className="data-[highlighted]:bg-[#F7F8FA] data-[highlighted]:text-[#353638]"
              >
                {property}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <button
          type="button"
          className="rounded-full px-2 py-1 typo-l3-b text-[#969A9E] transition-colors hover:bg-[#010309] hover:text-[#F0F2F5]"
          onClick={handleClear}
        >
          Clear
        </button>
        <button
          type="button"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#969A9E] transition-colors hover:bg-[#010309] hover:text-[#F0F2F5]"
          aria-label="Filter settings"
          onClick={() =>
            window.dispatchEvent(
              new CustomEvent("amiio:toast", { detail: { message: "Filter settings (placeholder)" } }),
            )
          }
        >
          <Settings2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
