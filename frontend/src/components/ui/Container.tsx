import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ContainerProps {
  as?: ElementType;
  size?: "default" | "wide" | "narrow";
  className?: string;
  children: ReactNode;
}

const sizes = {
  narrow: "max-w-3xl",
  default: "max-w-[1360px]",
  wide: "max-w-[1600px]",
} as const;

/** The one horizontal rhythm every section shares. */
export function Container({ as: Tag = "div", size = "default", className, children }: ContainerProps) {
  return <Tag className={cn("mx-auto w-full px-5 sm:px-6 lg:px-8 xl:px-10", sizes[size], className)}>{children}</Tag>;
}
