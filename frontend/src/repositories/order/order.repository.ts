import type { CartItem, CheckoutData, Order, OrderSummary } from "@/types/common";

export interface OrderDraft {
  readonly items: readonly CartItem[];
  readonly summary: OrderSummary;
  readonly checkout: CheckoutData;
}

export interface OrderRepository {
  /** Creates an order and returns the confirmed record. */
  create(draft: OrderDraft): Promise<Order>;
  /** Looks an order up by its customer-facing reference. */
  getByReference(reference: string): Promise<Order | null>;
}
