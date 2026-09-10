import type { CategoryId, ColorId, OccasionId, Product, RecipientId } from "@/types/common";
import { normalizeText } from "@/lib/utils";

/**
 * Pure catalogue algorithms.
 *
 * These sit *below* both the repository layer and the catalog feature so the
 * same rules apply whether products come from the local mock source or a
 * future `GET /products` endpoint that only supports partial filtering.
 * Nothing here touches React, the DOM or the network — every function is a
 * deterministic transform over `Product[]` and is independently testable.
 */

export const SORT_OPTIONS = [
  { id: "recommended", label: "Recommended" },
  { id: "newest", label: "Newest" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "rating", label: "Highest Rated" },
] as const;

export type ProductSort = (typeof SORT_OPTIONS)[number]["id"];

export const DEFAULT_SORT: ProductSort = "recommended";

export function isProductSort(value: string): value is ProductSort {
  return SORT_OPTIONS.some((option) => option.id === value);
}

export interface ProductQuery {
  readonly search?: string;
  readonly categories?: readonly CategoryId[];
  readonly occasions?: readonly OccasionId[];
  readonly recipients?: readonly RecipientId[];
  readonly colors?: readonly ColorId[];
  readonly minPrice?: number | null;
  readonly maxPrice?: number | null;
  readonly inStockOnly?: boolean;
  readonly personalizedOnly?: boolean;
  readonly isFeatured?: boolean;
  readonly isBestSeller?: boolean;
  readonly isNew?: boolean;
  readonly sort?: ProductSort;
  readonly limit?: number;
  readonly excludeSlugs?: readonly string[];
}

export const EMPTY_QUERY: ProductQuery = {};

/* ------------------------------------------------------------------ */
/* Search                                                              */
/* ------------------------------------------------------------------ */

/**
 * Weighted relevance so an exact name match always beats a tag brush.
 * Every term must match somewhere, which keeps two-word searches useful.
 */
function scoreProduct(product: Product, terms: readonly string[]): number {
  const name = normalizeText(product.name);
  const tags = product.tags.map(normalizeText).join(" ");
  const summary = normalizeText(`${product.shortDescription} ${product.description}`);
  const facets = normalizeText(
    [product.category, ...product.occasions, ...product.recipients, ...product.colors].join(" "),
  );

  let total = 0;
  for (const term of terms) {
    let termScore = 0;
    if (name === term) termScore += 100;
    else if (name.startsWith(term)) termScore += 60;
    else if (name.includes(term)) termScore += 40;
    if (tags.includes(term)) termScore += 18;
    if (facets.includes(term)) termScore += 12;
    if (summary.includes(term)) termScore += 6;
    if (termScore === 0) return 0;
    total += termScore;
  }
  return total;
}

export function searchProducts(products: readonly Product[], rawTerm: string): Product[] {
  const normalized = normalizeText(rawTerm);
  if (!normalized) return [...products];

  const terms = normalized.split(" ").filter(Boolean);
  return products
    .map((product) => ({ product, score: scoreProduct(product, terms) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || b.product.rating - a.product.rating)
    .map((entry) => entry.product);
}

/* ------------------------------------------------------------------ */
/* Filtering                                                           */
/* ------------------------------------------------------------------ */

function matchesAny<T>(selected: readonly T[] | undefined, values: readonly T[]): boolean {
  if (!selected || selected.length === 0) return true;
  return selected.some((value) => values.includes(value));
}

export function filterProducts(products: readonly Product[], query: ProductQuery): Product[] {
  const { minPrice, maxPrice, excludeSlugs } = query;

  return products.filter((product) => {
    if (excludeSlugs?.includes(product.slug)) return false;
    if (!matchesAny(query.categories, [product.category])) return false;
    if (!matchesAny(query.occasions, product.occasions)) return false;
    if (!matchesAny(query.recipients, product.recipients)) return false;
    if (!matchesAny(query.colors, product.colors)) return false;
    if (typeof minPrice === "number" && product.price < minPrice) return false;
    if (typeof maxPrice === "number" && product.price > maxPrice) return false;
    if (query.inStockOnly && product.stock <= 0) return false;
    if (query.personalizedOnly && !product.isPersonalized) return false;
    if (query.isFeatured && !product.isFeatured) return false;
    if (query.isBestSeller && !product.isBestSeller) return false;
    if (query.isNew && !product.isNew) return false;
    return true;
  });
}

/* ------------------------------------------------------------------ */
/* Sorting                                                             */
/* ------------------------------------------------------------------ */

/**
 * "Recommended" is a merchandising blend rather than a single field:
 * featured pieces first, then best sellers, then rating and review volume.
 */
function recommendedScore(product: Product): number {
  return (
    (product.isFeatured ? 40 : 0) +
    (product.isBestSeller ? 26 : 0) +
    (product.isNew ? 12 : 0) +
    product.rating * 6 +
    Math.min(product.reviewCount, 300) / 30
  );
}

export function sortProducts(products: readonly Product[], sort: ProductSort = DEFAULT_SORT): Product[] {
  const sorted = [...products];

  switch (sort) {
    case "newest":
      return sorted.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price || a.name.localeCompare(b.name));
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price || a.name.localeCompare(b.name));
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    case "recommended":
    default:
      return sorted.sort((a, b) => recommendedScore(b) - recommendedScore(a));
  }
}

/* ------------------------------------------------------------------ */
/* Composition                                                         */
/* ------------------------------------------------------------------ */

/**
 * The one entry point that applies a whole query. Search relevance wins over
 * the sort control unless the shopper has explicitly chosen a sort.
 */
export function applyProductQuery(products: readonly Product[], query: ProductQuery): Product[] {
  const searched = query.search ? searchProducts(products, query.search) : [...products];
  const filtered = filterProducts(searched, query);
  const hasExplicitSort = Boolean(query.sort && query.sort !== DEFAULT_SORT);
  const ordered = query.search && !hasExplicitSort ? filtered : sortProducts(filtered, query.sort);
  return typeof query.limit === "number" ? ordered.slice(0, query.limit) : ordered;
}

export function getPriceBounds(products: readonly Product[]): { min: number; max: number } {
  if (products.length === 0) return { min: 0, max: 0 };
  let min = Number.POSITIVE_INFINITY;
  let max = 0;
  for (const product of products) {
    if (product.price < min) min = product.price;
    if (product.price > max) max = product.price;
  }
  return { min: Math.floor(min), max: Math.ceil(max) };
}

/** Facet counts, computed against the products that survive every *other* filter. */
export function countBy<T extends string>(products: readonly Product[], pick: (product: Product) => readonly T[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const product of products) {
    for (const key of pick(product)) {
      counts[key] = (counts[key] ?? 0) + 1;
    }
  }
  return counts;
}
