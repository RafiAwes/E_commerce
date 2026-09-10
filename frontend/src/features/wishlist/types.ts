import type { Product, WishlistItem } from "@/types/common";

export type { WishlistItem };

/** The minimum a client island needs to save something to the wishlist. */
export type WishlistProductRef = Pick<Product, "id" | "slug" | "name">;
