"use client";

import dynamic from "next/dynamic";
import { useCart } from "@/providers/CartProvider";

/**
 * Defers the cart drawer's code until the shopper actually opens the bag.
 *
 * The drawer holds no state of its own — everything lives in `CartProvider` —
 * so unmounting it on close is free, and it keeps the drawer out of the
 * JavaScript every visitor downloads on first paint.
 */
const CartDrawer = dynamic(() => import("./CartDrawer").then((m) => m.CartDrawer), { ssr: false });

export function CartDrawerMount() {
  const { isDrawerOpen } = useCart();
  return isDrawerOpen ? <CartDrawer /> : null;
}
