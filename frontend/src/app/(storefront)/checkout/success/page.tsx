import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { OrderConfirmation } from "@/features/checkout/components/OrderConfirmation";
import { readString, type RawSearchParams } from "@/lib/search-params";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Order confirmed",
  description: "Thank you for your order.",
  path: "/checkout/success",
  noIndex: true,
});

/**
 * The reference is read on the server and handed to the client component,
 * which resolves the order through the order service.
 */
export default async function CheckoutSuccessPage({ searchParams }: { searchParams: Promise<RawSearchParams> }) {
  const reference = readString(await searchParams, "ref") ?? null;

  return (
    <Container className="py-10 md:py-16">
      <OrderConfirmation reference={reference} />
    </Container>
  );
}
