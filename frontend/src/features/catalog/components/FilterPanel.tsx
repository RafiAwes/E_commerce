"use client";

import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { Checkbox } from "@/components/ui/Checkbox";
import { cn } from "@/lib/utils";
import { useCatalogFilters } from "../hooks/useCatalogFilters";
import { PRICE_BANDS } from "../lib/search-params";
import type { CatalogFacets } from "../lib/facets";
import type { CatalogFilterKey, CatalogSearchState, FacetOption } from "../types";

export interface FilterPanelProps {
  state: CatalogSearchState;
  facets: CatalogFacets;
  basePath: string;
  /** Facets that are implied by the page itself (e.g. an occasion page). */
  hiddenFacets?: readonly CatalogFilterKey[];
  idPrefix?: string;
  className?: string;
}

function FilterGroup({ title, children, defaultOpen = true }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  return (
    <details open={defaultOpen} className="group border-b border-border py-5 first:pt-0 last:border-b-0">
      <summary className="flex cursor-pointer list-none items-center justify-between text-[0.8125rem] font-medium tracking-wide">
        {title}
        <ChevronDown aria-hidden className="size-4 text-muted transition-transform duration-200 group-open:rotate-180" />
      </summary>
      <div className="mt-4 flex flex-col gap-3">{children}</div>
    </details>
  );
}

/**
 * The filter form, shared by the desktop sidebar and the mobile drawer.
 *
 * Every change writes to the URL — there is no local filter state to fall out
 * of sync, and the resulting page is fully server-rendered.
 */
export function FilterPanel({ state, facets, basePath, hiddenFacets = [], idPrefix = "filter", className }: FilterPanelProps) {
  const { toggle, choosePriceBand, setFlag, isPending } = useCatalogFilters(state, basePath);

  function renderFacet(key: CatalogFilterKey, options: readonly FacetOption[], withSwatch = false) {
    if (hiddenFacets.includes(key)) return null;
    const selected = state[key] as readonly string[];

    return options
      .filter((option) => option.count > 0 || selected.includes(option.value))
      .map((option) => (
        <Checkbox
          key={option.value}
          id={`${idPrefix}-${key}-${option.value}`}
          name={key}
          value={option.value}
          checked={selected.includes(option.value)}
          onChange={() => toggle(key, option.value)}
          count={option.count}
          label={
            withSwatch && option.hex ? (
              <span className="inline-flex items-center gap-2">
                <span
                  aria-hidden
                  className="inline-block size-3.5 rounded-full border border-border"
                  style={{ backgroundColor: option.hex }}
                />
                {option.label}
              </span>
            ) : (
              option.label
            )
          }
        />
      ));
  }

  return (
    <div className={cn("text-sm", isPending && "opacity-70 transition-opacity", className)}>
      {!hiddenFacets.includes("categories") ? (
        <FilterGroup title="Category">{renderFacet("categories", facets.categories)}</FilterGroup>
      ) : null}

      {!hiddenFacets.includes("occasions") ? (
        <FilterGroup title="Occasion">{renderFacet("occasions", facets.occasions)}</FilterGroup>
      ) : null}

      {!hiddenFacets.includes("recipients") ? (
        <FilterGroup title="Recipient">{renderFacet("recipients", facets.recipients)}</FilterGroup>
      ) : null}

      <FilterGroup title="Price">
        <div className="flex flex-col gap-3" role="radiogroup" aria-label="Price">
          {PRICE_BANDS.map((band) => {
            const checked = state.priceBandId === band.id;
            return (
              <label key={band.id} className="flex cursor-pointer items-center gap-3 text-sm">
                <input
                  type="radio"
                  name={`${idPrefix}-price`}
                  value={band.id}
                  checked={checked}
                  onChange={() => choosePriceBand(band.id)}
                  className="size-[1.05rem] cursor-pointer appearance-none rounded-full border border-border bg-surface transition-shadow checked:border-[5px] checked:border-foreground focus-visible:ring-2 focus-visible:ring-burgundy/30"
                />
                {band.label}
              </label>
            );
          })}
          {state.priceBandId ? (
            <button
              type="button"
              onClick={() => choosePriceBand(null)}
              className="self-start text-xs text-muted underline underline-offset-4 transition-colors hover:text-foreground"
            >
              Clear price
            </button>
          ) : null}
        </div>
      </FilterGroup>

      {!hiddenFacets.includes("colors") ? (
        <FilterGroup title="Colour" defaultOpen={false}>
          {renderFacet("colors", facets.colors, true)}
        </FilterGroup>
      ) : null}

      <FilterGroup title="Availability" defaultOpen={false}>
        <Checkbox
          id={`${idPrefix}-instock`}
          checked={state.inStockOnly}
          onChange={(event) => setFlag("inStockOnly", event.target.checked)}
          label="In stock only"
        />
        <Checkbox
          id={`${idPrefix}-personalized`}
          checked={state.personalizedOnly}
          onChange={(event) => setFlag("personalizedOnly", event.target.checked)}
          label="Personalized only"
        />
      </FilterGroup>
    </div>
  );
}
