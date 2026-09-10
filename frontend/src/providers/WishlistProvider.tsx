"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import * as wishlist from "@/features/wishlist/lib/wishlist";
import type { WishlistProductRef } from "@/features/wishlist/types";
import { STORAGE_KEYS } from "@/lib/constants";
import { createPersistentStore } from "@/lib/persistent-store";
import type { WishlistItem } from "@/types/common";

interface WishlistContextValue {
  items: readonly WishlistItem[];
  isHydrated: boolean;
  count: number;
  addItem: (product: WishlistProductRef) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: WishlistProductRef) => boolean;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

const EMPTY_WISHLIST: readonly WishlistItem[] = [];

function isWishlistItems(value: unknown): value is readonly WishlistItem[] {
  return Array.isArray(value) && value.every((item) => typeof item?.productId === "string" && typeof item?.slug === "string");
}

const wishlistStore = createPersistentStore<readonly WishlistItem[]>(
  STORAGE_KEYS.wishlist,
  EMPTY_WISHLIST,
  isWishlistItems,
);

/**
 * Deliberately separate from the cart: the two have different lifetimes and
 * different persistence stories, and merging them would force every cart
 * change to re-render wishlist consumers.
 */
export function WishlistProvider({ children }: { children: ReactNode }) {
  const { value: items, isHydrated } = useSyncExternalStore(
    wishlistStore.subscribe,
    wishlistStore.getSnapshot,
    wishlistStore.getServerSnapshot,
  );

  const addItem = useCallback((product: WishlistProductRef) => {
    wishlistStore.set((current) => wishlist.addItem(current, product));
  }, []);

  const removeItem = useCallback((productId: string) => {
    wishlistStore.set((current) => wishlist.removeItem(current, productId));
  }, []);

  /** Returns the resulting state so callers can phrase their own feedback. */
  const toggleItem = useCallback((product: WishlistProductRef) => {
    let nowSaved = false;
    wishlistStore.set((current) => {
      nowSaved = !wishlist.isInWishlist(current, product.id);
      return nowSaved ? wishlist.addItem(current, product) : wishlist.removeItem(current, product.id);
    });
    return nowSaved;
  }, []);

  const isInWishlist = useCallback((productId: string) => wishlist.isInWishlist(items, productId), [items]);

  const clearWishlist = useCallback(() => wishlistStore.set(EMPTY_WISHLIST), []);

  const value = useMemo<WishlistContextValue>(
    () => ({
      items,
      isHydrated,
      count: items.length,
      addItem,
      removeItem,
      toggleItem,
      isInWishlist,
      clearWishlist,
    }),
    [items, isHydrated, addItem, removeItem, toggleItem, isInWishlist, clearWishlist],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistContextValue {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used inside <WishlistProvider>.");
  return context;
}
