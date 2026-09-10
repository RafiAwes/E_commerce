import { StoreImage as Image } from "@/components/shared/StoreImage";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { MegaMenuData } from "./navigation";

export interface MegaMenuProps {
  data: MegaMenuData;
  onNavigate: () => void;
}

function Column({ title, links, onNavigate }: { title: string; links: MegaMenuData["categories"]; onNavigate: () => void }) {
  return (
    <div>
      <h3 className="eyebrow text-muted">{title}</h3>
      <ul className="mt-4 flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} onClick={onNavigate} className="text-sm transition-colors hover:text-burgundy">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Three organised columns and three featured collections — deliberately not
 * an exhaustive wall of links.
 */
export function MegaMenu({ data, onNavigate }: MegaMenuProps) {
  return (
    <div className="mx-auto grid w-full max-w-[1360px] gap-10 px-5 py-9 sm:px-6 lg:px-8 xl:grid-cols-[repeat(3,minmax(0,0.6fr))_minmax(0,1.4fr)] xl:px-10">
      <Column title="Shop by category" links={data.categories} onNavigate={onNavigate} />
      <Column title="Shop by occasion" links={data.occasions} onNavigate={onNavigate} />

      <div>
        <h3 className="eyebrow text-muted">Shop by recipient</h3>
        <ul className="mt-4 flex flex-col gap-2.5">
          {[
            { label: "For Her", href: "/shop?recipient=her" },
            { label: "For Him", href: "/shop?recipient=him" },
            { label: "For Couples", href: "/shop?recipient=couples" },
            { label: "For Parents", href: "/shop?recipient=parents" },
            { label: "For Friends", href: "/shop?recipient=friends" },
            { label: "For Kids", href: "/shop?recipient=kids" },
            { label: "For Colleagues", href: "/shop?recipient=colleagues" },
          ].map((link) => (
            <li key={link.href}>
              <Link href={link.href} onClick={onNavigate} className="text-sm transition-colors hover:text-burgundy">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="eyebrow text-muted">Featured collections</h3>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {data.collections.map((collection) => (
            <li key={collection.href}>
              <Link href={collection.href} onClick={onNavigate} className="group block">
                <span className="relative block aspect-[4/3] overflow-hidden rounded-image bg-secondary">
                  <Image
                    src={collection.image}
                    alt=""
                    fill
                    sizes="(min-width: 1200px) 14vw, 30vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </span>
                <span className="mt-2.5 block text-sm font-medium">{collection.label}</span>
                <span className="mt-0.5 block text-xs leading-snug text-muted">{collection.tagline}</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/shop"
          onClick={onNavigate}
          className="mt-5 inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4 transition-colors hover:text-burgundy"
        >
          Shop everything
          <ArrowRight aria-hidden className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}
