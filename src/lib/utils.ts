import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function isLunch() {
  const now = new Date();
  const hour = now.getHours();
  return hour < 14;
}

export function isDinner() {
  const now = new Date();
  const hour = now.getHours();
  return hour >= 14 && hour < 21;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
