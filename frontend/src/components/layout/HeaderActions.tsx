"use client";

import Link from "next/link";
import { Heart, Search, ShoppingBag } from "lucide-react";
import { useCart } from "@/providers/CartProvider";
import { useSearch } from "@/providers/SearchProvider";
import { useWishlist } from "@/providers/WishlistProvider";
import { cn } from "@/lib/utils";

function CountBubble({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="absolute -top-0.5 -right-0.5 inline-flex min-w-4 items-center justify-center rounded-full bg-burgundy px-1 text-[0.625rem] leading-4 font-medium text-white tabular">
      {count > 9 ? "9+" : count}
    </span>
  );
}

const actionClasses =
  "relative inline-flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary";

/**
 * The only always-interactive part of the header. Counts render as zero until
 * the providers hydrate, matching the server HTML exactly.
 */
export function HeaderActions({ className }: { className?: string }) {
  const { itemCount, openDrawer, isHydrated: cartReady } = useCart();
  const { count: wishlistCount, isHydrated: wishlistReady } = useWishlist();
  const { open: openSearch } = useSearch();

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      <button type="button" onClick={openSearch} aria-label="Search" className={cn(actionClasses, "hidden md:inline-flex")}>
        <Search aria-hidden className="size-[1.15rem]" />
      </button>

      <Link href="/wishlist" aria-label="Wishlist" className={actionClasses}>
        <Heart aria-hidden className="size-[1.15rem]" />
        <CountBubble count={wishlistReady ? wishlistCount : 0} />
      </Link>

      <button type="button" onClick={openDrawer} aria-label="Open bag" className={actionClasses}>
        <ShoppingBag aria-hidden className="size-[1.15rem]" />
        <CountBubble count={cartReady ? itemCount : 0} />
      </button>
    </div>
  );
}
