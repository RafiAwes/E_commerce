import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { AppProviders } from "@/providers/AppProviders";
import { catalogService } from "@/services/catalog.service";
import { SITE } from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.legalName }],
  keywords: ["gifts", "ornaments", "personalized gifts", "gift sets", "home decor", "Dhaka", "Bangladesh"],
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: SITE.locale,
    url: SITE.url,
  },
};

export const viewport: Viewport = {
  themeColor: "#faf7f2",
  colorScheme: "light",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Resolved once, on the server, and handed to the search overlay.
  const searchIndex = await catalogService.getSearchIndex();

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-dvh antialiased">
        {/*
          Marks the document as script-enabled before any content is parsed.
          Scroll-reveal styles hang off this class, so a visitor without
          JavaScript sees every section rather than a blank page.
        */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-200 focus:rounded-button focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:text-background"
        >
          Skip to content
        </a>
        <AppProviders searchIndex={searchIndex}>{children}</AppProviders>
      </body>
    </html>
  );
}
