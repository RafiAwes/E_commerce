import { CURRENCY } from "@/lib/constants";

const numberFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const decimalFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

/**
 * Prices are whole taka in this catalogue, so we format without decimals.
 * Kept in one place so a future multi-currency backend only changes here.
 */
export function formatPrice(amount: number): string {
  return `${CURRENCY.symbol}${numberFormatter.format(Math.round(amount))}`;
}

export function formatRating(rating: number): string {
  return decimalFormatter.format(rating);
}

export function formatCount(count: number): string {
  return numberFormatter.format(count);
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

/** Fixed locale and time zone so server and client always agree. */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatShortDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(date);
}

/** Percentage saved when a compare-at price is present. */
export function calculateDiscountPercent(price: number, compareAtPrice: number | null): number | null {
  if (!compareAtPrice || compareAtPrice <= price) return null;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural ?? `${singular}s`);
}
