"use client";

import type { ElementType, ReactNode } from "react";
import { useReveal } from "@/hooks/useReveal";
import { cn } from "@/lib/utils";

export interface RevealProps {
  as?: ElementType;
  delay?: 0 | 1 | 2 | 3;
  className?: string;
  children: ReactNode;
}

const delays = ["", "[transition-delay:90ms]", "[transition-delay:180ms]", "[transition-delay:270ms]"] as const;

/**
 * Thin client wrapper that fades content in on scroll. Kept deliberately
 * small so a reveal never forces a whole section to become a Client
 * Component — server-rendered children are passed straight through.
 */
export function Reveal({ as: Tag = "div", delay = 0, className, children }: RevealProps) {
  const ref = useReveal<HTMLElement>();

  return (
    <Tag ref={ref} data-reveal="" className={cn(delays[delay], className)}>
      {children}
    </Tag>
  );
}
