import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Personal and transactional routes carry no SEO value.
      disallow: ["/cart", "/checkout", "/wishlist"],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
