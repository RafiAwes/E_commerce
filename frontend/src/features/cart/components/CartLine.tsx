"use client";

import { StoreImage as Image } from "@/components/shared/StoreImage";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { QuantitySelector } from "@/components/shared/QuantitySelector";
import { formatPrice } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { CartItem } from "@/types/common";

export interface CartLineProps {
  item: CartItem;
  onQuantityChange: (lineId: string, quantity: number) => void;
  onRemove: (lineId: string) => void;
  onNavigate?: () => void;
  compact?: boolean;
}

/** One line in the bag — identical markup in the drawer and on the cart page. */
export function CartLine({ item, onQuantityChange, onRemove, onNavigate, compact = false }: CartLineProps) {
  return (
    <li className="flex gap-4 py-5">
      <Link
        href={`/products/${item.slug}`}
        onClick={onNavigate}
        className={cn("relative shrink-0 overflow-hidden rounded-lg bg-secondary", compact ? "size-20" : "size-24 sm:size-28")}
      >
        {item.image ? <Image src={item.image} alt={item.name} fill sizes="112px" className="object-cover" /> : null}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-sans text-sm leading-snug font-medium">
              <Link href={`/products/${item.slug}`} onClick={onNavigate} className="transition-colors hover:text-burgundy">
                {item.name}
              </Link>
            </h3>
            {item.variantName ? <p className="mt-0.5 text-xs text-muted">{item.variantName}</p> : null}
            {item.personalization ? (
              <p className="mt-1 text-xs text-muted">
                <span className="text-foreground">Engraved:</span> “{item.personalization.name}”
                {item.personalization.message ? ` · ${item.personalization.message}` : ""}
                <span className="block text-[0.6875rem]">{item.personalization.styleName}</span>
              </p>
            ) : null}
          </div>
          <p className="shrink-0 text-sm font-medium tabular">{formatPrice(item.unitPrice * item.quantity)}</p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <QuantitySelector
            size="sm"
            value={item.quantity}
            onChange={(quantity) => onQuantityChange(item.lineId, quantity)}
            label={`Quantity for ${item.name}`}
          />
          <button
            type="button"
            onClick={() => onRemove(item.lineId)}
            className="inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-danger"
          >
            <Trash2 aria-hidden className="size-3.5" />
            Remove
            <span className="sr-only">{item.name}</span>
          </button>
        </div>
      </div>
    </li>
  );
}
