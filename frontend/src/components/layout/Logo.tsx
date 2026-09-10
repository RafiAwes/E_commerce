import Link from "next/link";
import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <Link href="/" className={cn("group inline-flex items-baseline gap-1.5", className)} aria-label={`${SITE.name} home`}>
      <span
        className={cn(
          "font-display leading-none tracking-[0.16em] uppercase transition-colors group-hover:text-burgundy",
          compact ? "text-base" : "text-lg md:text-xl",
        )}
      >
        {SITE.name}
      </span>
      <span aria-hidden className="mb-0.5 inline-block size-1 rounded-full bg-gold" />
    </Link>
  );
}
