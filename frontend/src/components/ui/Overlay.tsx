"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { cn } from "@/lib/utils";

export interface OverlayProps {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  describedBy?: string;
  /** Positioning + animation for the panel; supplied by Drawer/Dialog. */
  panelClassName: string;
  className?: string;
  children: ReactNode;
}

/**
 * Shared modal shell: portal, backdrop, Escape handling, scroll lock and
 * focus trap. Drawer and Dialog differ only in how the panel is positioned,
 * so the accessible behaviour is implemented exactly once.
 */
export function Overlay({ open, onClose, labelledBy, describedBy, panelClassName, className, children }: OverlayProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useLockBodyScroll(open);
  useFocusTrap(panelRef, open);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Overlays always start closed, so this only ever runs in the browser —
  // no mounted flag and no extra render needed.
  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className={cn("fixed inset-0 z-100", className)}>
      <button
        type="button"
        aria-label="Close"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 h-full w-full animate-fade-in cursor-default bg-foreground/35 backdrop-blur-[2px]"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        className={panelClassName}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
