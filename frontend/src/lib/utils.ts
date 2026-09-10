import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names with Tailwind conflict resolution. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Deterministic id for prototype entities (cart lines, orders, toasts). */
export function createId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Stable, order-preserving unique list. */
export function unique<T>(items: readonly T[]): T[] {
  return Array.from(new Set(items));
}

/** Normalises text for accent-insensitive, case-insensitive matching. */
export function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function slugify(value: string): string {
  return normalizeText(value).replace(/\s+/g, "-");
}

/** Splits an array into fixed-size chunks (used by editorial grids). */
export function chunk<T>(items: readonly T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size));
  }
  return result;
}

/**
 * Deterministic pseudo-random pick — keeps server and client renders
 * identical, unlike Math.random().
 */
export function pickDeterministic<T>(items: readonly T[], seed: string): T | undefined {
  if (items.length === 0) return undefined;
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 100000;
  }
  return items[hash % items.length];
}
