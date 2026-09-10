import { STORAGE_KEYS } from "@/lib/constants";
import { createId } from "@/lib/utils";
import type { Order } from "@/types/common";
import type { OrderDraft, OrderRepository } from "./order.repository";

const ORDER_PREFIX = "AUR";

function addDays(from: Date, days: number): string {
  const date = new Date(from);
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

function buildReference(): string {
  const block = Math.floor(100000 + Math.random() * 900000);
  return `${ORDER_PREFIX}-${block}`;
}

/**
 * Simulated order storage.
 *
 * Orders are written to localStorage so the confirmation page can be
 * refreshed and shared within the same browser. A real implementation posts
 * to `POST /orders` and reads back from `GET /orders/:reference` — the
 * consuming checkout flow does not change.
 */
export class MockOrderRepository implements OrderRepository {
  async create(draft: OrderDraft): Promise<Order> {
    const placedAt = new Date();
    const isExpress = draft.checkout.deliveryMethodId === "express";

    const order: Order = {
      id: createId("order"),
      reference: buildReference(),
      placedAt: placedAt.toISOString(),
      items: draft.items,
      summary: draft.summary,
      checkout: draft.checkout,
      estimatedDeliveryFrom: addDays(placedAt, isExpress ? 1 : 3),
      estimatedDeliveryTo: addDays(placedAt, isExpress ? 2 : 5),
    };

    this.persist(order);
    return order;
  }

  async getByReference(reference: string): Promise<Order | null> {
    const stored = this.readAll();
    return stored.find((order) => order.reference === reference) ?? null;
  }

  private persist(order: Order): void {
    if (typeof window === "undefined") return;
    try {
      // Keep only the most recent handful — this is a prototype store.
      const next = [order, ...this.readAll().filter((item) => item.reference !== order.reference)].slice(0, 5);
      window.localStorage.setItem(STORAGE_KEYS.lastOrder, JSON.stringify(next));
    } catch {
      // Storage can be unavailable (private mode, quota). The order object is
      // still returned, so the confirmation screen works for this session.
    }
  }

  private readAll(): Order[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEYS.lastOrder);
      if (!raw) return [];
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as Order[]) : [];
    } catch {
      return [];
    }
  }
}
