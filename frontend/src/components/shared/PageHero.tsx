import { StoreImage as Image } from "./StoreImage";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";
import type { AccentTone } from "@/types/common";

export interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  accent?: AccentTone;
  breadcrumbs?: ReactNode;
  actions?: ReactNode;
}

const accents: Record<AccentTone, string> = {
  gold: "bg-gold-tint",
  rose: "bg-rose-tint",
  sage: "bg-sage-tint",
  burgundy: "bg-secondary",
};

/**
 * Shared editorial header for collection and occasion pages. Both routes use
 * the same architecture; only the data differs.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  accent = "gold",
  breadcrumbs,
  actions,
}: PageHeroProps) {
  return (
    <section className={cn("overflow-hidden", accents[accent])}>
      <Container className="py-8 md:py-12">
        {breadcrumbs}
        <div className="mt-6 grid items-center gap-9 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] xl:gap-16">
          <div className="max-w-xl">
            <p className="eyebrow text-gold">{eyebrow}</p>
            <h1 className="mt-4 text-display-md xl:text-display-lg">{title}</h1>
            <p className="mt-5 text-[0.9375rem] leading-relaxed text-muted">{description}</p>
            {actions ? <div className="mt-7 flex flex-wrap gap-3">{actions}</div> : null}
          </div>

          <div className="relative aspect-[16/10] overflow-hidden rounded-[26px] bg-secondary">
            <Image
              src={image}
              alt={imageAlt}
              fill
              priority
              sizes="(min-width: 1200px) 52vw, 92vw"
              className="object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
