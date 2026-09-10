import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductGrid } from "@/features/catalog/components/ProductGrid";
import type { Product } from "@/types/common";

export function RelatedProducts({ products }: { products: readonly Product[] }) {
  if (products.length === 0) return null;

  return (
    <Section tone="secondary">
      <Container>
        <SectionHeading eyebrow="You might also like" title="Pairs well with this." />
        <ProductGrid products={products} columns={4} className="mt-9" />
      </Container>
    </Section>
  );
}
