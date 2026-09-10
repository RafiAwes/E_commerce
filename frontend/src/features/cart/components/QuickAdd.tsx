"use client";

import Link from "next/link";
import { Plus, SlidersHorizontal } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { useCart } from "@/providers/CartProvider";
import { cn } from "@/lib/utils";
import type { CartProductRef } from "../types";

export interface QuickAddProps {
  product: CartProductRef;
  /** Products with options can't be added blind — we send shoppers to the page. */
  needsOptions: boolean;
  soldOut?: boolean;
  className?: string;
}

/**
 * The card-level add control. Renders as a compact icon on touch layouts and
 * as a full-width bar that appears on hover from tablet upwards.
 */
export function QuickAdd({ product, needsOptions, soldOut = false, className }: QuickAddProps) {
  const { addItem, openDrawer } = useCart();
  const { show } = useToast();

  const barClasses =
    "hidden md:flex h-10 w-full items-center justify-center gap-2 rounded-button bg-surface/95 text-[0.8125rem] font-medium text-foreground shadow-subtle backdrop-blur-sm transition-[opacity,transform] duration-300 ease-[var(--ease-out-soft)] md:translate-y-2 md:opacity-0 group-hover:md:translate-y-0 group-hover:md:opacity-100 group-focus-within:md:translate-y-0 group-focus-within:md:opacity-100 hover:bg-foreground hover:text-background";
  const iconClasses =
    "flex md:hidden size-9 items-center justify-center rounded-full bg-surface/95 text-foreground shadow-subtle backdrop-blur-sm";

  if (soldOut) return null;

  if (needsOptions) {
    return (
      <div className={className}>
        <Link href={`/products/${product.slug}`} className={barClasses}>
          <SlidersHorizontal aria-hidden className="size-3.5" />
          Choose options
        </Link>
        <Link href={`/products/${product.slug}`} aria-label={`Choose options for ${product.name}`} className={iconClasses}>
          <SlidersHorizontal aria-hidden className="size-4" />
        </Link>
      </div>
    );
  }

  function handleAdd() {
    addItem({ product, quantity: 1 });
    openDrawer();
    show({ title: "Added to bag", description: product.name, action: { label: "View bag", href: "/cart" } });
  }

  return (
    <div className={className}>
      <button type="button" onClick={handleAdd} className={cn(barClasses)}>
        <Plus aria-hidden className="size-3.5" />
        Quick add
      </button>
      <button type="button" onClick={handleAdd} aria-label={`Add ${product.name} to bag`} className={iconClasses}>
        <Plus aria-hidden className="size-4" />
      </button>
    </div>
  );
}
