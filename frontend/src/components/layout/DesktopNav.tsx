"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { MegaMenu } from "./MegaMenu";
import type { NavData } from "./navigation";

/**
 * Opens on hover for pointer users and on click/Enter for keyboard users,
 * with Escape to dismiss. The panel is inside the same element that owns the
 * hover, so moving the mouse into it never closes the menu.
 */
export function DesktopNav({ nav, className }: { nav: NavData; className?: string }) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenMenu(null);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);

  function scheduleClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 140);
  }

  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }

  return (
    <nav aria-label="Primary" className={cn("items-center", className)} onMouseLeave={scheduleClose}>
      <ul className="flex items-center gap-1">
        {nav.primary.map((item) => {
          const isOpen = openMenu === item.label;

          if (!item.hasMegaMenu) {
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onMouseEnter={() => setOpenMenu(null)}
                  className="inline-flex h-10 items-center rounded-button px-3 text-sm transition-colors hover:text-burgundy"
                >
                  {item.label}
                </Link>
              </li>
            );
          }

          return (
            <li key={item.label} onMouseEnter={() => { cancelClose(); setOpenMenu(item.label); }}>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-haspopup="true"
                onClick={() => setOpenMenu(isOpen ? null : item.label)}
                className="inline-flex h-10 items-center gap-1 rounded-button px-3 text-sm transition-colors hover:text-burgundy"
              >
                {item.label}
                <ChevronDown aria-hidden className={cn("size-3.5 transition-transform duration-200", isOpen && "rotate-180")} />
              </button>

              {/* Mounted only while open: a hidden panel would still make the
                  browser fetch its collection imagery on every page load. */}
              {isOpen ? (
                <div
                  onMouseEnter={cancelClose}
                  className="absolute inset-x-0 top-full animate-fade-in border-t border-border bg-background shadow-raised"
                >
                  <MegaMenu data={nav.mega} onNavigate={() => setOpenMenu(null)} />
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
