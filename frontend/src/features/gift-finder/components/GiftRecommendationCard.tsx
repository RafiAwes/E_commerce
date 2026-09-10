"use client";

import Image from "next/image";
import Link from "next/link";
import { Price } from "@/components/shared/Price";
import { Rating } from "@/components/shared/Rating";
import { WishlistButton } from "@/features/wishlist/components/WishlistButton";
import type { GiftRecommendation } from "../types";

/**
 * A result card that leads with *why* it was suggested — the reason chips are
 * what make the finder feel like a recommendation rather than a filter.
 */
export function GiftRecommendationCard({ recommendation }: { recommendation: GiftRecommendation }) {
  const { product, reasons } = recommendation;

  return (
    <article className="group relative flex flex-col">
      <div className="relative overflow-hidden rounded-image bg-secondary">
        <Link href={`/products/${product.slug}`} tabIndex={-1} aria-hidden className="block aspect-[4/5] w-full">
          {product.image ? (
            <Image
              src={product.image}
              alt=""
              fill
              sizes="(min-width: 1200px) 20vw, (min-width: 768px) 30vw, 45vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
          ) : null}
        </Link>
        <WishlistButton
          product={{ id: product.id, slug: product.slug, name: product.name }}
          className="absolute top-2.5 right-2.5 z-10"
        />
      </div>

      <div className="mt-3 flex flex-col gap-1.5">
        <h4 className="font-sans text-sm leading-snug font-medium">
          <Link href={`/products/${product.slug}`} className="transition-colors hover:text-burgundy">
            <span aria-hidden className="absolute inset-0 z-0" />
            {product.name}
          </Link>
        </h4>
        <Rating value={product.rating} reviewCount={product.reviewCount} />
        <Price value={product.price} compareAtValue={product.compareAtPrice} />
        {reasons.length > 0 ? (
          <ul className="mt-1 flex flex-wrap gap-1.5">
            {reasons.map((reason) => (
              <li key={reason} className="rounded-pill bg-gold-tint px-2 py-1 text-[0.6875rem] text-[#7a6134]">
                {reason}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}
