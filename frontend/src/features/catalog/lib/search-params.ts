import { DEFAULT_SORT, isProductSort, type ProductQuery, type ProductSort } from "@/lib/catalog/query";
import { filterValid, isCategoryId, isColorId, isOccasionId, isRecipientId } from "@/lib/catalog/taxonomy";
import { buildSearchParams, readBoolean, readList, readNumber, readString, withQuery, type RawSearchParams } from "@/lib/search-params";
import type { CatalogFilterKey, CatalogSearchState } from "../types";

/**
 * The catalogue is URL-driven end to end: filters, sort and search all live in
 * search params. That gives shareable links, working back/forward navigation,
 * refresh-safe state and server rendering for free — and it is why no filter
 * state is held in a global store.
 */

export interface PriceBand {
  readonly id: string;
  readonly label: string;
  readonly min: number | null;
  readonly max: number | null;
}

export const PRICE_BANDS: readonly PriceBand[] = [
  { id: "under-1000", label: "Under ৳1,000", min: null, max: 999 },
  { id: "1000-2000", label: "৳1,000 – ৳2,000", min: 1000, max: 2000 },
  { id: "2000-3500", label: "৳2,000 – ৳3,500", min: 2000, max: 3500 },
  { id: "over-3500", label: "৳3,500 and above", min: 3500, max: null },
];

export const EMPTY_CATALOG_STATE: CatalogSearchState = {
  search: "",
  categories: [],
  occasions: [],
  recipients: [],
  colors: [],
  priceBandId: null,
  minPrice: null,
  maxPrice: null,
  inStockOnly: false,
  personalizedOnly: false,
  sort: DEFAULT_SORT,
};

export function findPriceBand(id: string | null): PriceBand | null {
  if (!id) return null;
  return PRICE_BANDS.find((band) => band.id === id) ?? null;
}

/** URL → validated catalogue state. Unknown ids are dropped, never trusted. */
export function parseCatalogSearchParams(params: RawSearchParams): CatalogSearchState {
  const priceBandId = readString(params, "price") ?? null;
  const band = findPriceBand(priceBandId);
  const sortParam = readString(params, "sort");

  return {
    search: (readString(params, "q") ?? "").trim(),
    categories: filterValid(readList(params, "category"), isCategoryId),
    occasions: filterValid(readList(params, "occasion"), isOccasionId),
    recipients: filterValid(readList(params, "recipient"), isRecipientId),
    colors: filterValid(readList(params, "color"), isColorId),
    priceBandId: band ? band.id : null,
    minPrice: band ? band.min : (readNumber(params, "min") ?? null),
    maxPrice: band ? band.max : (readNumber(params, "max") ?? null),
    inStockOnly: readBoolean(params, "instock"),
    personalizedOnly: readBoolean(params, "personalized"),
    sort: sortParam && isProductSort(sortParam) ? sortParam : DEFAULT_SORT,
  };
}

/** Catalogue state → the shortest URL that reproduces it. */
export function createCatalogSearchParams(state: CatalogSearchState): URLSearchParams {
  return buildSearchParams({
    q: state.search,
    category: [...state.categories],
    occasion: [...state.occasions],
    recipient: [...state.recipients],
    color: [...state.colors],
    price: state.priceBandId,
    min: state.priceBandId ? null : state.minPrice,
    max: state.priceBandId ? null : state.maxPrice,
    instock: state.inStockOnly,
    personalized: state.personalizedOnly,
    sort: state.sort === DEFAULT_SORT ? null : state.sort,
  });
}

export function createCatalogHref(pathname: string, state: CatalogSearchState): string {
  return withQuery(pathname, createCatalogSearchParams(state));
}

/** Adds or removes one value from a multi-select facet. */
export function toggleFilterValue(state: CatalogSearchState, key: CatalogFilterKey, value: string): CatalogSearchState {
  const current = state[key] as readonly string[];
  const next = current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
  return { ...state, [key]: next } as CatalogSearchState;
}

export function setSort(state: CatalogSearchState, sort: ProductSort): CatalogSearchState {
  return { ...state, sort };
}

export function setPriceBand(state: CatalogSearchState, bandId: string | null): CatalogSearchState {
  const band = findPriceBand(bandId);
  return { ...state, priceBandId: band?.id ?? null, minPrice: band?.min ?? null, maxPrice: band?.max ?? null };
}

export function clearFilters(state: CatalogSearchState): CatalogSearchState {
  // Search and sort are not filters — clearing chips should not discard them.
  return { ...EMPTY_CATALOG_STATE, search: state.search, sort: state.sort };
}

export function countActiveFilters(state: CatalogSearchState): number {
  return (
    state.categories.length +
    state.occasions.length +
    state.recipients.length +
    state.colors.length +
    (state.priceBandId ? 1 : 0) +
    (state.inStockOnly ? 1 : 0) +
    (state.personalizedOnly ? 1 : 0)
  );
}

/** Catalogue state → the query the service layer understands. */
export function toProductQuery(state: CatalogSearchState, overrides: ProductQuery = {}): ProductQuery {
  return {
    search: state.search || undefined,
    categories: state.categories.length ? state.categories : undefined,
    occasions: state.occasions.length ? state.occasions : undefined,
    recipients: state.recipients.length ? state.recipients : undefined,
    colors: state.colors.length ? state.colors : undefined,
    minPrice: state.minPrice,
    maxPrice: state.maxPrice,
    inStockOnly: state.inStockOnly || undefined,
    personalizedOnly: state.personalizedOnly || undefined,
    sort: state.sort,
    ...overrides,
  };
}
