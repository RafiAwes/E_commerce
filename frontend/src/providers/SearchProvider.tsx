"use client";

import dynamic from "next/dynamic";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { SearchIndexItem } from "@/lib/catalog/search-index";

interface SearchContextValue {
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

const SearchContext = createContext<SearchContextValue | null>(null);

/**
 * The overlay is only ever seen after a deliberate click, so its code should
 * not be part of the bundle every visitor downloads. Rendering it lazily and
 * conditionally means the chunk is fetched the first time search is opened.
 */
const SearchOverlay = dynamic(() => import("@/components/layout/SearchOverlay").then((m) => m.SearchOverlay), {
  ssr: false,
});

/**
 * Owns the search overlay so any trigger — desktop header, mobile bar, bottom
 * navigation — can open the same instance without duplicating it.
 */
export function SearchProvider({ index, children }: { index: readonly SearchIndexItem[]; children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const value = useMemo(() => ({ open, close, isOpen }), [open, close, isOpen]);

  return (
    <SearchContext.Provider value={value}>
      {children}
      {isOpen ? <SearchOverlay open onClose={close} index={index} /> : null}
    </SearchContext.Provider>
  );
}

export function useSearch(): SearchContextValue {
  const context = useContext(SearchContext);
  if (!context) throw new Error("useSearch must be used inside <SearchProvider>.");
  return context;
}
