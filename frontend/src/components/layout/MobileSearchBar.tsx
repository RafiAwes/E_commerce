"use client";

import { Search } from "lucide-react";
import { useSearch } from "@/providers/SearchProvider";

/** A search affordance under the mobile header, per the mobile nav pattern. */
export function MobileSearchBar() {
  const { open } = useSearch();

  return (
    <button
      type="button"
      onClick={open}
      className="flex h-10 w-full items-center gap-2.5 rounded-button border border-border bg-surface px-3.5 text-sm text-muted transition-colors hover:border-foreground/25"
    >
      <Search aria-hidden className="size-4" />
      Search gifts, ornaments, occasions
    </button>
  );
}
