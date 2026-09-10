"use client";

import Link from "next/link";
import { buttonStyles } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { useCart } from "@/providers/CartProvider";
import { pluralize } from "@/lib/formatters";
import { CartEmptyState } from "./CartEmptyState";
import { CartLine } from "./CartLine";
import { CartSummary } from "./CartSummary";
import { FreeShippingMeter } from "./FreeShippingMeter";

/**
 * Mounted once at the root. Opening it is a call to `useCart().openDrawer()`
 * from anywhere — no prop drilling, no duplicated drawers.
 */
export function CartDrawer() {
  const { items, summary, isDrawerOpen, closeDrawer, updateQuantity, removeItem, promo } = useCart();

  return (
    <Drawer
      open={isDrawerOpen}
      onClose={closeDrawer}
      title="Your bag"
      description={items.length > 0 ? `${summary.itemCount} ${pluralize(summary.itemCount, "item")}` : undefined}
      footer={
        items.length > 0 ? (
          <div className="flex flex-col gap-3">
            <CartSummary summary={summary} promo={promo} showGiftWrap={false} />
            <Link href="/checkout" onClick={closeDrawer} className={buttonStyles({ variant: "primary", size: "lg", fullWidth: true })}>
              Checkout
            </Link>
            <Link
              href="/cart"
              onClick={closeDrawer}
              className="text-center text-xs text-muted underline underline-offset-4 transition-colors hover:text-foreground"
            >
              View full bag
            </Link>
          </div>
        ) : null
      }
    >
      {items.length === 0 ? (
        <CartEmptyState onNavigate={closeDrawer} />
      ) : (
        <div className="px-5 pt-4 pb-6 sm:px-6">
          <FreeShippingMeter summary={summary} />
          <ul className="divide-y divide-border">
            {items.map((item) => (
              <CartLine
                key={item.lineId}
                item={item}
                compact
                onQuantityChange={updateQuantity}
                onRemove={removeItem}
                onNavigate={closeDrawer}
              />
            ))}
          </ul>
        </div>
      )}
    </Drawer>
  );
}
