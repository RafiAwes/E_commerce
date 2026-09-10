"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types/common";

export interface ProductGalleryProps {
  images: readonly ProductImage[];
  productName: string;
}

/**
 * Thumbnail-driven gallery.
 *
 * Thumbnails are a real tablist so arrow keys work, and only the active image
 * is eagerly loaded — the rest are lazy, which keeps the product page light.
 */
export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? images[0];

  if (!active) {
    return <div className="aspect-[4/5] w-full rounded-image bg-secondary" aria-hidden />;
  }

  function move(delta: number) {
    setActiveIndex((current) => (current + delta + images.length) % images.length);
  }

  return (
    <div className="flex flex-col gap-3 md:flex-row-reverse md:gap-4">
      <div className="group relative min-w-0 flex-1 overflow-hidden rounded-image bg-secondary">
        <div className="relative aspect-[4/5] w-full">
          {images.map((image, index) => (
            <Image
              key={image.id}
              src={image.src}
              alt={index === activeIndex ? image.alt : ""}
              fill
              priority={index === 0}
              loading={index === 0 ? undefined : "lazy"}
              sizes="(min-width: 1200px) 46vw, (min-width: 768px) 55vw, 92vw"
              className={cn(
                "object-cover transition-[opacity,transform] duration-500 ease-[var(--ease-out-soft)] group-hover:scale-[1.03]",
                index === activeIndex ? "opacity-100" : "pointer-events-none opacity-0",
              )}
            />
          ))}
        </div>

        {images.length > 1 ? (
          <p className="absolute right-3 bottom-3 rounded-pill bg-surface/85 px-2.5 py-1 text-[0.6875rem] backdrop-blur-sm tabular">
            {activeIndex + 1} / {images.length}
          </p>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div
          role="tablist"
          aria-label={`${productName} images`}
          aria-orientation="horizontal"
          className="hide-scrollbar flex gap-2.5 overflow-x-auto md:w-20 md:flex-col md:overflow-visible"
          onKeyDown={(event) => {
            if (event.key === "ArrowRight" || event.key === "ArrowDown") {
              event.preventDefault();
              move(1);
            }
            if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
              event.preventDefault();
              move(-1);
            }
          }}
        >
          {images.map((image, index) => {
            const selected = index === activeIndex;
            return (
              <button
                key={image.id}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-label={`View image ${index + 1} of ${images.length}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "relative aspect-[4/5] w-16 shrink-0 overflow-hidden rounded-lg border bg-secondary transition-colors md:w-full",
                  selected ? "border-foreground" : "border-transparent hover:border-border",
                )}
              >
                <Image src={image.src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
