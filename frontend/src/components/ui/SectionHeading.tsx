import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  action?: ReactNode;
  as?: "h1" | "h2" | "h3";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  action,
  as: Heading = "h2",
  className,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        centered ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-2xl", centered && "mx-auto")}>
        {eyebrow ? <p className="eyebrow mb-3 text-gold">{eyebrow}</p> : null}
        <Heading className="text-display-sm md:text-display-md">{title}</Heading>
        {description ? <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">{description}</p> : null}
      </div>
      {action ? <div className={cn("shrink-0", centered && "mt-2")}>{action}</div> : null}
    </div>
  );
}
