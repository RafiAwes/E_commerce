"use client";

import Link from "next/link";
import { ShoppingBag, SlidersHorizontal, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { Tooltip } from "@/components/ui/Tooltip";
import { useCart } from "@/providers/CartProvider";
import { useWishlist } from "@/providers/WishlistProvider";
import type { Product } from "@/types/common";

/**
 * "Move to bag" is a real move: the piece is added to the cart *and* removed
 * from the wishlist, which is what shoppers expect the wording to mean.
 */
export function WishlistActions({ product }: { product: Product }) {
  const { addItem, openDrawer } = useCart();
  const { removeItem } = useWishlist();
  const { show } = useToast();

  const needsOptions = product.isPersonalized || product.variants.length > 0;
  const soldOut = product.stock <= 0;

  function handleMove() {
    addItem({ product, quantity: 1 });
    removeItem(product.id);
    openDrawer();
    show({ title: "Moved to bag", description: product.name, action: { label: "View bag", href: "/cart" } });
  }

  return (
    <div className="mt-3 flex items-center gap-2">
      {needsOptions ? (
        <Link
          href={`/products/${product.slug}`}
          className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-button border border-border bg-surface text-[0.8125rem] font-medium transition-colors hover:border-foreground/35 hover:bg-secondary"
        >
          <SlidersHorizontal aria-hidden className="size-3.5" />
          Choose options
        </Link>
      ) : (
        <button
          type="button"
          onClick={handleMove}
          disabled={soldOut}
          className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-button border border-border bg-surface text-[0.8125rem] font-medium transition-colors hover:border-foreground/35 hover:bg-secondary disabled:pointer-events-none disabled:opacity-45"
        >
          <ShoppingBag aria-hidden className="size-3.5" />
          {soldOut ? "Sold out" : "Move to bag"}
        </button>
      )}

      {/* Icon-only control: the tooltip gives sighted users the same label
          that assistive technology already gets. */}
      <Tooltip label="Remove from wishlist">
        <button
          type="button"
          onClick={() => {
            removeItem(product.id);
            show({ tone: "info", title: "Removed from wishlist", description: product.name });
          }}
          aria-label={`Remove ${product.name} from wishlist`}
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-button border border-border bg-surface text-muted transition-colors hover:border-danger/40 hover:text-danger"
        >
          <Trash2 aria-hidden className="size-3.5" />
        </button>
      </Tooltip>
    </div>
  );
}
