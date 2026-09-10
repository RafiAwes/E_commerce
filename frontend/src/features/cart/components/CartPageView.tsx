"use client";

import Link from "next/link";
import { Gift, ShieldCheck } from "lucide-react";
import { buttonStyles } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Skeleton } from "@/components/ui/Skeleton";
import { COMMERCE } from "@/lib/constants";
import { formatPrice, pluralize } from "@/lib/formatters";
import { useCart } from "@/providers/CartProvider";
import { CartEmptyState } from "./CartEmptyState";
import { CartLine } from "./CartLine";
import { CartSummary } from "./CartSummary";
import { FreeShippingMeter } from "./FreeShippingMeter";
import { GiftWrapDialog } from "./GiftWrapDialog";
import { PromoCodeForm } from "./PromoCodeForm";

function CartSkeleton() {
  return (
    <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="flex flex-col gap-5">
        {Array.from({ length: 2 }, (_, index) => (
          <div key={index} className="flex gap-4">
            <Skeleton className="size-28 shrink-0" rounded="md" />
            <div className="flex-1 space-y-3 py-1">
              <Skeleton className="h-3.5 w-2/3" />
              <Skeleton className="h-3 w-1/4" />
              <Skeleton className="h-9 w-28" rounded="md" />
            </div>
          </div>
        ))}
      </div>
      <Skeleton className="h-72 w-full" rounded="card" />
    </div>
  );
}

/**
 * The full bag. Shares its line rendering and totals with the drawer, so the
 * two can never disagree about a price.
 */
export function CartPageView() {
  const { items, summary, isHydrated, updateQuantity, removeItem, giftWrap, setGiftWrap, promo } = useCart();

  if (!isHydrated) return <CartSkeleton />;
  if (items.length === 0) return <CartEmptyState />;

  return (
    <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_22rem] xl:gap-14">
      <section aria-label="Bag contents">
        <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
          <p className="text-sm text-muted tabular">
            {summary.itemCount} {pluralize(summary.itemCount, "item")}
          </p>
          <Link href="/shop" className="text-xs underline underline-offset-4 transition-colors hover:text-burgundy">
            Continue shopping
          </Link>
        </div>

        <ul className="divide-y divide-border">
          {items.map((item) => (
            <CartLine key={item.lineId} item={item} onQuantityChange={updateQuantity} onRemove={removeItem} />
          ))}
        </ul>
      </section>

      <aside className="xl:sticky xl:top-28 xl:self-start">
        <div className="surface-card flex flex-col gap-5 p-6">
          <h2 className="font-sans text-base font-medium">Order summary</h2>

          <FreeShippingMeter summary={summary} />

          <div className="rounded-button border border-border p-3.5">
            <Checkbox
              id="cart-gift-wrap"
              checked={giftWrap}
              onChange={(event) => setGiftWrap(event.target.checked)}
              label={
                <span className="inline-flex items-center gap-2">
                  <Gift aria-hidden className="size-3.5 text-gold" />
                  Add premium gift wrapping
                </span>
              }
              description={`Letterpress card and ribboned box — ${formatPrice(COMMERCE.giftWrapPrice)}`}
            />
            <div className="mt-2 pl-[1.875rem]">
              <GiftWrapDialog />
            </div>
          </div>

          <PromoCodeForm />

          <CartSummary summary={summary} promo={promo} className="border-t border-border pt-5" />

          <Link href="/checkout" className={buttonStyles({ variant: "primary", size: "lg", fullWidth: true })}>
            Proceed to checkout
          </Link>

          <p className="flex items-start gap-2 text-xs text-muted">
            <ShieldCheck aria-hidden className="mt-0.5 size-3.5 shrink-0 text-gold" />
            Prototype checkout — no payment is taken and no order is dispatched.
          </p>
        </div>
      </aside>
    </div>
  );
}
