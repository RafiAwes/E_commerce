"use client";

import { StoreImage as Image } from "@/components/shared/StoreImage";
import Link from "next/link";
import { CheckCircle2, PackageX, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { buttonStyles } from "@/components/ui/Button";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { CartSummary } from "@/features/cart/components/CartSummary";
import { formatDate, formatPrice, pluralize } from "@/lib/formatters";
import { orderService } from "@/services/order.service";
import type { Order } from "@/types/common";
import { describeDeliveryWindow, findPaymentMethod } from "../lib/checkout";

type State = { status: "loading" } | { status: "found"; order: Order } | { status: "missing" };

/**
 * Reads the order the checkout just created.
 *
 * The reference travels in the URL, so this component would work unchanged
 * against a real `GET /orders/:reference` — only the service call changes.
 */
export function OrderConfirmation({ reference }: { reference: string | null }) {
  const [state, setState] = useState<State>(() => (reference ? { status: "loading" } : { status: "missing" }));

  useEffect(() => {
    if (!reference) return;
    let active = true;
    orderService.getOrderByReference(reference).then((order) => {
      if (!active) return;
      setState(order ? { status: "found", order } : { status: "missing" });
    });
    return () => {
      active = false;
    };
  }, [reference]);

  if (state.status === "loading") {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-40 w-full" rounded="card" />
        <Skeleton className="h-64 w-full" rounded="card" />
      </div>
    );
  }

  if (state.status === "missing") {
    return (
      <EmptyState
        className="surface-card"
        icon={<PackageX aria-hidden className="size-6" />}
        titleAs="h1"
        title="We could not find that order"
        description="Order confirmations in this prototype are stored in your browser, so they are not available on another device."
        action={
          <Link href="/shop" className={buttonStyles({ variant: "primary" })}>
            Continue shopping
          </Link>
        }
      />
    );
  }

  const { order } = state;
  const payment = findPaymentMethod(order.checkout.paymentMethodId);

  return (
    <div className="flex flex-col gap-8">
      <div className="surface-card flex flex-col items-start gap-4 p-7 sm:flex-row sm:items-center sm:gap-6">
        <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-sage-tint text-success">
          <CheckCircle2 aria-hidden className="size-6" />
        </span>
        <div>
          <h1 className="text-display-sm">Order confirmed</h1>
          <p className="mt-2 text-sm text-muted">
            Thank you, {order.checkout.contact.firstName}. A confirmation is on its way to{" "}
            <span className="text-foreground">{order.checkout.contact.email}</span>.
          </p>
          <p className="mt-3 text-sm">
            Order reference <span className="font-medium tabular">{order.reference}</span>
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem] xl:gap-10">
        <section aria-label="Items ordered" className="surface-card p-6">
          <h2 className="font-sans text-base font-medium">
            {order.summary.itemCount} {pluralize(order.summary.itemCount, "item")} on the way
          </h2>

          <ul className="mt-5 divide-y divide-border">
            {order.items.map((item) => (
              <li key={item.lineId} className="flex gap-4 py-4 first:pt-0">
                <span className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-secondary">
                  {item.image ? <Image src={item.image} alt="" fill sizes="80px" className="object-cover" /> : null}
                </span>
                <span className="min-w-0 flex-1">
                  <Link href={`/products/${item.slug}`} className="block text-sm font-medium transition-colors hover:text-burgundy">
                    {item.name}
                  </Link>
                  {item.variantName ? <span className="mt-0.5 block text-xs text-muted">{item.variantName}</span> : null}
                  {item.personalization ? (
                    <span className="mt-1 block text-xs text-muted">
                      Engraved: “{item.personalization.name}” · {item.personalization.styleName}
                    </span>
                  ) : null}
                  <span className="mt-1 block text-xs text-muted tabular">Quantity {item.quantity}</span>
                </span>
                <span className="text-sm tabular">{formatPrice(item.unitPrice * item.quantity)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-start gap-3 rounded-button bg-secondary p-4">
            <Truck aria-hidden className="mt-0.5 size-4 shrink-0 text-gold" />
            <div className="text-sm">
              <p className="font-medium">
                Estimated delivery {formatDate(order.estimatedDeliveryFrom)} – {formatDate(order.estimatedDeliveryTo)}
              </p>
              <p className="mt-0.5 text-xs text-muted">
                {describeDeliveryWindow(order.checkout.deliveryMethodId)} to {order.checkout.address.addressLine1},{" "}
                {order.checkout.address.city}
              </p>
            </div>
          </div>
        </section>

        <aside className="surface-card flex flex-col gap-5 p-6">
          <h2 className="font-sans text-base font-medium">Payment summary</h2>
          <CartSummary summary={order.summary} />
          <div className="border-t border-border pt-4 text-sm">
            <p className="text-muted">Paying by</p>
            <p className="mt-0.5 font-medium">{payment.name}</p>
          </div>
          {order.checkout.giftMessage ? (
            <div className="border-t border-border pt-4 text-sm">
              <p className="text-muted">Your message</p>
              <p className="mt-1 font-display text-base italic">“{order.checkout.giftMessage}”</p>
            </div>
          ) : null}
          <Link href="/shop" className={buttonStyles({ variant: "primary", size: "lg", fullWidth: true })}>
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
