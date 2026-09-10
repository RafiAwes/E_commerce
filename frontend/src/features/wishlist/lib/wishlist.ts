import type { Product, WishlistItem } from "@/types/common";
import type { WishlistProductRef } from "../types";

/**
 * Pure wishlist rules. Wishlists store references rather than snapshots, so a
 * saved item always reflects the current price and availability.
 */

export function addItem(items: readonly WishlistItem[], product: WishlistProductRef): WishlistItem[] {
  if (items.some((item) => item.productId === product.id)) return [...items];
  return [{ productId: product.id, slug: product.slug, addedAt: new Date().toISOString() }, ...items];
}

export function removeItem(items: readonly WishlistItem[], productId: string): WishlistItem[] {
  return items.filter((item) => item.productId !== productId);
}

export function isInWishlist(items: readonly WishlistItem[], productId: string): boolean {
  return items.some((item) => item.productId === productId);
}

/** Resolves saved references against the catalogue, newest first. */
export function resolveWishlistProducts(
  items: readonly WishlistItem[],
  catalogue: readonly Product[],
): readonly Product[] {
  const byId = new Map(catalogue.map((product) => [product.id, product]));
  return items.flatMap((item) => {
    const product = byId.get(item.productId);
    return product ? [product] : [];
  });
}
