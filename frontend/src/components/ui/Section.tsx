import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SectionProps {
  as?: ElementType;
  tone?: "default" | "secondary" | "surface" | "ink";
  spacing?: "sm" | "md" | "lg";
  className?: string;
  id?: string;
  children: ReactNode;
}

const tones = {
  default: "bg-background text-foreground",
  secondary: "bg-secondary text-foreground",
  surface: "bg-surface text-foreground",
  ink: "bg-foreground text-background",
} as const;

const spacings = {
  sm: "py-12 md:py-16",
  md: "py-16 md:py-20 xl:py-24",
  lg: "py-20 md:py-28 xl:py-32",
} as const;

/** Vertical rhythm is a token, not a per-page decision. */
export function Section({ as: Tag = "section", tone = "default", spacing = "md", className, id, children }: SectionProps) {
  return (
    <Tag id={id} className={cn(tones[tone], spacings[spacing], className)}>
      {children}
    </Tag>
  );
}
