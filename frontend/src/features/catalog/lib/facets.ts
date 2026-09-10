import { countBy, filterProducts, searchProducts } from "@/lib/catalog/query";
import type { ColorOption, Occasion, Product, ProductCategory, Recipient } from "@/types/common";
import type { AppliedFilterChip, CatalogSearchState, FacetOption } from "../types";
import { findPriceBand, toProductQuery } from "./search-params";

/** Taxonomy is passed in from the server so this module never touches data. */
export interface CatalogTaxonomy {
  readonly categories: readonly ProductCategory[];
  readonly occasions: readonly Occasion[];
  readonly recipients: readonly Recipient[];
  readonly colors: readonly ColorOption[];
}

export interface CatalogFacets {
  readonly categories: readonly FacetOption[];
  readonly occasions: readonly FacetOption[];
  readonly recipients: readonly FacetOption[];
  readonly colors: readonly FacetOption[];
}

type FacetKey = "categories" | "occasions" | "recipients" | "colors";

/**
 * Counts are computed against everything *except* the facet being rendered.
 * That is what makes a multi-select filter feel right: ticking "Birthday"
 * must not zero out the other occasion counts.
 */
function scopeForFacet(products: readonly Product[], state: CatalogSearchState, key: FacetKey): readonly Product[] {
  const relaxed: CatalogSearchState = { ...state, [key]: [] };
  const searched = relaxed.search ? searchProducts(products, relaxed.search) : products;
  return filterProducts(searched, toProductQuery(relaxed));
}

export function buildCatalogFacets(
  products: readonly Product[],
  state: CatalogSearchState,
  taxonomy: CatalogTaxonomy,
): CatalogFacets {
  const categoryCounts = countBy(scopeForFacet(products, state, "categories"), (product) => [product.category]);
  const occasionCounts = countBy(scopeForFacet(products, state, "occasions"), (product) => product.occasions);
  const recipientCounts = countBy(scopeForFacet(products, state, "recipients"), (product) => product.recipients);
  const colorCounts = countBy(scopeForFacet(products, state, "colors"), (product) => product.colors);

  return {
    categories: taxonomy.categories.map((category) => ({
      value: category.id,
      label: category.name,
      count: categoryCounts[category.id] ?? 0,
    })),
    occasions: taxonomy.occasions.map((occasion) => ({
      value: occasion.id,
      label: occasion.name,
      count: occasionCounts[occasion.id] ?? 0,
    })),
    recipients: taxonomy.recipients.map((recipient) => ({
      value: recipient.id,
      label: recipient.name,
      count: recipientCounts[recipient.id] ?? 0,
    })),
    colors: taxonomy.colors.map((color) => ({
      value: color.id,
      label: color.name,
      count: colorCounts[color.id] ?? 0,
      hex: color.hex,
    })),
  };
}

function labelFor(options: readonly FacetOption[], value: string): string {
  return options.find((option) => option.value === value)?.label ?? value;
}

/** The removable chips shown above the grid. */
export function buildAppliedFilters(state: CatalogSearchState, facets: CatalogFacets): AppliedFilterChip[] {
  const chips: AppliedFilterChip[] = [];

  for (const value of state.categories) {
    chips.push({ id: `category-${value}`, label: labelFor(facets.categories, value), key: "categories", value });
  }
  for (const value of state.occasions) {
    chips.push({ id: `occasion-${value}`, label: labelFor(facets.occasions, value), key: "occasions", value });
  }
  for (const value of state.recipients) {
    chips.push({ id: `recipient-${value}`, label: labelFor(facets.recipients, value), key: "recipients", value });
  }
  for (const value of state.colors) {
    chips.push({ id: `color-${value}`, label: labelFor(facets.colors, value), key: "colors", value });
  }

  const band = findPriceBand(state.priceBandId);
  if (band) chips.push({ id: `price-${band.id}`, label: band.label, key: "priceBandId" });
  if (state.inStockOnly) chips.push({ id: "instock", label: "In stock only", key: "inStockOnly" });
  if (state.personalizedOnly) chips.push({ id: "personalized", label: "Personalized only", key: "personalizedOnly" });

  return chips;
}
