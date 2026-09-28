import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeUrl(url?: string): string {
  if (!url) return '#';
  const trimmed = url.trim();
  if (!trimmed || trimmed === '#' || trimmed === 'javascript:void(0)') return '#';
  if (/^(https?:\/\/|mailto:|tel:|\/|#)/i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}
