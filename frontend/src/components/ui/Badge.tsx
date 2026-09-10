import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { ProductBadge } from "@/types/common";

export type BadgeTone = "neutral" | "gold" | "rose" | "sage" | "burgundy" | "outline";

const tones: Record<BadgeTone, string> = {
  neutral: "bg-foreground text-background",
  gold: "bg-gold-soft text-[#6b5322]",
  rose: "bg-rose-soft text-[#7d4a4a]",
  sage: "bg-sage-soft text-[#4c5945]",
  burgundy: "bg-burgundy text-white",
  outline: "border border-border bg-surface/85 text-muted",
};

export interface BadgeProps {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
}

export function Badge({ tone = "neutral", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "eyebrow inline-flex items-center rounded-pill px-2.5 py-1 text-[0.625rem] leading-none",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

const productBadgeConfig: Record<ProductBadge, { label: string; tone: BadgeTone }> = {
  new: { label: "New", tone: "sage" },
  bestseller: { label: "Bestseller", tone: "gold" },
  limited: { label: "Limited", tone: "burgundy" },
  sale: { label: "Sale", tone: "rose" },
};

/** Maps a domain badge to its presentation — one badge per card, by design. */
export function ProductBadgePill({ badge, className }: { badge: ProductBadge; className?: string }) {
  const config = productBadgeConfig[badge];
  return (
    <Badge tone={config.tone} className={className}>
      {config.label}
    </Badge>
  );
}
