"use client";

import { Check } from "lucide-react";
import { useId } from "react";
import { formatPrice } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { ColorId, ColorOption, Product, ProductVariant } from "@/types/common";

export interface ProductOptionsProps {
  product: Product;
  colors: readonly ColorOption[];
  variant: ProductVariant | null;
  colorId: ColorId | null;
  onVariantChange: (variant: ProductVariant | null) => void;
  onColorChange: (colorId: ColorId) => void;
}

/**
 * Variant and finish pickers. Purely presentational — the selection itself is
 * owned by `ProductPurchase`, which is the component that can act on it.
 */
export function ProductOptions({ product, colors, variant, colorId, onVariantChange, onColorChange }: ProductOptionsProps) {
  const baseId = useId();
  const available = colors.filter((color) => product.colors.includes(color.id));

  if (product.variants.length === 0 && available.length <= 1) return null;

  return (
    <div className="flex flex-col gap-6">
      {product.variants.length > 0 ? (
        <fieldset>
          <legend className="mb-2.5 text-[0.8125rem] font-medium">
            Size
            {variant ? <span className="ml-2 text-muted">{variant.name}</span> : null}
          </legend>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((option) => {
              const selected = variant?.id === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  disabled={!option.inStock}
                  aria-pressed={selected}
                  onClick={() => onVariantChange(option)}
                  className={cn(
                    "rounded-button border px-4 py-2.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                    selected ? "border-foreground bg-foreground text-background" : "border-border bg-surface hover:border-foreground/35",
                  )}
                >
                  {option.name}
                  {option.priceDelta > 0 ? (
                    <span className={cn("ml-2 text-xs tabular", selected ? "text-background/70" : "text-muted")}>
                      +{formatPrice(option.priceDelta)}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      {available.length > 1 ? (
        <fieldset>
          <legend className="mb-2.5 text-[0.8125rem] font-medium">
            Finish
            {colorId ? <span className="ml-2 text-muted">{available.find((color) => color.id === colorId)?.name}</span> : null}
          </legend>
          <div className="flex flex-wrap gap-2.5">
            {available.map((color) => {
              const selected = color.id === colorId;
              return (
                <button
                  key={color.id}
                  type="button"
                  id={`${baseId}-${color.id}`}
                  aria-pressed={selected}
                  aria-label={color.name}
                  title={color.name}
                  onClick={() => onColorChange(color.id)}
                  className={cn(
                    "relative inline-flex size-9 items-center justify-center rounded-full border-2 transition-colors",
                    selected ? "border-foreground" : "border-border hover:border-foreground/35",
                  )}
                >
                  <span aria-hidden className="size-6 rounded-full" style={{ backgroundColor: color.hex }} />
                  {selected ? (
                    <Check aria-hidden strokeWidth={3} className="absolute size-3 text-foreground mix-blend-difference" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}
    </div>
  );
}
