import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { CheckoutForm } from "@/features/checkout/components/CheckoutForm";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Checkout",
  description: "Complete your Aurelia order.",
  path: "/checkout",
  noIndex: true,
});

export default function CheckoutPage() {
  return (
    <Container className="py-8 md:py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Bag", href: "/cart" }, { label: "Checkout" }]} />

      <header className="mt-6 max-w-2xl">
        <h1 className="text-display-sm md:text-display-md">Checkout</h1>
        <p className="mt-3 text-[0.9375rem] text-muted">
          Five short steps. Nothing is charged — this storefront is a prototype.
        </p>
      </header>

      <div className="mt-9">
        <CheckoutForm />
      </div>
    </Container>
  );
}
