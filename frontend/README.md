# Aurelia — premium gift & ornament storefront

A complete, frontend-only ecommerce prototype for a boutique gift store. The
data is prototype-level; the architecture, component design, accessibility and
performance work are production-level, so the same codebase can be pointed at a
real backend without rewriting the UI.

Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript (strict)**,
**Tailwind CSS v4** and **lucide-react**. No state-management library, no UI kit.

---

## Getting started

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (includes the React Compiler rules) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run placeholders` | Regenerate the placeholder artwork in `public/images` |

Copy `.env.example` to `.env.local` if you want metadata and the sitemap to use
a non-default origin.

---

## Routes

| Route | Rendering | Notes |
| --- | --- | --- |
| `/` | Static | Homepage — hero through newsletter |
| `/shop` | Dynamic | URL-driven filtering, sorting and search |
| `/products/[slug]` | SSG (30 pages) | Gallery, options, personalization, tabs, reviews, related |
| `/collections` | Static | Collection index |
| `/collections/[slug]` | SSG (5 pages) | Editorial edit: hero, featured, full grid, related |
| `/occasions` | Static | Occasion index |
| `/occasions/[slug]` | Dynamic | Full catalogue architecture, occasion locked in |
| `/wishlist` | Static shell | Saved items resolved client-side |
| `/cart` | Static shell | Bag, gift wrapping, promo code, totals |
| `/checkout` | Static shell | Contact, address, delivery, payment, gift options |
| `/checkout/success` | Dynamic | Order confirmation, read back by reference |
| `/sitemap.xml`, `/robots.txt` | Static | Generated from the catalogue |

Plus `not-found`, `error` and per-route `loading` skeletons.

---

## Architecture

```
app          route composition and metadata only
  ↓
features     feature UI + feature-specific logic
  ↓
services     application-facing data access
  ↓
repositories interface + implementation (mock today, API later)
  ↓
