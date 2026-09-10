import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section, type SectionProps } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductGrid } from "@/features/catalog/components/ProductGrid";
import type { Product } from "@/types/common";

export interface ProductShowcaseProps {
  eyebrow: string;
  title: string;
  description?: string;
  products: readonly Product[];
  href: string;
  linkLabel: string;
  tone?: SectionProps["tone"];
  id?: string;
}

/**
 * The shared shape for every "here are some products" band on the homepage.
 * Best sellers and new arrivals differ only in data and copy.
 */
export function ProductShowcase({
  eyebrow,
  title,
  description,
  products,
  href,
  linkLabel,
  tone = "default",
  id,
}: ProductShowcaseProps) {
  if (products.length === 0) return null;

  return (
    <Section tone={tone} id={id}>
      <Container>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
          action={
            <Link
              href={href}
              className="inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4 transition-colors hover:text-burgundy"
            >
              {linkLabel}
              <ArrowRight aria-hidden className="size-3.5" />
            </Link>
          }
        />
        <Reveal className="mt-10">
          <ProductGrid products={products} columns={4} />
        </Reveal>
      </Container>
    </Section>
  );
}
