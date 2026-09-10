import { StoreImage as Image } from "@/components/shared/StoreImage";
import Link from "next/link";
import { ArrowRight, PenLine, Sparkles, Type } from "lucide-react";
import { buttonStyles } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { ProductGrid } from "@/features/catalog/components/ProductGrid";
import type { Product } from "@/types/common";

const capabilities = [
  { icon: Type, title: "Custom names", copy: "Up to 26 characters, in three lettering styles." },
  { icon: PenLine, title: "Personal messages", copy: "A short line on the reverse, engraved by hand." },
  { icon: Sparkles, title: "Hand engraving", copy: "Cut in our Dhaka atelier, usually within 48 hours." },
];

/** The personalization story, told before the products rather than after. */
export function PersonalizedGifts({ products }: { products: readonly Product[] }) {
  return (
    <Section tone="surface">
      <Container>
        <div className="grid gap-12 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] xl:items-center xl:gap-16">
          <Reveal className="relative">
            <div className="relative aspect-[6/5] overflow-hidden rounded-[26px] bg-secondary">
              <Image
                src="/images/editorial/personalized.svg"
                alt="An engraved wooden plaque resting against a linen backdrop"
                fill
                sizes="(min-width: 1200px) 42vw, 92vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -right-3 -bottom-5 rounded-[18px] border border-border bg-surface px-4 py-3 shadow-card sm:right-6">
              <p className="font-display text-lg italic">Amina &amp; Rafi</p>
              <p className="mt-0.5 text-[0.6875rem] text-muted">Engraved in Flowing Script</p>
            </div>
          </Reveal>

          <div>
            <p className="eyebrow text-gold">Personalized gifts</p>
            <h2 className="mt-5 text-display-sm md:text-display-md">Make it theirs, and no one else&rsquo;s.</h2>
            <p className="mt-5 max-w-md text-[0.9375rem] leading-relaxed text-muted">
              A name, a date, a line only the two of you understand. Our engravers finish every personalized piece by hand
              before it is wrapped.
            </p>

            <ul className="mt-8 flex flex-col gap-5">
              {capabilities.map(({ icon: Icon, title, copy }) => (
                <li key={title} className="flex gap-4">
                  <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-gold-tint text-gold">
                    <Icon aria-hidden className="size-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium">{title}</span>
                    <span className="mt-0.5 block text-sm text-muted">{copy}</span>
                  </span>
                </li>
              ))}
            </ul>

            <Link href="/shop?personalized=true" className={buttonStyles({ variant: "primary", size: "lg", className: "mt-9" })}>
              Explore personalized gifts
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>
        </div>

        {products.length > 0 ? (
          <Reveal className="mt-16">
            <ProductGrid products={products} columns={4} />
          </Reveal>
        ) : null}
      </Container>
    </Section>
  );
}
