"use client";

import { cn } from "@/lib/utils";
import { COMMERCIAL_BUILDING_IMAGE } from "@/src/constants/commercialDemoMedia";

export function BuildingThumb({
  className,
  alt = "Property",
  src,
  fit = "cover",
}: {
  className?: string;
  alt?: string;
  /** Override image (e.g. tenant logo SVG). */
  src?: string;
  fit?: "cover" | "contain";
}) {
  return (
    <img
      src={src ?? COMMERCIAL_BUILDING_IMAGE}
      alt={alt}
      className={cn(fit === "contain" ? "object-contain" : "object-cover", className)}
    />
  );
}
