"use client";

import { useRouter } from "next/navigation";
import { useCallback, useTransition } from "react";
import {
  clearFilters,
  createCatalogHref,
  setPriceBand,
  setSort,
  toggleFilterValue,
} from "../lib/search-params";
import type { CatalogFilterKey, CatalogSearchState } from "../types";
import type { ProductSort } from "@/lib/catalog/query";

/**
 * Bridges the URL-driven catalogue to the interactive controls.
 *
 * The current state arrives as a prop from the Server Component that already
 * parsed the search params, so no client component has to read the URL — it
 * only writes to it.
 */
export function useCatalogFilters(state: CatalogSearchState, basePath: string) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const apply = useCallback(
    (next: CatalogSearchState) => {
      startTransition(() => {
        // `scroll: false` keeps the shopper's place in a long grid.
        router.push(createCatalogHref(basePath, next), { scroll: false });
      });
    },
    [router, basePath],
  );

  return {
    isPending,
    apply,
    hrefFor: (next: CatalogSearchState) => createCatalogHref(basePath, next),
    toggle: (key: CatalogFilterKey, value: string) => apply(toggleFilterValue(state, key, value)),
    choosePriceBand: (bandId: string | null) => apply(setPriceBand(state, bandId)),
    chooseSort: (sort: ProductSort) => apply(setSort(state, sort)),
    setFlag: (key: "inStockOnly" | "personalizedOnly", value: boolean) => apply({ ...state, [key]: value }),
    clearAll: () => apply(clearFilters(state)),
  };
}
