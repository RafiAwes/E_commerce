import { DELIVERY_METHODS, PAYMENT_METHODS } from "@/lib/constants";
import type { CheckoutData } from "@/types/common";

/** A blank, valid-shaped checkout state. */
export const EMPTY_CHECKOUT: CheckoutData = {
  contact: { firstName: "", lastName: "", email: "", phone: "" },
  address: { addressLine1: "", addressLine2: "", city: "Dhaka", district: "Dhaka", postcode: "" },
  deliveryMethodId: DELIVERY_METHODS[0].id,
  paymentMethodId: PAYMENT_METHODS[0].id,
  giftWrap: false,
  giftMessage: "",
};

export function findDeliveryMethod(id: string) {
  return DELIVERY_METHODS.find((method) => method.id === id) ?? DELIVERY_METHODS[0];
}

export function findPaymentMethod(id: string) {
  return PAYMENT_METHODS.find((method) => method.id === id) ?? PAYMENT_METHODS[0];
}

export function isExpressDelivery(id: string): boolean {
  return id === "express";
}

/** "3–5 working days" style copy, derived from the chosen method. */
export function describeDeliveryWindow(id: string): string {
  return findDeliveryMethod(id).description;
}
