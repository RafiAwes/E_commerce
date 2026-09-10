"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCatalogFilters } from "../hooks/useCatalogFilters";
import type { AppliedFilterChip, CatalogFilterKey, CatalogSearchState } from "../types";

export interface AppliedFiltersProps {
  state: CatalogSearchState;
  chips: readonly AppliedFilterChip[];
  basePath: string;
  className?: string;
}

const MULTI_KEYS: readonly CatalogFilterKey[] = ["categories", "occasions", "recipients", "colors"];

function isMultiKey(key: AppliedFilterChip["key"]): key is CatalogFilterKey {
  return MULTI_KEYS.includes(key as CatalogFilterKey);
}

/** Removable chips so a shopper can undo one decision without starting over. */
export function AppliedFilters({ state, chips, basePath, className }: AppliedFiltersProps) {
  const { toggle, choosePriceBand, setFlag, clearAll } = useCatalogFilters(state, basePath);

  if (chips.length === 0) return null;

  function remove(chip: AppliedFilterChip) {
    if (isMultiKey(chip.key) && chip.value) {
      toggle(chip.key, chip.value);
      return;
    }
    if (chip.key === "priceBandId") choosePriceBand(null);
    if (chip.key === "inStockOnly") setFlag("inStockOnly", false);
    if (chip.key === "personalizedOnly") setFlag("personalizedOnly", false);
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="sr-only">Applied filters</span>
      {chips.map((chip) => (
        <button
          key={chip.id}
          type="button"
          onClick={() => remove(chip)}
          className="inline-flex items-center gap-1.5 rounded-pill border border-border bg-surface py-1.5 pr-2.5 pl-3 text-xs font-medium transition-colors hover:border-foreground/30 hover:bg-secondary"
        >
          {chip.label}
          <X aria-hidden className="size-3 text-muted" />
          <span className="sr-only">Remove filter</span>
        </button>
      ))}
      {chips.length > 1 ? (
        <button
          type="button"
          onClick={clearAll}
          className="ml-1 text-xs text-muted underline underline-offset-4 transition-colors hover:text-foreground"
        >
          Clear all
        </button>
      ) : null}
    </div>
  );
}
