import type { ColorId, LineItemPersonalization, PersonalizationSpec, Product, ProductVariant } from "@/types/common";

export type { PersonalizationSpec, ProductVariant };

/** Everything the purchase panel needs to track while a shopper decides. */
export interface ProductSelection {
  readonly variant: ProductVariant | null;
  readonly colorId: ColorId | null;
  readonly quantity: number;
  readonly personalization: LineItemPersonalization | null;
}

export interface ProductPageData {
  readonly product: Product;
  readonly related: readonly Product[];
}
