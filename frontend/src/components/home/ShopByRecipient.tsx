import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TileCard } from "@/components/shared/TileCard";
import type { Recipient } from "@/types/common";

/** Recipient tiles lead into the catalogue with the filter already applied. */
export function ShopByRecipient({ recipients }: { recipients: readonly Recipient[] }) {
  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="Shop by recipient"
          title="Who are you shopping for?"
          description="Edits built around the person, not the price point."
        />

        <Reveal as="ul" className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4 xl:grid-cols-7">
          {recipients.map((recipient) => (
            <li key={recipient.id}>
              <TileCard
                href={`/shop?recipient=${recipient.slug}`}
                title={recipient.name}
                image={recipient.image}
                imageAlt={`Gifts ${recipient.name.toLowerCase()}`}
                sizes="(min-width: 1200px) 13vw, (min-width: 768px) 24vw, 45vw"
              />
            </li>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}
