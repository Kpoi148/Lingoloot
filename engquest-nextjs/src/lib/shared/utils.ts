// Shared utility helpers used across multiple UI and server modules.
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isRecent = (date: Date, days = 3): boolean => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return false;
  }

  const diffMs = Date.now() - date.getTime();
  const windowMs = days * 24 * 60 * 60 * 1000;
  return diffMs >= 0 && diffMs < windowMs;
};
