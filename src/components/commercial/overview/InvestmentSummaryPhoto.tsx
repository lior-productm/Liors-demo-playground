"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { BuildingThumb } from "@/src/components/commercial/BuildingThumb";
import { readLocalJson, writeLocalJson } from "@/src/lib/browserStorage";

const STORAGE_KEY = "amiio:investment-summary-photo";
const MAX_BYTES = 5 * 1024 * 1024;

const ACCEPTED_MIME = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/svg+xml",
]);

const ACCEPT_ATTR = ".png,.jpeg,.jpg,.svg,image/png,image/jpeg,image/svg+xml";

type StoredPhoto = {
  dataUrl: string;
  isSvg: boolean;
};

function isAcceptedFile(file: File) {
  const byMime = ACCEPTED_MIME.has(file.type);
  const byExt = /\.(png|jpe?g|svg)$/i.test(file.name);
  return byMime || byExt;
}

function toast(message: string) {
  window.dispatchEvent(new CustomEvent("amiio:toast", { detail: { message } }));
}

export function InvestmentSummaryPhoto({
  alt = "Property",
  className,
  containerClassName,
}: {
  alt?: string;
  className?: string;
  containerClassName?: string;
}) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<StoredPhoto | null>(null);

  useEffect(() => {
    const saved = readLocalJson<StoredPhoto | null>(STORAGE_KEY, null);
    if (saved?.dataUrl) setPhoto(saved);
  }, []);

  const applyFile = useCallback((file: File | undefined) => {
    if (!file) return;

    if (!isAcceptedFile(file)) {
      toast("Use a PNG, JPEG, JPG, or SVG image.");
      return;
    }

    if (file.size > MAX_BYTES) {
      toast("Image must be 5 MB or smaller.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : "";
      if (!dataUrl) {
        toast("Could not read that image. Try another file.");
        return;
      }
      const isSvg =
        file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg");
      const next: StoredPhoto = { dataUrl, isSvg };
      setPhoto(next);
      writeLocalJson(STORAGE_KEY, next);
      toast("Investment summary photo updated.");
    };
    reader.onerror = () => toast("Could not read that image. Try another file.");
    reader.readAsDataURL(file);
  }, []);

  const clearPhoto = useCallback(() => {
    setPhoto(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
    if (inputRef.current) inputRef.current.value = "";
    toast("Photo reset to default.");
  }, []);

  const openPicker = () => inputRef.current?.click();

  return (
    <div className={cn("group relative", containerClassName)}>
      {photo ? (
        <img
          src={photo.dataUrl}
          alt={alt}
          className={cn(
            "h-full w-full rounded-[8px]",
            photo.isSvg ? "object-contain bg-[#F0F2F5] p-2" : "object-cover",
            className,
          )}
        />
      ) : (
        <BuildingThumb className={className} alt={alt} />
      )}

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={ACCEPT_ATTR}
        className="sr-only"
        onChange={(e) => {
          applyFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      <div
        className={cn(
          "pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-[8px] bg-[#010309]/45 opacity-0 transition-opacity",
          "group-hover:opacity-100 group-focus-within:opacity-100",
        )}
        aria-hidden
      >
        <ImagePlus className="size-6 text-white" strokeWidth={1.75} />
        <span className="text-[12px] font-medium text-white">Update photo</span>
        <span className="text-[10px] text-white/80">PNG, JPEG, JPG, SVG</span>
      </div>

      <button
        type="button"
        onClick={openPicker}
        className="absolute inset-0 z-[1] cursor-pointer rounded-[8px] opacity-0 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#233FDE]"
        aria-label="Update investment summary photo"
      />

      {photo ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            clearPhoto();
          }}
          className="absolute right-1.5 top-1.5 z-[2] flex size-7 items-center justify-center rounded-full bg-[#010309]/70 text-white opacity-0 transition-opacity hover:bg-[#010309] group-hover:opacity-100 focus-visible:opacity-100"
          aria-label="Remove custom photo"
        >
          <X className="size-4" strokeWidth={1.75} />
        </button>
      ) : null}
    </div>
  );
}
