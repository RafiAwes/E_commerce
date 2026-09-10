import { StoreImage as Image } from "./StoreImage";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface TileCardProps {
  href: string;
  title: string;
  subtitle?: string;
  image: string;
  /** Descriptive alt; falls back to empty because the title is adjacent. */
  imageAlt?: string;
  aspect?: "portrait" | "square" | "landscape";
  overlay?: boolean;
  sizes?: string;
  className?: string;
}

const aspects = {
  portrait: "aspect-[3/4]",
  square: "aspect-square",
  landscape: "aspect-[4/3]",
} as const;

/**
 * The shared visual language for every "browse by …" tile: occasions,
 * categories and recipients. Generic on purpose — it knows nothing about the
 * catalogue domain.
 */
export function TileCard({
  href,
  title,
  subtitle,
  image,
  imageAlt = "",
  aspect = "portrait",
  overlay = true,
  sizes = "(min-width: 1200px) 20vw, (min-width: 768px) 30vw, 45vw",
  className,
}: TileCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative block overflow-hidden rounded-image bg-secondary transition-shadow duration-300 hover:shadow-card",
        aspects[aspect],
        className,
      )}
    >
      <Image
        src={image}
        alt={imageAlt}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-[900ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.06]"
      />
      {overlay ? (
        <span
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/25 to-transparent transition-opacity duration-300 group-hover:from-foreground/90"
        />
      ) : null}
      <span className={cn("absolute inset-x-0 bottom-0 p-4", overlay ? "text-background" : "text-foreground")}>
        <span className="block font-display text-lg leading-tight">{title}</span>
        {subtitle ? <span className="mt-1 block text-xs opacity-90">{subtitle}</span> : null}
      </span>
    </Link>
  );
}
