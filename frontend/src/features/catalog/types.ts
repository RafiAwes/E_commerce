import type { ProductSort } from "@/lib/catalog/query";
import type { CategoryId, ColorId, OccasionId, RecipientId } from "@/types/common";

/** The catalogue state that lives entirely in the URL. */
export interface CatalogSearchState {
  readonly search: string;
  readonly categories: readonly CategoryId[];
  readonly occasions: readonly OccasionId[];
  readonly recipients: readonly RecipientId[];
  readonly colors: readonly ColorId[];
  readonly priceBandId: string | null;
  readonly minPrice: number | null;
  readonly maxPrice: number | null;
  readonly inStockOnly: boolean;
  readonly personalizedOnly: boolean;
  readonly sort: ProductSort;
}

export type CatalogFilterKey = "categories" | "occasions" | "recipients" | "colors";

/** One removable chip in the applied-filters row. */
export interface AppliedFilterChip {
  readonly id: string;
  readonly label: string;
  readonly key: CatalogFilterKey | "priceBandId" | "inStockOnly" | "personalizedOnly" | "search";
  readonly value?: string;
}

export interface FacetOption {
  readonly value: string;
  readonly label: string;
  readonly count: number;
  readonly hex?: string;
}
