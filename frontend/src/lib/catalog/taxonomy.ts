import type { CategoryId, ColorId, OccasionId, RecipientId } from "@/types/common";

/**
 * The closed sets behind the catalogue unions.
 *
 * Having them as runtime values (not just types) lets URL parsing reject
 * unknown ids safely instead of casting untrusted strings into domain types.
 */

export const CATEGORY_IDS = [
  "gift-sets",
  "ornaments",
  "personalized",
  "home-decor",
  "candles",
  "keepsakes",
  "accessories",
  "hampers",
] as const satisfies readonly CategoryId[];

export const OCCASION_IDS = [
  "birthday",
  "anniversary",
  "wedding",
  "valentines",
  "eid",
  "christmas",
  "new-home",
  "thank-you",
  "just-because",
] as const satisfies readonly OccasionId[];

export const RECIPIENT_IDS = [
  "her",
  "him",
  "couples",
  "parents",
  "friends",
  "kids",
  "colleagues",
] as const satisfies readonly RecipientId[];

export const COLOR_IDS = [
  "ivory",
  "gold",
  "blush",
  "sage",
  "burgundy",
  "charcoal",
  "walnut",
  "silver",
] as const satisfies readonly ColorId[];

function makeGuard<T extends string>(values: readonly T[]) {
  const set = new Set<string>(values);
  return (value: string): value is T => set.has(value);
}

export const isCategoryId = makeGuard(CATEGORY_IDS);
export const isOccasionId = makeGuard(OCCASION_IDS);
export const isRecipientId = makeGuard(RECIPIENT_IDS);
export const isColorId = makeGuard(COLOR_IDS);

/** Keeps only the ids that exist, preserving order. */
export function filterValid<T extends string>(values: readonly string[], guard: (value: string) => value is T): T[] {
  return values.filter(guard);
}
