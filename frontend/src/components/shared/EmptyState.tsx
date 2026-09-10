import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  /** Heading level, so the empty state slots into the page outline correctly. */
  titleAs?: "h1" | "h2" | "h3";
  description: string;
  action?: ReactNode;
  secondaryAction?: ReactNode;
  className?: string;
}

/** Every "nothing here" moment in the store uses this, so they feel designed. */
export function EmptyState({
  icon,
  title,
  titleAs: Title = "h2",
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center px-6 py-16 text-center", className)}>
      {icon ? (
        <span className="mb-5 inline-flex size-14 items-center justify-center rounded-full bg-secondary text-gold">{icon}</span>
      ) : null}
      <Title className="text-display-sm">{title}</Title>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">{description}</p>
      {action || secondaryAction ? (
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          {action}
          {secondaryAction}
        </div>
      ) : null}
    </div>
  );
}
