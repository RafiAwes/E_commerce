"use client";

import { ArrowUpDown } from "lucide-react";
import { useId } from "react";
import { SORT_OPTIONS, isProductSort } from "@/lib/catalog/query";
import { cn } from "@/lib/utils";
import { useCatalogFilters } from "../hooks/useCatalogFilters";
import type { CatalogSearchState } from "../types";

export interface SortDropdownProps {
  state: CatalogSearchState;
  basePath: string;
  className?: string;
}

/** Sort is URL state, so this control only writes — it never holds a value. */
export function SortDropdown({ state, basePath, className }: SortDropdownProps) {
  const id = useId();
  const { chooseSort } = useCatalogFilters(state, basePath);

  return (
    <div className={cn("relative inline-flex items-center", className)}>
      <label htmlFor={id} className="sr-only">
        Sort products
      </label>
      <ArrowUpDown aria-hidden className="pointer-events-none absolute left-3.5 size-3.5 text-muted" />
      <select
        id={id}
        value={state.sort}
        onChange={(event) => {
          if (isProductSort(event.target.value)) chooseSort(event.target.value);
        }}
        className="h-11 cursor-pointer appearance-none rounded-button border border-border bg-surface pr-9 pl-9 text-[0.8125rem] font-medium transition-colors hover:border-foreground/30 focus-visible:ring-2 focus-visible:ring-burgundy/25 focus-visible:outline-none"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
