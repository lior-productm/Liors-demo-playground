import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Default elevation + hover lift (Insights overview — Significant insights). */
export const amiioCardHoverSurface =
  'shadow-[0px_2px_8px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-md' as const
