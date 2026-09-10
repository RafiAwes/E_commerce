import { StoreImage as Image } from "@/components/shared/StoreImage";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonStyles } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { formatPrice } from "@/lib/formatters";
import type { Collection, Product } from "@/types/common";

export interface FeaturedCollectionBandProps {
  collection: Collection;
  products: readonly Product[];
}

/** Full-bleed editorial band — the most magazine-like moment on the page. */
export function FeaturedCollectionBand({ collection, products }: FeaturedCollectionBandProps) {
  return (
    <section className="bg-foreground text-background">
      <div className="grid xl:grid-cols-2">
        <div className="relative min-h-[22rem] xl:min-h-[38rem]">
          <Image
            src={collection.heroImage}
            alt={`${collection.name} — styled arrangement`}
            fill
            sizes="(min-width: 1200px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex items-center py-16 md:py-20 xl:py-24">
          <Container className="max-w-none xl:max-w-[41rem] xl:px-16">
            <Reveal>
              <p className="eyebrow text-gold-soft">Featured collection</p>
              <h2 className="mt-5 text-display-md text-background xl:text-display-lg">{collection.name}</h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-background/70">{collection.tagline}</p>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-background/55">{collection.description}</p>

              {products.length > 0 ? (
                <ul className="mt-9 flex flex-wrap gap-4">
                  {products.slice(0, 3).map((product) => (
                    <li key={product.id}>
                      <Link href={`/products/${product.slug}`} className="group flex w-32 flex-col gap-2 sm:w-36">
                        <span className="relative block aspect-square overflow-hidden rounded-image bg-background/10">
                          <Image
                            src={product.images[0]?.src ?? ""}
                            alt=""
                            fill
                            sizes="144px"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </span>
                        <span className="text-xs leading-snug text-background/80 transition-colors group-hover:text-background">
                          {product.name}
                        </span>
                        <span className="text-xs text-background/55 tabular">{formatPrice(product.price)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}

              <Link
                href={`/collections/${collection.slug}`}
                className={buttonStyles({ variant: "gold", size: "lg", className: "mt-10" })}
              >
                Explore collection
                <ArrowRight aria-hidden className="size-4" />
              </Link>
            </Reveal>
          </Container>
        </div>
      </div>
    </section>
  );
}
