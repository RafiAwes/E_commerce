import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Local placeholder art ships in /public/images. When real product
    // photography lands, only the URLs inside src/data change — add the CDN
    // host here and everything else keeps working.
    formats: ["image/avif", "image/webp"],
    // The shipped placeholder artwork is first-party SVG. Serving it through
    // next/image needs this flag; the CSP below keeps the SVGs inert.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    deviceSizes: [360, 480, 640, 768, 1024, 1200, 1440, 1920],
    imageSizes: [96, 128, 192, 256, 320, 384],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
  typedRoutes: false,
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
