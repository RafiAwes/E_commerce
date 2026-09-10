import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Gift, Star, Truck } from "lucide-react";
import { buttonStyles } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { COMMERCE, SITE } from "@/lib/constants";
import { formatPrice } from "@/lib/formatters";

const assurances = [
  { icon: Star, label: "4.8 average from 2,400+ gifts sent" },
  { icon: Truck, label: `Free delivery over ${formatPrice(COMMERCE.freeShippingThreshold)}` },
  { icon: Gift, label: "Hand-wrapped as standard" },
];

/**
 * Editorial two-column hero on desktop, stacked on mobile. The primary image
 * is the LCP element, so it is marked `priority` and sized precisely.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pt-12 pb-16 md:pt-16 md:pb-20 xl:pt-20 xl:pb-28">
      {/* Soft ground wash — decorative only. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-40 size-[36rem] rounded-full bg-rose-tint blur-3xl"
      />

      <Container className="relative">
        <div className="grid items-center gap-12 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] xl:gap-16">
          <div className="max-w-xl">
            <p className="eyebrow text-gold">Gift atelier · Dhaka</p>
            <h1 className="mt-5 text-display-md sm:text-display-lg 2xl:text-display-xl">{SITE.tagline}</h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
              Thoughtfully chosen gifts and ornaments for the people and moments that matter.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/shop" className={buttonStyles({ variant: "primary", size: "lg" })}>
                Shop gifts
                <ArrowRight aria-hidden className="size-4" />
              </Link>
              <Link href="/collections" className={buttonStyles({ variant: "outline", size: "lg" })}>
                Explore collections
              </Link>
            </div>

            <ul className="mt-10 flex flex-col gap-2.5 border-t border-border pt-7 sm:flex-row sm:flex-wrap sm:gap-x-7">
              {assurances.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2 text-xs text-muted">
                  <Icon aria-hidden className="size-3.5 shrink-0 text-gold" />
                  {label}
                </li>
              ))}
            </ul>
          </div>

          {/* Layered composition: one hero plate with two offset supporting plates. */}
          <div className="relative">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px] bg-secondary sm:aspect-[5/6] xl:aspect-[4/5]">
              <Image
                src="/images/editorial/hero-primary.svg"
                alt="A blush gift box tied with ribbon, styled on a linen surface"
                fill
                priority
                sizes="(min-width: 1200px) 46vw, 92vw"
                className="object-cover"
              />
            </div>

            <div className="absolute -bottom-6 -left-4 hidden w-40 overflow-hidden rounded-[22px] border-4 border-background bg-secondary shadow-raised sm:block xl:-left-10 xl:w-52">
              <div className="relative aspect-square">
                <Image
                  src="/images/editorial/hero-secondary.svg"
                  alt="A gilded ornament hanging against a warm background"
                  fill
                  sizes="(min-width: 1200px) 14vw, 20vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="absolute -top-5 -right-3 hidden rounded-[18px] border border-border bg-surface px-4 py-3 shadow-card xl:block">
              <p className="eyebrow text-gold">This week</p>
              <p className="mt-1 text-sm font-medium">The Celebration Collection</p>
              <Link
                href="/collections/the-celebration-collection"
                className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted underline underline-offset-4 transition-colors hover:text-foreground"
              >
                Explore
                <ArrowRight aria-hidden className="size-3" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
