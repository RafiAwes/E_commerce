import type { CheckoutData, ContactDetails, Order, ShippingAddress } from "@/types/common";

export type { CheckoutData, ContactDetails, Order, ShippingAddress };

export type CheckoutStatus = "editing" | "submitting" | "failed";
