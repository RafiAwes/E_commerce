"use client";

import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";
import { useState } from "react";
import { buttonStyles } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { cn } from "@/lib/utils";
import type { NavData, NavLink } from "./navigation";

const RECIPIENT_LINKS: readonly NavLink[] = [
  { label: "For Her", href: "/shop?recipient=her" },
  { label: "For Him", href: "/shop?recipient=him" },
  { label: "For Couples", href: "/shop?recipient=couples" },
  { label: "For Parents", href: "/shop?recipient=parents" },
  { label: "For Friends", href: "/shop?recipient=friends" },
  { label: "For Kids", href: "/shop?recipient=kids" },
  { label: "For Colleagues", href: "/shop?recipient=colleagues" },
];

function Accordion({ title, links, onNavigate }: { title: string; links: readonly NavLink[]; onNavigate: () => void }) {
  return (
    <details className="group border-b border-border">
      <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-sm font-medium">
        {title}
        <ChevronDown aria-hidden className="size-4 text-muted transition-transform group-open:rotate-180" />
      </summary>
      <ul className="flex flex-col gap-1 pb-4">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={onNavigate}
              className="block rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-secondary hover:text-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
}

export function MobileNav({ nav, className }: { nav: NavData; className?: string }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className={cn("inline-flex size-10 items-center justify-center rounded-full transition-colors hover:bg-secondary", className)}
      >
        <Menu aria-hidden className="size-[1.15rem]" />
      </button>

      <Drawer
        open={open}
        onClose={close}
        side="left"
        title="Menu"
        footer={
          <Link href="/#gift-finder" onClick={close} className={buttonStyles({ variant: "primary", fullWidth: true })}>
            Find the perfect gift
          </Link>
        }
      >
        <div className="px-5 py-2">
          <Accordion title="Shop by category" links={nav.mega.categories} onNavigate={close} />
          <Accordion title="Shop by occasion" links={nav.mega.occasions} onNavigate={close} />
          <Accordion title="Shop by recipient" links={RECIPIENT_LINKS} onNavigate={close} />

          <ul className="flex flex-col py-2">
            {nav.primary
              .filter((item) => !item.hasMegaMenu)
              .map((item) => (
                <li key={item.href}>
                  <Link href={item.href} onClick={close} className="block border-b border-border py-4 text-sm font-medium">
                    {item.label}
                  </Link>
                </li>
              ))}
            <li>
              <Link href="/shop" onClick={close} className="block py-4 text-sm font-medium">
                Shop everything
              </Link>
            </li>
          </ul>
        </div>
      </Drawer>
    </>
  );
}
