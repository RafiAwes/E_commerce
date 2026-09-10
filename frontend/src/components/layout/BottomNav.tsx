"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home, Search, ShoppingBag, Store } from "lucide-react";
import { useCart } from "@/providers/CartProvider";
import { useSearch } from "@/providers/SearchProvider";
import { useWishlist } from "@/providers/WishlistProvider";
import { cn } from "@/lib/utils";

const items = [
  { key: "home", label: "Home", href: "/", icon: Home },
  { key: "shop", label: "Shop", href: "/shop", icon: Store },
  { key: "search", label: "Search", icon: Search },
  { key: "wishlist", label: "Saved", href: "/wishlist", icon: Heart },
  { key: "cart", label: "Bag", icon: ShoppingBag },
] as const;

/**
 * Thumb-reachable navigation on phones only. Hidden from tablet upwards,
 * where the header already carries the same actions.
 */
export function BottomNav() {
  const pathname = usePathname();
  const { itemCount, openDrawer, isHydrated: cartReady } = useCart();
  const { count: wishlistCount, isHydrated: wishlistReady } = useWishlist();
  const { open: openSearch } = useSearch();

  function badgeFor(key: string): number {
    if (key === "cart") return cartReady ? itemCount : 0;
    if (key === "wishlist") return wishlistReady ? wishlistCount : 0;
    return 0;
  }

  return (
    <nav
      aria-label="Quick navigation"
      className="fixed inset-x-0 bottom-0 z-90 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      <ul className="grid grid-cols-5">
        {items.map((item) => {
          const active = "href" in item && (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href));
          const badge = badgeFor(item.key);

          const content = (
            <>
              <span className="relative">
                <item.icon aria-hidden className={cn("size-[1.15rem]", active && "text-burgundy")} />
                {badge > 0 ? (
                  <span className="absolute -top-1 -right-2 inline-flex min-w-3.5 items-center justify-center rounded-full bg-burgundy px-1 text-[0.5625rem] leading-[0.875rem] font-medium text-white tabular">
                    {badge > 9 ? "9+" : badge}
                  </span>
                ) : null}
              </span>
              <span className={cn("text-[0.625rem]", active && "text-burgundy")}>{item.label}</span>
            </>
          );

          return (
            <li key={item.key}>
              {"href" in item ? (
                <Link href={item.href} className="flex h-14 flex-col items-center justify-center gap-1 text-muted">
                  {content}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={item.key === "search" ? openSearch : openDrawer}
                  aria-label={item.key === "search" ? "Search" : "Open bag"}
                  className="flex h-14 w-full flex-col items-center justify-center gap-1 text-muted"
                >
                  {content}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
