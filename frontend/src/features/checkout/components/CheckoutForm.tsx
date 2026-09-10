"use client";

import { StoreImage as Image } from "@/components/shared/StoreImage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Banknote, CreditCard, Gift, Loader2, Lock, Smartphone } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { Button, buttonStyles } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { CartEmptyState } from "@/features/cart/components/CartEmptyState";
import { CartSummary } from "@/features/cart/components/CartSummary";
import { calculateCartTotals } from "@/features/cart/lib/cart";
import { COMMERCE, DELIVERY_DISTRICTS, DELIVERY_METHODS, PAYMENT_METHODS } from "@/lib/constants";
import { formatPrice, pluralize } from "@/lib/formatters";
import { hasErrors, validateCheckout, type CheckoutErrors } from "@/lib/validations/checkout";
import { useCart } from "@/providers/CartProvider";
import { orderService } from "@/services/order.service";
import { cn } from "@/lib/utils";
import type { CheckoutData } from "@/types/common";
import { EMPTY_CHECKOUT, isExpressDelivery } from "../lib/checkout";

const paymentIcons = { cod: Banknote, card: CreditCard, mobile: Smartphone } as const;

function Fieldset({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
  return (
    <fieldset className="surface-card p-6">
      <legend className="sr-only">{title}</legend>
      <h2 className="flex items-center gap-2.5 font-sans text-base font-medium" aria-hidden>
        <span className="inline-flex size-6 items-center justify-center rounded-full bg-foreground text-[0.6875rem] text-background tabular">
          {step}
        </span>
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </fieldset>
  );
}

/**
 * Prototype checkout.
 *
 * The form owns input state only: validation comes from
 * `lib/validations/checkout`, totals from the cart lib, and order creation
 * from the order service — which is the seam a real `POST /orders` slots into.
 */
export function CheckoutForm() {
  const router = useRouter();
  const { items, isHydrated, giftWrap, setGiftWrap, promo, clearCart } = useCart();

  const [data, setData] = useState<CheckoutData>({ ...EMPTY_CHECKOUT, giftWrap });
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const summary = useMemo(
    () =>
      calculateCartTotals(items, {
        giftWrap,
        promoPercentOff: promo?.percentOff ?? 0,
        expressDelivery: isExpressDelivery(data.deliveryMethodId),
      }),
    [items, giftWrap, promo, data.deliveryMethodId],
  );

  function update<K extends keyof CheckoutData>(key: K, value: CheckoutData[K]) {
    setData((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const payload: CheckoutData = { ...data, giftWrap };
    const nextErrors = validateCheckout(payload);
    setErrors(nextErrors);

    if (hasErrors(nextErrors)) {
      document.querySelector<HTMLElement>("[aria-invalid=true]")?.focus();
      return;
    }

    setSubmitting(true);
    const order = await orderService.createOrder({ items, summary, checkout: payload });
    clearCart();
    router.push(`/checkout/success?ref=${encodeURIComponent(order.reference)}`);
  }

  if (!isHydrated) {
    return (
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <Skeleton className="h-[38rem] w-full" rounded="card" />
        <Skeleton className="h-80 w-full" rounded="card" />
      </div>
    );
  }

  if (items.length === 0) return <CartEmptyState />;

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_22rem] xl:gap-12">
      <div className="flex flex-col gap-5">
        <Fieldset step={1} title="Contact information">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              id="checkout-first-name"
              label="First name"
              autoComplete="given-name"
              value={data.contact.firstName}
              error={errors.firstName}
              onChange={(event) => update("contact", { ...data.contact, firstName: event.target.value })}
              required
            />
            <Input
              id="checkout-last-name"
              label="Last name"
              autoComplete="family-name"
              value={data.contact.lastName}
              error={errors.lastName}
              onChange={(event) => update("contact", { ...data.contact, lastName: event.target.value })}
              required
            />
            <Input
              id="checkout-email"
              type="email"
              label="Email"
              autoComplete="email"
              hint="We send the order confirmation here."
              value={data.contact.email}
              error={errors.email}
              onChange={(event) => update("contact", { ...data.contact, email: event.target.value })}
              required
            />
            <Input
              id="checkout-phone"
              type="tel"
              label="Mobile number"
              autoComplete="tel"
              placeholder="01XXXXXXXXX"
              value={data.contact.phone}
              error={errors.phone}
              onChange={(event) => update("contact", { ...data.contact, phone: event.target.value })}
              required
            />
          </div>
        </Fieldset>

        <Fieldset step={2} title="Shipping address">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              id="checkout-address1"
              label="Address"
              autoComplete="address-line1"
              containerClassName="sm:col-span-2"
              value={data.address.addressLine1}
              error={errors.addressLine1}
              onChange={(event) => update("address", { ...data.address, addressLine1: event.target.value })}
              required
            />
            <Input
              id="checkout-address2"
              label="Apartment, floor (optional)"
              autoComplete="address-line2"
              containerClassName="sm:col-span-2"
              value={data.address.addressLine2}
              onChange={(event) => update("address", { ...data.address, addressLine2: event.target.value })}
            />
            <Input
              id="checkout-city"
              label="City"
              autoComplete="address-level2"
              value={data.address.city}
              error={errors.city}
              onChange={(event) => update("address", { ...data.address, city: event.target.value })}
              required
            />
            <Select
              id="checkout-district"
              label="District"
              autoComplete="address-level1"
              options={DELIVERY_DISTRICTS.map((district) => ({ value: district, label: district }))}
              value={data.address.district}
              error={errors.district}
              onChange={(event) => update("address", { ...data.address, district: event.target.value })}
              required
            />
            <Input
              id="checkout-postcode"
              label="Postcode"
              autoComplete="postal-code"
              inputMode="numeric"
              placeholder="1213"
              value={data.address.postcode}
              error={errors.postcode}
              onChange={(event) => update("address", { ...data.address, postcode: event.target.value })}
              required
            />
          </div>
        </Fieldset>

        <Fieldset step={3} title="Delivery method">
          <div className="flex flex-col gap-3" role="radiogroup" aria-label="Delivery method">
            {DELIVERY_METHODS.map((method) => {
              const selected = data.deliveryMethodId === method.id;
              return (
                <label
                  key={method.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-3.5 rounded-button border p-4 transition-colors",
                    selected ? "border-foreground bg-secondary/50" : "border-border hover:border-foreground/30",
                  )}
                >
                  <input
                    type="radio"
                    name="delivery-method"
                    value={method.id}
                    checked={selected}
                    onChange={() => update("deliveryMethodId", method.id)}
                    className="size-[1.05rem] shrink-0 cursor-pointer appearance-none rounded-full border border-border bg-surface checked:border-[5px] checked:border-foreground"
                  />
                  <span className="flex-1">
                    <span className="block text-sm font-medium">{method.name}</span>
                    <span className="block text-xs text-muted">{method.description}</span>
                  </span>
                  <span className="text-sm tabular">
                    {summary.subtotal - summary.discount >= COMMERCE.freeShippingThreshold && method.id === "standard"
                      ? "Free"
                      : formatPrice(method.price)}
                  </span>
                </label>
              );
            })}
          </div>
        </Fieldset>

        <Fieldset step={4} title="Payment method">
          <div className="flex flex-col gap-3" role="radiogroup" aria-label="Payment method">
            {PAYMENT_METHODS.map((method) => {
              const Icon = paymentIcons[method.id];
              const selected = data.paymentMethodId === method.id;
              return (
                <label
                  key={method.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-3.5 rounded-button border p-4 transition-colors",
                    selected ? "border-foreground bg-secondary/50" : "border-border hover:border-foreground/30",
                  )}
                >
                  <input
                    type="radio"
                    name="payment-method"
                    value={method.id}
                    checked={selected}
                    onChange={() => update("paymentMethodId", method.id)}
                    className="size-[1.05rem] shrink-0 cursor-pointer appearance-none rounded-full border border-border bg-surface checked:border-[5px] checked:border-foreground"
                  />
                  <Icon aria-hidden className="size-4 shrink-0 text-gold" />
                  <span className="flex-1">
                    <span className="block text-sm font-medium">{method.name}</span>
                    <span className="block text-xs text-muted">{method.description}</span>
                  </span>
                </label>
              );
            })}
          </div>
          <p className="mt-4 flex items-start gap-2 text-xs text-muted">
            <Lock aria-hidden className="mt-0.5 size-3.5 shrink-0" />
            This is a prototype. No card details are collected and no payment is taken.
          </p>
        </Fieldset>

        <Fieldset step={5} title="Gift options">
          <div className="flex flex-col gap-4">
            <Checkbox
              id="checkout-gift-wrap"
              checked={giftWrap}
              onChange={(event) => setGiftWrap(event.target.checked)}
              label={
                <span className="inline-flex items-center gap-2">
                  <Gift aria-hidden className="size-3.5 text-gold" />
                  Add premium gift wrapping
                </span>
              }
              description={`Letterpress card and ribboned box — ${formatPrice(COMMERCE.giftWrapPrice)}`}
            />
            <Textarea
              id="checkout-gift-message"
              label="Message on the card (optional)"
              placeholder="Happy birthday — with love, always."
              maxLength={220}
              value={data.giftMessage}
              hint={`${data.giftMessage.length}/220 characters`}
              onChange={(event) => update("giftMessage", event.target.value)}
            />
          </div>
        </Fieldset>
      </div>

      <aside className="xl:sticky xl:top-28 xl:self-start">
        <div className="surface-card flex flex-col gap-5 p-6">
          <h2 className="font-sans text-base font-medium">
            Order summary
            <span className="ml-2 text-sm font-normal text-muted tabular">
              ({summary.itemCount} {pluralize(summary.itemCount, "item")})
            </span>
          </h2>

          <ul className="flex max-h-64 flex-col gap-4 overflow-y-auto scrollbar-slim">
            {items.map((item) => (
              <li key={item.lineId} className="flex gap-3">
                <span className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-secondary">
                  {item.image ? <Image src={item.image} alt="" fill sizes="56px" className="object-cover" /> : null}
                  <span className="absolute -top-1 -right-1 inline-flex min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[0.625rem] leading-4 text-background tabular">
                    {item.quantity}
                  </span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm">{item.name}</span>
                  {item.variantName ? <span className="block text-xs text-muted">{item.variantName}</span> : null}
                </span>
                <span className="text-sm tabular">{formatPrice(item.unitPrice * item.quantity)}</span>
              </li>
            ))}
          </ul>

          <CartSummary summary={summary} promo={promo} className="border-t border-border pt-5" />

          <Button type="submit" size="lg" fullWidth disabled={submitting}>
            {submitting ? <Loader2 aria-hidden className="size-4 animate-spin" /> : null}
            {submitting ? "Placing order" : "Place order"}
          </Button>

          <Link
            href="/cart"
            className={buttonStyles({ variant: "ghost", size: "sm", className: "text-muted underline underline-offset-4" })}
          >
            Back to bag
          </Link>
        </div>
      </aside>
    </form>
  );
}
