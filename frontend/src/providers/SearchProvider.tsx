"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import type { SearchIndexItem } from "@/lib/catalog/search-index";

interface SearchContextValue {
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

const SearchContext = createContext<SearchContextValue | null>(null);

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
      <SearchOverlay open={isOpen} onClose={close} index={index} />
    </SearchContext.Provider>
  );
}

export function useSearch(): SearchContextValue {
  const context = useContext(SearchContext);
  if (!context) throw new Error("useSearch must be used inside <SearchProvider>.");
  return context;
}
