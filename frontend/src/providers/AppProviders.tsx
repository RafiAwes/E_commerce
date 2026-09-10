"use client";

import type { ReactNode } from "react";
import { CartDrawer } from "@/features/cart/components/CartDrawer";
import { ToastProvider } from "@/components/ui/Toast";
import type { SearchIndexItem } from "@/lib/catalog/search-index";
import { CartProvider } from "./CartProvider";
import { SearchProvider } from "./SearchProvider";
import { WishlistProvider } from "./WishlistProvider";

/**
 * One client boundary at the root of the app.
 *
 * Everything below it can still be a Server Component — providers wrap the
 * tree as `children`, so pages are not pulled into the client bundle.
 */
export function AppProviders({ searchIndex, children }: { searchIndex: readonly SearchIndexItem[]; children: ReactNode }) {
  return (
    <ToastProvider>
      <WishlistProvider>
        <CartProvider>
          <SearchProvider index={searchIndex}>
            {children}
            <CartDrawer />
          </SearchProvider>
        </CartProvider>
      </WishlistProvider>
    </ToastProvider>
  );
}
