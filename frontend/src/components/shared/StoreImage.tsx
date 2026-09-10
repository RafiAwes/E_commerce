import Image, { type ImageProps } from "next/image";

/**
 * The store's image element.
 *
 * Vector art gains nothing from the image optimizer — an SVG is already
 * resolution-independent, so `/_next/image` can only proxy it. Routing them
 * through it anyway costs a server round-trip per image and emits a `srcset`
 * with eight pointless candidates, which is a large share of the HTML on a
 * page that renders sixty of them.
 *
 * So: vector sources are served straight from `/public` with immutable
 * caching, and everything else keeps the full optimizer pipeline. When the
 * placeholder plates are replaced by real photography this stops applying on
 * its own, with no code change.
 */
export function StoreImage({ src, alt, unoptimized, ...props }: ImageProps) {
  const isVector = typeof src === "string" && src.endsWith(".svg");
  // `alt` is threaded explicitly rather than through the spread so the
  // jsx-a11y rule can see it; ImageProps makes it required at every call site.
  return <Image src={src} alt={alt} unoptimized={unoptimized ?? isVector} {...props} />;
}
