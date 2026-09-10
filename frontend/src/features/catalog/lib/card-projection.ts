import type { Product } from "@/types/common";

/**
 * Trims the narrative fields a product *card* never renders.
 *
 * Pages that must hand the whole catalogue to a Client Component (the
 * wishlist, for example, cannot know which items are saved until the browser
 * hydrates) use this to keep the RSC payload small. Everything a card reads
 * is preserved exactly.
 */
export function toCardProduct(product: Product): Product {
  return { ...product, description: "", details: [], materials: "", dimensions: "" };
}

export function toCardProducts(products: readonly Product[]): Product[] {
  return products.map(toCardProduct);
}