data         the mock catalogue
```

`components/ui` and `components/shared` sit outside this chain: they are
generic and never import a feature, a service or the data layer. This is
enforced by convention and is easy to verify:

```bash
grep -rn "@/features\|@/services\|@/repositories\|@/data" src/components/ui/   # no matches
grep -rn "@/repositories\|@/data" src/features/ src/app/                        # no matches
```

### Where things live

| Path | Responsibility |
| --- | --- |
| `src/types/common.ts` | Domain model — `Product`, `Collection`, `CartItem`, `Order`, … |
| `src/data/` | The 30-product mock catalogue, taxonomies, reviews |
| `src/repositories/` | `ProductRepository` etc. + their mock implementations |
| `src/repositories/index.ts` | **Composition root** — the only file naming a concrete repository |
| `src/services/` | `catalogService`, `productService`, `collectionService`, `orderService`, `newsletterService` |
| `src/lib/catalog/` | Pure catalogue algorithms: search, filter, sort, facet counts |
| `src/features/*/lib/` | Feature logic: cart totals, gift recommendations, URL parsing |
| `src/features/*/components/` | Feature UI |
| `src/providers/` | Cart, wishlist, search and toast context |
| `src/components/ui/` | Design-system primitives |
| `src/components/shared/` | Reusable commerce presentation (`Price`, `Rating`, `TileCard`, …) |
| `src/components/layout/` | Header, mega menu, footer, mobile and bottom navigation |
| `src/components/home/` | Homepage sections (presentational; the page fetches their data) |

### Server first

Every page is a Server Component. Interactivity is isolated into small client
islands — the wishlist heart, quick add, the filter controls, the cart drawer,
the gallery, the purchase panel, the gift finder. A thirty-product grid ships
almost no JavaScript, and client islands receive narrowed props
(`CartProductRef`, `WishlistProductRef`, `SearchIndexItem`) rather than whole
product objects so the RSC payload stays small.

### URL-driven catalogue

Filters, sorting and search live entirely in search params — there is no global
filter store. `parseCatalogSearchParams` validates the URL into a typed
`CatalogSearchState`; `createCatalogSearchParams` turns state back into the
shortest URL that reproduces it. That gives shareable links, working
back/forward navigation, refresh-safe state, and server rendering for free.

```
/shop?occasion=birthday&recipient=her&price=1000-2000&sort=price-asc
```

### Business logic outside JSX

These are all pure, independently testable functions:

`filterProducts` · `sortProducts` · `searchProducts` · `applyProductQuery` ·
`buildCatalogFacets` · `parseCatalogSearchParams` · `createCatalogSearchParams` ·
`calculateCartTotals` · `calculateShipping` · `recommendProducts` ·
`validateCheckout` · `validatePersonalization` · `resolveUnitPrice`

### Client state

`CartProvider` and `WishlistProvider` are deliberately separate. Both read
localStorage through `useSyncExternalStore` (via `lib/persistent-store.ts`)
rather than setting state inside an effect — the server snapshot is always the
empty fallback, so server HTML and the first client render agree and there is
no hydration mismatch. It also gives cross-tab synchronisation for free.

Providers own *state and persistence only*; every calculation lives in
`features/cart/lib/cart.ts`.

---

## Swapping the mock data for a real API

The prototype is structured for a Django REST Framework or FastAPI backend
exposing `GET /products`, `GET /products/:slug`, `GET /collections`,
`GET /occasions`, `GET /categories`, `GET /search`, `POST /newsletter` and
`POST /orders`.

1. Write `ApiProductRepository implements ProductRepository` (and the catalog,
   collection and order equivalents) that fetch and map responses into the
   domain types in `src/types/common.ts`.
2. Point `src/repositories/index.ts` at the new classes.

That is the whole migration. Services, features, pages and every UI component
keep working unchanged, because they were written against the interfaces and
the domain model rather than the data source. `ProductQuery` already mirrors the
shape of a real query string, so a backend that filters server-side is a direct
mapping.

Cart persistence follows the same pattern: replace the store in
`CartProvider` with API calls and the pure cart logic and every cart component
stay as they are.

---

## Design system

Tokens live in `src/app/globals.css` under `@theme` — colours, type scale,
radii, shadows, breakpoints and motion. Components consume semantic tokens
(`bg-secondary`, `text-muted`, `rounded-card`), never raw hex values.

- **Display / headings** — Playfair Display
- **Body / UI** — Inter
- **Breakpoints** — mobile 320+, `md` 768 (tablet), `xl` 1200 (desktop), `2xl` 1440 (wide)
- **Product grid** — 2 columns on mobile, 3 on tablet, 4 on desktop

Motion is intentional and short, and every animation is disabled under
`prefers-reduced-motion`.

---

## Accessibility

Semantic landmarks and heading order, a skip link, visible focus rings on a
`:focus-visible` basis, real `<button>` and `<input>` elements everywhere,
labelled icon-only controls, WAI-ARIA tabs with roving focus, dialogs and
drawers with focus trapping, Escape handling and scroll locking, live regions
for toasts and result counts, and decorative imagery marked `aria-hidden` with
the accessible name carried by adjacent text.

---

## Placeholder imagery

`public/images` ships art-directed SVG plates generated by
`scripts/generate-placeholders.mjs`, so the prototype is self-contained and
visually cohesive rather than pulling mismatched stock photography.

To use real photography: drop files into `public/images` (or a CDN registered
in `next.config.ts` under `images.remotePatterns`) and update the URLs in
`src/data`. Product image paths are centralised in `src/data/products.ts` — no
component hardcodes an image URL. Once no SVGs remain you can also remove
`dangerouslyAllowSVG` from `next.config.ts`.

---

## Prototype limitations

By design there is no real payment, authentication, account, database,
inventory sync or email delivery. Orders are simulated by
`MockOrderRepository` and stored in the browser so the confirmation page can be
refreshed. Promotion codes (`AURELIA10`, `MOMENTS15`) are simulated. Everything
that a backend would own sits behind a service so it can be replaced rather
than rewritten.
