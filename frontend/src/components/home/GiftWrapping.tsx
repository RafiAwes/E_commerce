import { StoreImage as Image } from "@/components/shared/StoreImage";
import { Gift, MessageSquareHeart } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { COMMERCE } from "@/lib/constants";
import { formatPrice } from "@/lib/formatters";

const options = [
  {
    icon: Gift,
    image: "/images/editorial/gift-wrapping.svg",
    alt: "A gift box wrapped in textured paper with a grosgrain ribbon",
    title: "Signature wrapping",
    copy: "Recycled tissue, a hand-tied grosgrain ribbon and a wax seal. Included on every order.",
    meta: "Complimentary",
  },
  {
    icon: MessageSquareHeart,
    image: "/images/editorial/gift-message.svg",
    alt: "A letterpress card with a hand-written message",
    title: "A message in your words",
    copy: "We write your note onto a letterpress card and tuck it inside, so nothing arrives anonymously.",
    meta: `Premium box ${formatPrice(COMMERCE.giftWrapPrice)}`,
  },
];

/** Reassurance band: the gift arrives ready to give. */
export function GiftWrapping() {
  return (
    <Section id="gift-wrapping" tone="secondary">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Gift ready"
          title="Make it gift-ready."
          description="Add beautiful gift wrapping and a personal message to make your order even more special."
        />

        <Reveal as="ul" className="mt-12 grid gap-6 md:grid-cols-2 md:gap-8">
          {options.map(({ icon: Icon, image, alt, title, copy, meta }) => (
            <li key={title} className="surface-card overflow-hidden">
              <div className="relative aspect-[16/10] bg-secondary">
                <Image src={image} alt={alt} fill sizes="(min-width: 768px) 44vw, 92vw" className="object-cover" />
              </div>
              <div className="flex items-start gap-4 p-6">
                <span className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-gold-tint text-gold">
                  <Icon aria-hidden className="size-[1.15rem]" />
                </span>
                <div>
                  <h3 className="font-sans text-base font-medium">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{copy}</p>
                  <p className="eyebrow mt-3 text-gold">{meta}</p>
                </div>
              </div>
            </li>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}
