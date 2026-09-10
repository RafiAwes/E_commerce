import { formatCount, pluralize } from "@/lib/formatters";
import type { Product } from "@/types/common";
import { AppliedFilters } from "./AppliedFilters";
import { CatalogEmptyState } from "./CatalogEmptyState";
import { FilterPanel } from "./FilterPanel";
import { MobileFilterDrawer } from "./MobileFilterDrawer";
import { ProductGrid } from "./ProductGrid";
import { SortDropdown } from "./SortDropdown";
import { buildAppliedFilters, type CatalogFacets } from "../lib/facets";
import type { CatalogFilterKey, CatalogSearchState } from "../types";

export interface CatalogViewProps {
  products: readonly Product[];
  total: number;
  state: CatalogSearchState;
  facets: CatalogFacets;
  basePath: string;
  /** Facets the page already implies, e.g. occasion on an occasion page. */
  hiddenFacets?: readonly CatalogFilterKey[];
}

/**
 * Server-rendered catalogue layout: sidebar, toolbar and grid.
 *
 * Only the four controls inside are client islands — the products themselves
 * never leave the server.
 */
export function CatalogView({ products, total, state, facets, basePath, hiddenFacets = [] }: CatalogViewProps) {
  const chips = buildAppliedFilters(state, facets);

  return (
    <div className="flex flex-col gap-8 xl:flex-row xl:gap-12">
      <aside className="hidden w-64 shrink-0 xl:block" aria-label="Product filters">
        <div className="sticky top-28">
          <h2 className="eyebrow mb-4 text-muted">Filter</h2>
          <FilterPanel state={state} facets={facets} basePath={basePath} hiddenFacets={hiddenFacets} />
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <p className="text-sm text-muted tabular" aria-live="polite">
            {formatCount(total)} {pluralize(total, "product")}
          </p>
          <div className="flex items-center gap-2.5">
            <MobileFilterDrawer
              state={state}
              facets={facets}
              basePath={basePath}
              resultCount={total}
              hiddenFacets={hiddenFacets}
            />
            <SortDropdown state={state} basePath={basePath} />
          </div>
        </div>

        <AppliedFilters state={state} chips={chips} basePath={basePath} className="mt-5" />

        {products.length > 0 ? (
          <ProductGrid products={products} columns={4} priorityCount={4} className="mt-8" />
        ) : (
          <CatalogEmptyState searchTerm={state.search || undefined} onClearHref={basePath} />
        )}
      </div>
    </div>
  );
}
