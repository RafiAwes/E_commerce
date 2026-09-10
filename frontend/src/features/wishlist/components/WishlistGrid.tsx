"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useMemo } from "react";
import { buttonStyles } from "@/components/ui/Button";
import { EmptyState } from "@/components/shared/EmptyState";
import { ProductCard } from "@/features/catalog/components/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { useWishlist } from "@/providers/WishlistProvider";
import { formatCount, pluralize } from "@/lib/formatters";
import type { Product } from "@/types/common";
import { resolveWishlistProducts } from "../lib/wishlist";
import { WishlistActions } from "./WishlistActions";

/**
 * Saved items are stored as references, so this resolves them against the
 * live catalogue — a wishlist never shows a stale price.
 */
export function WishlistGrid({ catalogue }: { catalogue: readonly Product[] }) {
  const { items, isHydrated, clearWishlist } = useWishlist();

  const products = useMemo(() => resolveWishlistProducts(items, catalogue), [items, catalogue]);

  if (!isHydrated) {
    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        className="surface-card"
        icon={<Heart aria-hidden className="size-6" />}
        title="Nothing saved yet"
        description="Tap the heart on any piece to keep it here while you decide. Your list stays on this device."
        action={
          <Link href="/shop" className={buttonStyles({ variant: "primary" })}>
            Browse gifts
          </Link>
        }
        secondaryAction={
          <Link href="/#gift-finder" className={buttonStyles({ variant: "outline" })}>
            Find a gift
          </Link>
        }
      />
    );
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
        <p className="text-sm text-muted tabular">
          {formatCount(products.length)} saved {pluralize(products.length, "piece")}
        </p>
        <button
          type="button"
          onClick={clearWishlist}
          className="text-xs text-muted underline underline-offset-4 transition-colors hover:text-danger"
        >
          Clear wishlist
        </button>
      </div>
      {/* The wishlist adds its own move/remove row beneath each card, so it
          composes ProductCard directly rather than reusing ProductGrid. */}
      <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3 md:gap-x-6 md:gap-y-11 xl:grid-cols-4">
        {products.map((product) => (
          <li key={product.id} className="min-w-0">
            <ProductCard product={product} sizes="(min-width: 1200px) 22vw, (min-width: 768px) 30vw, 45vw" />
            <WishlistActions product={product} />
          </li>
        ))}
      </ul>
    </>
  );
}
