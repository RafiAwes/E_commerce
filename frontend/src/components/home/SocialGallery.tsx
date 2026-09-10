import Image from "next/image";
import Link from "next/link";
import { InstagramIcon } from "@/components/shared/BrandIcons";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SITE } from "@/lib/constants";

const moments = Array.from({ length: 8 }, (_, index) => ({
  src: `/images/gallery/moment-${index + 1}.svg`,
  alt: `Aurelia gift styled in a customer home, photograph ${index + 1}`,
}));

/** Lifestyle grid — social proof told visually rather than in copy. */
export function SocialGallery() {
  return (
    <Section tone="surface">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="@aurelia.gifts"
          title="Made for moments worth remembering."
          description="Tag us and we will share the ones we love."
        />

        <Reveal as="ul" className="mt-12 grid grid-cols-2 gap-2.5 sm:grid-cols-4 md:gap-3.5">
          {moments.map((moment) => (
            <li key={moment.src} className="group relative aspect-square overflow-hidden rounded-image bg-secondary">
              <Image
                src={moment.src}
                alt={moment.alt}
                fill
                sizes="(min-width: 640px) 24vw, 45vw"
                className="object-cover transition-transform duration-[900ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.07]"
              />
              <span
                aria-hidden
                className="absolute inset-0 flex items-center justify-center bg-foreground/0 text-background/0 transition-all duration-300 group-hover:bg-foreground/25 group-hover:text-background"
              >
                <InstagramIcon className="size-5" />
              </span>
            </li>
          ))}
        </Reveal>

        <p className="mt-8 text-center text-sm text-muted">
          <Link
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer noopener"
            className="underline underline-offset-4 transition-colors hover:text-foreground"
          >
            Follow {SITE.name} on Instagram
          </Link>
        </p>
      </Container>
    </Section>
  );
}
