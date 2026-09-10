import { orderRepository, type OrderDraft } from "@/repositories";
import type { Order } from "@/types/common";

export const orderService = {
  /**
   * Places an order. Today this writes to the mock repository; against a real
   * backend it becomes `POST /orders` with no change to the checkout flow.
   */
  createOrder(draft: OrderDraft): Promise<Order> {
    return orderRepository.create(draft);
  },

  getOrderByReference(reference: string): Promise<Order | null> {
    return orderRepository.getByReference(reference);
  },
};

export type { OrderDraft };
