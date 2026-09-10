"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import * as cart from "@/features/cart/lib/cart";
import type { AddToCartInput } from "@/features/cart/types";
import { PROMO_CODES, STORAGE_KEYS } from "@/lib/constants";
import { createPersistentStore } from "@/lib/persistent-store";
import type { AppliedPromo, CartItem, OrderSummary } from "@/types/common";

interface PersistedCart {
  items: readonly CartItem[];
  giftWrap: boolean;
  promoCode: string | null;
}

interface CartContextValue {
  items: readonly CartItem[];
  /** False during the first client render, before storage has been read. */
  isHydrated: boolean;
  itemCount: number;
  summary: OrderSummary;
  giftWrap: boolean;
  promo: AppliedPromo | null;
  isDrawerOpen: boolean;
  addItem: (input: AddToCartInput) => void;
  removeItem: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
  setGiftWrap: (value: boolean) => void;
  applyPromo: (code: string) => { ok: boolean; message: string };
  removePromo: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const EMPTY_CART: PersistedCart = { items: [], giftWrap: false, promoCode: null };

function isPersistedCart(value: unknown): value is PersistedCart {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<PersistedCart>;
  return Array.isArray(candidate.items) && candidate.items.every((item) => typeof item?.lineId === "string");
}

function resolvePromo(code: string | null): AppliedPromo | null {
  if (!code) return null;
  const match = PROMO_CODES[code.toUpperCase()];
  return match ? { code: code.toUpperCase(), label: match.label, percentOff: match.percentOff } : null;
}

/** Module-level so every consumer shares one persisted cart. */
const cartStore = createPersistentStore<PersistedCart>(STORAGE_KEYS.cart, EMPTY_CART, isPersistedCart);

/**
 * Client-side cart state.
 *
 * The provider owns *state and persistence only* — every calculation lives in
 * `features/cart/lib/cart.ts`. Replacing localStorage with a server cart means
 * swapping the store below; nothing else changes.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const { value, isHydrated } = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    cartStore.getServerSnapshot,
  );

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { items, giftWrap } = value;
  const promo = useMemo(() => resolvePromo(value.promoCode), [value.promoCode]);

  const addItem = useCallback((input: AddToCartInput) => {
    cartStore.set((current) => ({ ...current, items: cart.addItem(current.items, input) }));
  }, []);

  const removeItem = useCallback((lineId: string) => {
    cartStore.set((current) => ({ ...current, items: cart.removeItem(current.items, lineId) }));
  }, []);

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    cartStore.set((current) => ({ ...current, items: cart.updateQuantity(current.items, lineId, quantity) }));
  }, []);

  const clearCart = useCallback(() => cartStore.set(EMPTY_CART), []);

  const setGiftWrap = useCallback((next: boolean) => {
    cartStore.set((current) => ({ ...current, giftWrap: next }));
  }, []);

  const applyPromo = useCallback((code: string) => {
    const resolved = resolvePromo(code.trim());
    if (!resolved) return { ok: false, message: "That code is not recognised." };
    cartStore.set((current) => ({ ...current, promoCode: resolved.code }));
    return { ok: true, message: resolved.label };
  }, []);

  const removePromo = useCallback(() => {
    cartStore.set((current) => ({ ...current, promoCode: null }));
  }, []);

  const summary = useMemo(
    () => cart.calculateCartTotals(items, { giftWrap, promoPercentOff: promo?.percentOff ?? 0 }),
    [items, giftWrap, promo],
  );

  const getItemQuantity = useCallback((productId: string) => cart.getItemQuantity(items, productId), [items]);

  const contextValue = useMemo<CartContextValue>(
    () => ({
      items,
      isHydrated,
      itemCount: summary.itemCount,
      summary,
      giftWrap,
      promo,
      isDrawerOpen,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getItemQuantity,
      setGiftWrap,
      applyPromo,
      removePromo,
      openDrawer: () => setIsDrawerOpen(true),
      closeDrawer: () => setIsDrawerOpen(false),
    }),
    [
      items,
      isHydrated,
      summary,
      giftWrap,
      promo,
      isDrawerOpen,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getItemQuantity,
      setGiftWrap,
      applyPromo,
      removePromo,
    ],
  );

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside <CartProvider>.");
  return context;
}
