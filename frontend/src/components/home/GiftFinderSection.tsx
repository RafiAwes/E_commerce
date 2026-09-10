import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GiftFinder, type GiftFinderOption } from "@/features/gift-finder/components/GiftFinder";
import type { GiftFinderProduct } from "@/features/gift-finder/types";

export interface GiftFinderSectionProps {
  products: readonly GiftFinderProduct[];
  recipients: readonly GiftFinderOption[];
  occasions: readonly GiftFinderOption[];
}

/**
 * Server wrapper around the interactive finder: copy and layout stay on the
 * server, only the selector itself is a Client Component.
 */
export function GiftFinderSection({ products, recipients, occasions }: GiftFinderSectionProps) {
  return (
    <Section tone="secondary" id="gift-finder" spacing="lg">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Gift finder"
          title="Not sure what to buy?"
          description="Tell us who you&rsquo;re shopping for, what you&rsquo;re celebrating, and your budget. We&rsquo;ll help narrow it down."
        />
        <GiftFinder products={products} recipients={recipients} occasions={occasions} className="mt-10" />
      </Container>
    </Section>
  );
}
