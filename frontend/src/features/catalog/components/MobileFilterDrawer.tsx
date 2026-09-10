"use client";

import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { formatCount } from "@/lib/formatters";
import { useCatalogFilters } from "../hooks/useCatalogFilters";
import { countActiveFilters } from "../lib/search-params";
import { FilterPanel } from "./FilterPanel";
import type { CatalogFacets } from "../lib/facets";
import type { CatalogFilterKey, CatalogSearchState } from "../types";

export interface MobileFilterDrawerProps {
  state: CatalogSearchState;
  facets: CatalogFacets;
  basePath: string;
  resultCount: number;
  hiddenFacets?: readonly CatalogFilterKey[];
}

/** The filter sidebar, re-housed in a sheet for narrow screens. */
export function MobileFilterDrawer({ state, facets, basePath, resultCount, hiddenFacets }: MobileFilterDrawerProps) {
  const [open, setOpen] = useState(false);
  const { clearAll } = useCatalogFilters(state, basePath);
  const activeCount = countActiveFilters(state);

  return (
    <>
      <Button variant="outline" size="md" onClick={() => setOpen(true)} className="xl:hidden">
        <SlidersHorizontal aria-hidden className="size-4" />
        Filters
        {activeCount > 0 ? (
          <span className="ml-0.5 inline-flex size-5 items-center justify-center rounded-full bg-foreground text-[0.6875rem] text-background tabular">
            {activeCount}
          </span>
        ) : null}
      </Button>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        side="left"
        title="Filters"
        description={`${formatCount(resultCount)} products match`}
        footer={
          <div className="flex gap-3">
            <Button
              variant="outline"
              fullWidth
              className="whitespace-nowrap"
              onClick={() => {
                clearAll();
                setOpen(false);
              }}
            >
              Clear all
            </Button>
            <Button fullWidth className="whitespace-nowrap" onClick={() => setOpen(false)}>
              Show {formatCount(resultCount)} results
            </Button>
          </div>
        }
      >
        <div className="px-5 py-4">
          <FilterPanel state={state} facets={facets} basePath={basePath} hiddenFacets={hiddenFacets} idPrefix="mobile-filter" />
        </div>
      </Drawer>
    </>
  );
}
