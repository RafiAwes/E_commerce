import { COMMERCE } from "@/lib/constants";
import { clamp, createId } from "@/lib/utils";
import type { CartItem, OrderSummary } from "@/types/common";
import type { AddToCartInput, CartTotalsOptions } from "../types";

/**
 * Pure cart rules.
 *
 * None of this touches React, storage or the DOM, so the same functions back
 * the provider today and could back a server-side cart later unchanged.
 */

/**
 * Two lines are the same only when every purchasable attribute matches —
 * a personalized ornament must never merge with a different engraving.
 */
function isSameLine(item: CartItem, candidate: Omit<CartItem, "lineId" | "quantity" | "addedAt">): boolean {
  return (
    item.productId === candidate.productId &&
    item.variantId === candidate.variantId &&
    item.colorId === candidate.colorId &&
    JSON.stringify(item.personalization) === JSON.stringify(candidate.personalization)
  );
}

export function createCartLine(input: AddToCartInput): Omit<CartItem, "lineId" | "quantity" | "addedAt"> {
  const { product, variant = null, colorId = null, personalization = null } = input;
  const unitPrice = product.price + (variant?.priceDelta ?? 0);

  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    image: product.images[0]?.src ?? "",
    unitPrice,
    compareAtPrice: product.compareAtPrice ? product.compareAtPrice + (variant?.priceDelta ?? 0) : null,
    variantId: variant?.id ?? null,
    variantName: variant?.name ?? null,
    colorId,
    personalization,
  };
}

export function addItem(items: readonly CartItem[], input: AddToCartInput): CartItem[] {
  const line = createCartLine(input);
  const quantity = clamp(input.quantity ?? 1, 1, COMMERCE.maxQuantityPerLine);
  const existing = items.find((item) => isSameLine(item, line));

  if (existing) {
    return items.map((item) =>
      item.lineId === existing.lineId
        ? { ...item, quantity: clamp(item.quantity + quantity, 1, COMMERCE.maxQuantityPerLine) }
        : item,
    );
  }

  return [...items, { ...line, lineId: createId("line"), quantity, addedAt: new Date().toISOString() }];
}

export function removeItem(items: readonly CartItem[], lineId: string): CartItem[] {
  return items.filter((item) => item.lineId !== lineId);
}

export function updateQuantity(items: readonly CartItem[], lineId: string, quantity: number): CartItem[] {
  if (quantity <= 0) return removeItem(items, lineId);
  return items.map((item) =>
    item.lineId === lineId ? { ...item, quantity: clamp(quantity, 1, COMMERCE.maxQuantityPerLine) } : item,
  );
}

export function getItemQuantity(items: readonly CartItem[], productId: string): number {
  return items.filter((item) => item.productId === productId).reduce((total, item) => total + item.quantity, 0);
}

export function countItems(items: readonly CartItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0);
}

export function calculateSubtotal(items: readonly CartItem[]): number {
  return items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
}

export function calculateShipping(subtotalAfterDiscount: number, expressDelivery = false): number {
  if (subtotalAfterDiscount <= 0) return 0;
  if (expressDelivery) return COMMERCE.expressShipping;
  return subtotalAfterDiscount >= COMMERCE.freeShippingThreshold ? 0 : COMMERCE.standardShipping;
}

/** The single money calculation used by the drawer, cart page and checkout. */
export function calculateCartTotals(items: readonly CartItem[], options: CartTotalsOptions = {}): OrderSummary {
  const { giftWrap = false, promoPercentOff = 0, expressDelivery = false } = options;

  const subtotal = calculateSubtotal(items);
  const discount = Math.round((subtotal * clamp(promoPercentOff, 0, 100)) / 100);
  const giftWrapTotal = giftWrap && items.length > 0 ? COMMERCE.giftWrapPrice : 0;
  const discountedSubtotal = subtotal - discount;
  const shipping = calculateShipping(discountedSubtotal, expressDelivery);
  const amountToFreeShipping = Math.max(0, COMMERCE.freeShippingThreshold - discountedSubtotal);

  return {
    itemCount: countItems(items),
    subtotal,
    discount,
    giftWrapTotal,
    shipping,
    total: discountedSubtotal + giftWrapTotal + shipping,
    freeShippingThreshold: COMMERCE.freeShippingThreshold,
    amountToFreeShipping,
    qualifiesForFreeShipping: amountToFreeShipping === 0 && discountedSubtotal > 0,
  };
}
