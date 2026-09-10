import { Tabs } from "@/components/ui/Tabs";
import { COMMERCE } from "@/lib/constants";
import { formatPrice } from "@/lib/formatters";
import type { Product, Review } from "@/types/common";
import { ProductReviews } from "./ProductReviews";

export interface ProductDetailsTabsProps {
  product: Product;
  reviews: readonly Review[];
  breakdown: readonly { stars: number; count: number }[];
}

function DetailsPanel({ product }: { product: Product }) {
  return (
    <div className="grid gap-10 md:grid-cols-2">
      <div>
        <h3 className="font-sans text-sm font-medium">In the box</h3>
        <ul className="mt-3 flex flex-col gap-2 text-sm text-muted">
          {product.details.map((detail) => (
            <li key={detail} className="flex gap-2.5">
              <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-gold" />
              {detail}
            </li>
          ))}
        </ul>
      </div>
      <dl className="flex flex-col gap-3 text-sm">
        <div className="flex justify-between gap-4 border-b border-border pb-3">
          <dt className="text-muted">Materials</dt>
          <dd className="text-right">{product.materials}</dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-border pb-3">
          <dt className="text-muted">Dimensions</dt>
          <dd className="text-right">{product.dimensions}</dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-border pb-3">
          <dt className="text-muted">Personalizable</dt>
          <dd className="text-right">{product.isPersonalized ? "Yes, engraved by hand" : "No"}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Care</dt>
          <dd className="text-right">Wipe with a soft dry cloth</dd>
        </div>
      </dl>
    </div>
  );
}

function DeliveryPanel({ product }: { product: Product }) {
  return (
    <div className="grid gap-8 text-sm md:grid-cols-3">
      <div>
        <h3 className="font-sans text-sm font-medium">Delivery</h3>
        <p className="mt-2 leading-relaxed text-muted">
          Standard delivery is {formatPrice(COMMERCE.standardShipping)} and arrives in 3–5 working days. Express is{" "}
          {formatPrice(COMMERCE.expressShipping)} for next working day inside Dhaka. Delivery is free on orders over{" "}
          {formatPrice(COMMERCE.freeShippingThreshold)}.
        </p>
      </div>
      <div>
        <h3 className="font-sans text-sm font-medium">Returns</h3>
        <p className="mt-2 leading-relaxed text-muted">
          {product.isPersonalized
            ? "Personalized pieces cannot be returned unless they arrive damaged or the engraving differs from your order."
            : "Return anything unused within 14 days for a full refund. We arrange collection inside Dhaka."}
        </p>
      </div>
      <div>
        <h3 className="font-sans text-sm font-medium">Gift wrapping</h3>
        <p className="mt-2 leading-relaxed text-muted">
          Signature wrapping is included on every order. The premium box with a letterpress card is{" "}
          {formatPrice(COMMERCE.giftWrapPrice)} and can be added at checkout.
        </p>
      </div>
    </div>
  );
}

function FaqPanel({ product }: { product: Product }) {
  const faqs = [
    {
      question: "Can I send this directly to the recipient?",
      answer:
        "Yes. Enter their address at checkout and add a message — we never include a price anywhere in the packaging.",
    },
    {
      question: product.isPersonalized ? "How long does engraving take?" : "How quickly will it ship?",
      answer: product.isPersonalized
        ? "We engrave and dispatch within 48 hours. If the spelling looks unusual we message you to confirm before cutting."
        : "Orders placed before 4pm are dispatched the same working day.",
    },
    {
      question: "Is the packaging suitable for gifting as-is?",
      answer: "It is. Everything arrives wrapped in tissue with a ribbon and seal, inside a plain outer shipping box.",
    },
    {
      question: "Can I order this in a larger quantity?",
      answer: "For orders above ten pieces, email us and we will arrange corporate pricing and a delivery schedule.",
    },
  ];

  return (
    <dl className="divide-y divide-border">
      {faqs.map((faq) => (
        <div key={faq.question} className="py-4 first:pt-0 last:pb-0">
          <dt className="font-sans text-sm font-medium">{faq.question}</dt>
          <dd className="mt-1.5 text-sm leading-relaxed text-muted">{faq.answer}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Panels are rendered on the server and handed to the client `Tabs`
 * primitive as props, so only the tab switching itself ships JavaScript.
 */
export function ProductDetailsTabs({ product, reviews, breakdown }: ProductDetailsTabsProps) {
  return (
    <Tabs
      items={[
        { id: "details", label: "Product details", content: <DetailsPanel product={product} /> },
        { id: "delivery", label: "Delivery & returns", content: <DeliveryPanel product={product} /> },
        {
          id: "reviews",
          label: `Reviews (${product.reviewCount})`,
          content: (
            <ProductReviews
              reviews={reviews}
              rating={product.rating}
              reviewCount={product.reviewCount}
              breakdown={breakdown}
            />
          ),
        },
        { id: "faq", label: "FAQ", content: <FaqPanel product={product} /> },
      ]}
    />
  );
}
