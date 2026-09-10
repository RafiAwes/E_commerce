import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { OccasionCard } from "@/components/shared/OccasionCard";
import type { Occasion } from "@/types/common";

/** Occasion-first discovery — the way most gift shoppers actually think. */
export function ShopByMoment({ occasions }: { occasions: readonly Occasion[] }) {
  return (
    <Section tone="secondary">
      <Container>
        <SectionHeading
          eyebrow="Shop by moment"
          title="Every occasion, considered."
          description="Start with what you&rsquo;re celebrating and we&rsquo;ll show you the gifts that suit it."
          action={
            <Link
              href="/occasions"
              className="inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4 transition-colors hover:text-burgundy"
            >
              All occasions
              <ArrowRight aria-hidden className="size-3.5" />
            </Link>
          }
        />

        <Reveal as="ul" className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 xl:grid-cols-5">
          {occasions.map((occasion) => (
            <li key={occasion.id}>
              <OccasionCard occasion={occasion} sizes="(min-width: 1200px) 18vw, (min-width: 640px) 30vw, 45vw" />
            </li>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}
