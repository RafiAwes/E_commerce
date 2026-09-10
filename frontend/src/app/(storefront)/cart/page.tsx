import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { CartPageView } from "@/features/cart/components/CartPageView";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Your bag",
  description: "Review the gifts in your bag before checking out.",
  path: "/cart",
  noIndex: true,
});

export default function CartPage() {
  return (
    <Container className="py-8 md:py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Bag" }]} />

      <header className="mt-6">
        <h1 className="text-display-sm md:text-display-md">Your bag</h1>
      </header>

      <div className="mt-8">
        <CartPageView />
      </div>
    </Container>
  );
}
