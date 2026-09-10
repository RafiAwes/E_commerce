"use client";

import { X } from "lucide-react";
import { useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { IconButton } from "./IconButton";
import { Overlay } from "./Overlay";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
  children: ReactNode;
}

const sizes = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-3xl",
} as const;

export function Dialog({ open, onClose, title, description, footer, size = "md", className, children }: DialogProps) {
  const titleId = useId();
  const descriptionId = useId();

  return (
    <Overlay
      open={open}
      onClose={onClose}
      labelledBy={titleId}
      describedBy={description ? descriptionId : undefined}
      panelClassName={cn(
        "absolute left-1/2 top-1/2 flex max-h-[88vh] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col animate-scale-in rounded-dialog border border-border bg-background shadow-overlay",
        sizes[size],
        className,
      )}
    >
      <header className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
        <div>
          <h2 id={titleId} className="text-display-sm">
            {title}
          </h2>
          {description ? (
            <p id={descriptionId} className="mt-1 text-sm text-muted">
              {description}
            </p>
          ) : null}
        </div>
        <IconButton label="Close dialog" size="sm" onClick={onClose} className="-mr-2">
          <X aria-hidden className="size-[1.15rem]" />
        </IconButton>
      </header>

      <div className="scrollbar-slim min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>

      {footer ? <footer className="border-t border-border px-6 py-4">{footer}</footer> : null}
    </Overlay>
  );
}
