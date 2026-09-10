export { CatalogView } from "./components/CatalogView";
export { CatalogEmptyState } from "./components/CatalogEmptyState";
export { ProductCard } from "./components/ProductCard";
export { ProductGrid } from "./components/ProductGrid";
export { buildCatalogFacets, buildAppliedFilters } from "./lib/facets";
export type { CatalogFacets, CatalogTaxonomy } from "./lib/facets";
export {
  EMPTY_CATALOG_STATE,
  PRICE_BANDS,
  createCatalogHref,
  createCatalogSearchParams,
  parseCatalogSearchParams,
  toProductQuery,
} from "./lib/search-params";
export type { CatalogSearchState, AppliedFilterChip, FacetOption } from "./types";
