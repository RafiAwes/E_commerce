"use client";

import { X } from "lucide-react";
import { useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { IconButton } from "./IconButton";
import { Overlay } from "./Overlay";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  side?: "right" | "left" | "bottom";
  footer?: ReactNode;
  className?: string;
  children: ReactNode;
}

const sideStyles = {
  right: "inset-y-0 right-0 w-full max-w-[27rem] animate-slide-in-right border-l",
  left: "inset-y-0 left-0 w-full max-w-[22rem] animate-slide-in-left border-r",
  bottom: "inset-x-0 bottom-0 max-h-[88vh] animate-slide-up rounded-t-dialog border-t",
} as const;

/** Side sheet used for the cart, filters and mobile navigation. */
export function Drawer({ open, onClose, title, description, side = "right", footer, className, children }: DrawerProps) {
  const titleId = useId();
  const descriptionId = useId();

  return (
    <Overlay
      open={open}
      onClose={onClose}
      labelledBy={titleId}
      describedBy={description ? descriptionId : undefined}
      panelClassName={cn(
        "absolute flex flex-col bg-background shadow-overlay border-border",
        sideStyles[side],
        className,
      )}
    >
      <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
        <div>
          <h2 id={titleId} className="text-lg">
            {title}
          </h2>
          {description ? (
            <p id={descriptionId} className="mt-0.5 text-xs text-muted">
              {description}
            </p>
          ) : null}
        </div>
        <IconButton label={`Close ${title.toLowerCase()}`} size="sm" onClick={onClose} className="-mr-1.5">
          <X aria-hidden className="size-[1.15rem]" />
        </IconButton>
      </header>

      <div className="scrollbar-slim min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>

      {footer ? <footer className="border-t border-border bg-surface px-5 py-4 sm:px-6">{footer}</footer> : null}
    </Overlay>
  );
}
