import type { Collection, Occasion, ProductCategory } from "@/types/common";

export interface NavLink {
  readonly label: string;
  readonly href: string;
  /** Opens the Shop mega menu rather than navigating on hover. */
  readonly hasMegaMenu?: boolean;
}

export interface NavCollection {
  readonly label: string;
  readonly href: string;
  readonly image: string;
  readonly tagline: string;
}

export interface MegaMenuData {
  readonly categories: readonly NavLink[];
  readonly occasions: readonly NavLink[];
  readonly collections: readonly NavCollection[];
}

export interface NavData {
  readonly primary: readonly NavLink[];
  readonly mega: MegaMenuData;
}

export const PRIMARY_NAV: readonly NavLink[] = [
  { label: "Shop", href: "/shop", hasMegaMenu: true },
  { label: "Find a Gift", href: "/#gift-finder" },
  { label: "Collections", href: "/collections" },
  { label: "Occasions", href: "/occasions" },
  { label: "New Arrivals", href: "/shop?sort=newest" },
];

/**
 * Builds navigation from live taxonomy so the menu can never drift from the
 * catalogue. Called once, on the server, inside the header.
 */
export function buildNavData(
  categories: readonly ProductCategory[],
  occasions: readonly Occasion[],
  collections: readonly Collection[],
): NavData {
  return {
    primary: PRIMARY_NAV,
    mega: {
      categories: categories.map((category) => ({
        label: category.name,
        href: `/shop?category=${category.slug}`,
      })),
      occasions: occasions.map((occasion) => ({
        label: occasion.name,
        href: `/occasions/${occasion.slug}`,
      })),
      collections: collections.slice(0, 3).map((collection) => ({
        label: collection.name,
        href: `/collections/${collection.slug}`,
        image: collection.heroImage,
        tagline: collection.tagline,
      })),
    },
  };
}
