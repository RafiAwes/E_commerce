"use client";

import { Heart } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { useWishlist } from "@/providers/WishlistProvider";
import { cn } from "@/lib/utils";
import type { WishlistProductRef } from "../types";

export interface WishlistButtonProps {
  product: WishlistProductRef;
  variant?: "surface" | "plain" | "outline";
  size?: "sm" | "md";
  showLabel?: boolean;
  className?: string;
}

const variants = {
  surface: "bg-surface/90 shadow-subtle backdrop-blur-sm hover:bg-surface",
  plain: "hover:bg-secondary",
  outline: "border border-border bg-surface hover:border-foreground/40",
} as const;

const sizes = { sm: "size-9", md: "size-11" } as const;

/**
 * Small client island. Before hydration it renders the unsaved state, which
 * is exactly what the server rendered — no mismatch, no flash of wrong icon.
 */
export function WishlistButton({ product, variant = "surface", size = "sm", showLabel = false, className }: WishlistButtonProps) {
  const { isInWishlist, toggleItem, isHydrated } = useWishlist();
  const { show } = useToast();

  const saved = isHydrated && isInWishlist(product.id);

  function handleClick() {
    const nowSaved = toggleItem(product);
    show({
      tone: nowSaved ? "wishlist" : "info",
      title: nowSaved ? "Saved to wishlist" : "Removed from wishlist",
      description: product.name,
      ...(nowSaved ? { action: { label: "View wishlist", href: "/wishlist" } } : {}),
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-full transition-colors duration-200",
        showLabel ? "h-11 rounded-button px-4 text-sm font-medium" : sizes[size],
        variants[variant],
        className,
      )}
    >
      <Heart
        aria-hidden
        className={cn(
          "size-[1.05rem] transition-[transform,color,fill] duration-300",
          saved ? "animate-pop fill-burgundy text-burgundy" : "text-foreground",
        )}
      />
      {showLabel ? <span>{saved ? "Saved" : "Save"}</span> : null}
    </button>
  );
}
