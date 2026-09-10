import { COMMERCE } from "@/lib/constants";
import type { Product, ProductVariant } from "@/types/common";

/**
 * Pure product-page rules. Keeping them out of the components means the price
 * shown on the page and the price written to the cart can never diverge.
 */

export function resolveUnitPrice(product: Product, variant: ProductVariant | null): number {
  return product.price + (variant?.priceDelta ?? 0);
}

export function resolveCompareAtPrice(product: Product, variant: ProductVariant | null): number | null {
  if (!product.compareAtPrice) return null;
  return product.compareAtPrice + (variant?.priceDelta ?? 0);
}

export type StockState = "in-stock" | "low-stock" | "sold-out";

export function getStockState(product: Product): StockState {
  if (product.stock <= 0) return "sold-out";
  if (product.stock <= COMMERCE.lowStockThreshold) return "low-stock";
  return "in-stock";
}

export function describeStock(product: Product): string {
  switch (getStockState(product)) {
    case "sold-out":
      return "Sold out";
    case "low-stock":
      return `Only ${product.stock} left`;
    default:
      return "In stock, ready to wrap";
  }
}

/** Personalized pieces are engraved to order, so they take longer to leave. */
export function getDispatchEstimate(product: Product): string {
  return product.isPersonalized ? "Engraved and dispatched within 48 hours" : "Dispatched within 24 hours";
}
