"use client";

import { useRouter } from "next/navigation";
import { ShieldCheck, Truck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { QuantitySelector } from "@/components/shared/QuantitySelector";
import { useToast } from "@/components/ui/Toast";
import { WishlistButton } from "@/features/wishlist/components/WishlistButton";
import { COMMERCE } from "@/lib/constants";
import { formatPrice } from "@/lib/formatters";
import { validatePersonalization, type PersonalizationErrors } from "@/lib/validations/personalization";
import { useCart } from "@/providers/CartProvider";
import type { ColorId, ColorOption, LineItemPersonalization, Product, ProductVariant } from "@/types/common";
import { getDispatchEstimate, getStockState } from "../lib/pricing";
import { PersonalizationPanel } from "./PersonalizationPanel";
import { ProductOptions } from "./ProductOptions";

export interface ProductPurchaseProps {
  product: Product;
  colors: readonly ColorOption[];
}

function initialPersonalization(product: Product): LineItemPersonalization | null {
  const spec = product.personalization;
  if (!spec) return null;
  const style = spec.styles[0];
  return { name: "", message: "", styleId: style?.id ?? "", styleName: style?.name ?? "" };
}

/**
 * The single interactive island on the product page.
 *
 * It owns the shopper's selection and nothing else: prices come from
 * `lib/pricing`, validation from `lib/validations`, and the cart mutation
 * from the provider.
 */
export function ProductPurchase({ product, colors }: ProductPurchaseProps) {
  const router = useRouter();
  const { addItem, openDrawer } = useCart();
  const { show } = useToast();

  const [variant, setVariant] = useState<ProductVariant | null>(product.variants[0] ?? null);
  const [colorId, setColorId] = useState<ColorId | null>(product.colors[0] ?? null);
  const [quantity, setQuantity] = useState(1);
  const [personalization, setPersonalization] = useState<LineItemPersonalization | null>(() => initialPersonalization(product));
  const [errors, setErrors] = useState<PersonalizationErrors>({});

  const soldOut = getStockState(product) === "sold-out";
  const spec = product.personalization;

  /** Returns true when the line was added, so Buy Now can chain off it. */
  function commit(): boolean {
    if (spec && personalization) {
      const nextErrors = validatePersonalization(spec, personalization);
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length > 0) return false;
    }

    addItem({
      product,
      quantity,
      variant,
      colorId,
      personalization: spec ? personalization : null,
    });
    return true;
  }

  function handleAddToCart() {
    if (!commit()) return;
    openDrawer();
    show({ title: "Added to bag", description: product.name, action: { label: "View bag", href: "/cart" } });
  }

  function handleBuyNow() {
    if (!commit()) return;
    router.push("/checkout");
  }

  return (
    <div className="flex flex-col gap-7">
      <ProductOptions
        product={product}
        colors={colors}
        variant={variant}
        colorId={colorId}
        onVariantChange={setVariant}
        onColorChange={setColorId}
      />

      {spec && personalization ? (
        <PersonalizationPanel
          spec={spec}
          value={personalization}
          errors={errors}
          onChange={(next) => {
            setPersonalization(next);
            if (Object.keys(errors).length > 0) setErrors(validatePersonalization(spec, next));
          }}
        />
      ) : null}

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <QuantitySelector value={quantity} onChange={setQuantity} max={Math.min(product.stock, COMMERCE.maxQuantityPerLine)} />
          <Button size="lg" variant="primary" onClick={handleAddToCart} disabled={soldOut} className="flex-1">
            {soldOut ? "Sold out" : "Add to bag"}
          </Button>
          <WishlistButton
            product={{ id: product.id, slug: product.slug, name: product.name }}
            variant="outline"
            size="md"
            className="size-[3.25rem]"
          />
        </div>

        <Button size="lg" variant="outline" onClick={handleBuyNow} disabled={soldOut} fullWidth>
          Buy it now
        </Button>
      </div>

      <ul className="flex flex-col gap-2.5 border-t border-border pt-5 text-xs text-muted">
        <li className="flex items-center gap-2.5">
          <Truck aria-hidden className="size-3.5 shrink-0 text-gold" />
          {getDispatchEstimate(product)} · free delivery over {formatPrice(COMMERCE.freeShippingThreshold)}
        </li>
        <li className="flex items-center gap-2.5">
          <ShieldCheck aria-hidden className="size-3.5 shrink-0 text-gold" />
          Hand-wrapped as standard, with a blank card for your message
        </li>
      </ul>
    </div>
  );
}
