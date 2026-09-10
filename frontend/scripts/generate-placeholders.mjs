/**
 * Generates the placeholder artwork that ships with the prototype.
 *
 * The store is deliberately self-contained: rather than pulling random stock
 * photography, we render on-brand SVG plates so the catalogue reads as one
 * art-directed boutique. When real photography arrives, delete this script,
 * drop the files into /public/images (or point at a CDN host registered in
 * next.config.ts) and update the URLs in src/data — nothing else changes.
 *
 * Run with:  node scripts/generate-placeholders.mjs
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "images");

/* ------------------------------------------------------------------ */
/* Palette — mirrors the design tokens in src/app/globals.css          */
/* ------------------------------------------------------------------ */

const TONES = {
  gold: { base: "#f4ead6", deep: "#e2cda1", ink: "#8d7038", accent: "#b99a62" },
  rose: { base: "#f9ece9", deep: "#eecfcb", ink: "#a3696a", accent: "#d8a9a5" },
  sage: { base: "#edf1e9", deep: "#cfd8c7", ink: "#6c7b62", accent: "#aab5a0" },
  burgundy: { base: "#f3e7e6", deep: "#dcc3c3", ink: "#713f46", accent: "#8f5860" },
  linen: { base: "#f7f2ea", deep: "#e8ddcd", ink: "#7a6b57", accent: "#b99a62" },
};

const TONE_KEYS = Object.keys(TONES);

/* ------------------------------------------------------------------ */
/* Motifs — fine line drawings inside a 0 0 200 200 box                */
/* ------------------------------------------------------------------ */

const motifs = {
  box: (c) => `
    <rect x="42" y="82" width="116" height="80" rx="10" fill="${c.base}" stroke="${c.ink}" stroke-width="2.4"/>
    <rect x="32" y="62" width="136" height="30" rx="8" fill="${c.deep}" stroke="${c.ink}" stroke-width="2.4"/>
    <path d="M100 62v100" stroke="${c.accent}" stroke-width="7" stroke-linecap="round"/>
    <path d="M100 62C82 46 62 42 60 54c-2 11 20 12 40 8" fill="none" stroke="${c.accent}" stroke-width="3.4" stroke-linecap="round"/>
    <path d="M100 62c18-16 38-20 40-8 2 11-20 12-40 8" fill="none" stroke="${c.accent}" stroke-width="3.4" stroke-linecap="round"/>
    <circle cx="100" cy="62" r="5" fill="${c.accent}"/>`,
  ornament: (c) => `
    <path d="M100 18v20" stroke="${c.ink}" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M88 22a12 12 0 0 1 24 0" fill="none" stroke="${c.ink}" stroke-width="2.2"/>
    <rect x="90" y="38" width="20" height="14" rx="4" fill="${c.deep}" stroke="${c.ink}" stroke-width="2.2"/>
    <circle cx="100" cy="112" r="58" fill="${c.base}" stroke="${c.ink}" stroke-width="2.4"/>
    <path d="M46 96c34 16 74 16 108 0" fill="none" stroke="${c.accent}" stroke-width="2.6"/>
    <path d="M46 128c34-16 74-16 108 0" fill="none" stroke="${c.accent}" stroke-width="2.6"/>
    <circle cx="100" cy="112" r="20" fill="none" stroke="${c.accent}" stroke-width="2.6"/>
    <circle cx="80" cy="94" r="3.4" fill="${c.accent}"/>`,
  plaque: (c) => `
    <rect x="30" y="52" width="140" height="104" rx="14" fill="${c.base}" stroke="${c.ink}" stroke-width="2.4"/>
    <rect x="42" y="64" width="116" height="80" rx="8" fill="none" stroke="${c.accent}" stroke-width="1.8"/>
    <path d="M62 96c10-14 22-14 30 0s20 14 30 0 22-14 16 4" fill="none" stroke="${c.ink}" stroke-width="3" stroke-linecap="round"/>
    <path d="M66 118h68" stroke="${c.accent}" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M80 130h40" stroke="${c.accent}" stroke-width="2.4" stroke-linecap="round"/>
    <circle cx="100" cy="42" r="6" fill="none" stroke="${c.ink}" stroke-width="2.2"/>`,
  vase: (c) => `
    <path d="M78 96c-8 20-10 40 0 56 8 12 36 12 44 0 10-16 8-36 0-56-6-14-38-14-44 0Z" fill="${c.base}" stroke="${c.ink}" stroke-width="2.4"/>
    <path d="M78 96h44" stroke="${c.ink}" stroke-width="2.2"/>
    <path d="M100 96V44" stroke="${c.accent}" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M100 62c-16-6-24-18-22-28 12-2 22 8 22 20" fill="${c.deep}" stroke="${c.ink}" stroke-width="2"/>
    <path d="M100 52c14-8 24-6 28 2-8 10-20 12-28 6" fill="${c.deep}" stroke="${c.ink}" stroke-width="2"/>
    <circle cx="100" cy="38" r="8" fill="${c.accent}"/>`,
  candle: (c) => `
    <rect x="66" y="86" width="68" height="80" rx="12" fill="${c.base}" stroke="${c.ink}" stroke-width="2.4"/>
    <path d="M66 104h68" stroke="${c.accent}" stroke-width="2"/>
    <path d="M84 138h32" stroke="${c.accent}" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M100 86V72" stroke="${c.ink}" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M100 34c14 16 20 26 20 36a20 20 0 0 1-40 0c0-10 6-20 20-36Z" fill="${c.deep}" stroke="${c.ink}" stroke-width="2.2"/>
    <path d="M100 52c6 8 8 13 8 18a8 8 0 0 1-16 0c0-5 2-10 8-18Z" fill="${c.accent}"/>`,
  heart: (c) => `
    <path d="M100 162c-44-28-62-52-62-76a34 34 0 0 1 62-19 34 34 0 0 1 62 19c0 24-18 48-62 76Z" fill="${c.base}" stroke="${c.ink}" stroke-width="2.4"/>
    <path d="M100 140c-30-20-44-38-44-54a22 22 0 0 1 44-8 22 22 0 0 1 44 8c0 16-14 34-44 54Z" fill="none" stroke="${c.accent}" stroke-width="2"/>
    <circle cx="76" cy="76" r="4" fill="${c.accent}"/>`,
  pendant: (c) => `
    <path d="M44 46c14 34 34 52 56 52s42-18 56-52" fill="none" stroke="${c.ink}" stroke-width="2.2"/>
    <circle cx="100" cy="126" r="34" fill="${c.base}" stroke="${c.ink}" stroke-width="2.4"/>
    <circle cx="100" cy="126" r="18" fill="none" stroke="${c.accent}" stroke-width="2.2"/>
    <rect x="92" y="88" width="16" height="14" rx="5" fill="${c.deep}" stroke="${c.ink}" stroke-width="2"/>
    <circle cx="100" cy="126" r="5" fill="${c.accent}"/>`,
  basket: (c) => `
    <path d="M46 104h108l-12 62H58Z" fill="${c.base}" stroke="${c.ink}" stroke-width="2.4"/>
    <path d="M58 124h84M56 144h88" stroke="${c.accent}" stroke-width="1.8"/>
    <path d="M64 104c0-24 16-38 36-38s36 14 36 38" fill="none" stroke="${c.ink}" stroke-width="2.2"/>
    <circle cx="80" cy="88" r="13" fill="${c.deep}" stroke="${c.ink}" stroke-width="2"/>
    <circle cx="112" cy="80" r="16" fill="${c.deep}" stroke="${c.ink}" stroke-width="2"/>
    <circle cx="80" cy="88" r="4" fill="${c.accent}"/>
    <circle cx="112" cy="80" r="5" fill="${c.accent}"/>`,
  wreath: (c) => `
    <circle cx="100" cy="104" r="58" fill="none" stroke="${c.ink}" stroke-width="2.4"/>
    <circle cx="100" cy="104" r="44" fill="none" stroke="${c.accent}" stroke-width="1.8"/>
    <circle cx="100" cy="46" r="9" fill="${c.deep}" stroke="${c.ink}" stroke-width="2"/>
    <circle cx="158" cy="104" r="7" fill="${c.deep}" stroke="${c.ink}" stroke-width="2"/>
    <circle cx="100" cy="162" r="7" fill="${c.deep}" stroke="${c.ink}" stroke-width="2"/>
    <circle cx="42" cy="104" r="7" fill="${c.deep}" stroke="${c.ink}" stroke-width="2"/>
    <circle cx="100" cy="104" r="10" fill="${c.accent}"/>`,
};

const MOTIF_KEYS = Object.keys(motifs);

/* ------------------------------------------------------------------ */
/* Plate renderer                                                      */
/* ------------------------------------------------------------------ */

function hash(value) {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) h = (h * 31 + value.charCodeAt(i)) % 1000003;
  return h;
}

function plate({ width, height, tone, motif, seed, scale = 1 }) {
  const c = TONES[tone] ?? TONES.linen;
  const h = hash(seed);
  const haloX = 30 + (h % 40);
  const haloY = 26 + ((h >> 3) % 30);
  const rotate = ((h >> 5) % 9) - 4;
  const motifSize = Math.min(width, height) * 0.62 * scale;
  const motifX = (width - motifSize) / 2;
  const motifY = (height - motifSize) / 2;
  const dotOpacity = 0.06;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img">
  <defs>
    <linearGradient id="ground" x1="0" y1="0" x2="0.6" y2="1">
      <stop offset="0" stop-color="${c.base}"/>
      <stop offset="1" stop-color="${c.deep}"/>
    </linearGradient>
    <radialGradient id="halo" cx="${haloX}%" cy="${haloY}%" r="62%">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.9"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grain" width="18" height="18" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1" fill="${c.ink}" opacity="${dotOpacity}"/>
      <circle cx="11" cy="10" r="1" fill="${c.ink}" opacity="${dotOpacity}"/>
    </pattern>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#ground)"/>
  <rect width="${width}" height="${height}" fill="url(#grain)"/>
  <rect width="${width}" height="${height}" fill="url(#halo)"/>
  <circle cx="${width * 0.5}" cy="${height * 0.5}" r="${motifSize * 0.62}" fill="#ffffff" opacity="0.42"/>
  <circle cx="${width * 0.5}" cy="${height * 0.5}" r="${motifSize * 0.68}" fill="none" stroke="${c.accent}" stroke-width="1" opacity="0.5"/>
  <g transform="translate(${motifX} ${motifY}) scale(${motifSize / 200}) rotate(${rotate} 100 100)">
    ${motifs[motif](c)}
  </g>
</svg>`;
}

async function emit(relPath, svg) {
  const target = join(OUT, relPath);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, `${svg}\n`, "utf8");
}

/* ------------------------------------------------------------------ */
/* Catalogue manifest — mirrors the slugs in src/data/products.ts      */
/* ------------------------------------------------------------------ */

const PRODUCTS = [
  ["elegant-rose-gift-box", "box", "rose"],
  ["personalized-couple-ornament", "ornament", "gold"],
  ["luxury-mini-gift-set", "box", "gold"],
  ["handmade-decorative-candle", "candle", "linen"],
  ["heart-keepsake-box", "heart", "rose"],
  ["floral-gift-basket", "basket", "sage"],
  ["personalized-name-ornament", "ornament", "linen"],
  ["cozy-home-gift-box", "box", "sage"],
  ["ceramic-couple-figurine", "heart", "linen"],
  ["custom-photo-frame", "plaque", "gold"],
  ["romantic-candle-set", "candle", "rose"],
  ["mini-celebration-box", "box", "burgundy"],
  ["decorative-moon-ornament", "ornament", "burgundy"],
  ["personalized-wooden-plaque", "plaque", "linen"],
  ["luxury-self-care-gift-set", "box", "sage"],
  ["gilded-star-ornament", "ornament", "gold"],
  ["amber-oud-candle", "candle", "burgundy"],
  ["porcelain-bud-vase", "vase", "linen"],
  ["everlasting-rose-dome", "vase", "rose"],
  ["engraved-keepsake-locket", "pendant", "gold"],
  ["marble-brass-coaster-set", "plaque", "sage"],
  ["silk-scarf-gift-box", "box", "rose"],
  ["hand-poured-soy-trio", "candle", "sage"],
  ["artisan-chocolate-hamper", "basket", "burgundy"],
  ["first-home-keepsake-set", "heart", "sage"],
  ["eid-celebration-hamper", "basket", "gold"],
  ["crystal-snow-globe", "ornament", "sage"],
  ["personalized-star-map", "plaque", "burgundy"],
  ["brass-tealight-lantern", "candle", "gold"],
  ["thank-you-blooms-box", "basket", "rose"],
];

const OCCASIONS = [
  ["birthday", "box", "gold"],
  ["anniversary", "heart", "rose"],
  ["wedding", "wreath", "linen"],
  ["valentines", "heart", "burgundy"],
  ["eid", "ornament", "sage"],
  ["christmas", "wreath", "sage"],
  ["new-home", "vase", "linen"],
  ["thank-you", "basket", "rose"],
  ["just-because", "candle", "gold"],
];

const RECIPIENTS = [
  ["her", "pendant", "rose"],
  ["him", "plaque", "linen"],
  ["couples", "heart", "burgundy"],
  ["parents", "vase", "sage"],
  ["friends", "basket", "gold"],
  ["kids", "ornament", "sage"],
  ["colleagues", "box", "linen"],
];

const CATEGORIES = [
  ["gift-sets", "box", "gold"],
  ["ornaments", "ornament", "burgundy"],
  ["personalized", "plaque", "linen"],
  ["home-decor", "vase", "sage"],
  ["candles", "candle", "rose"],
  ["keepsakes", "heart", "rose"],
  ["accessories", "pendant", "gold"],
  ["hampers", "basket", "sage"],
];

const COLLECTIONS = [
  ["the-celebration-collection", "wreath", "gold"],
  ["quiet-luxury-home", "vase", "linen"],
  ["forever-keepsakes", "heart", "rose"],
  ["the-signature-hamper-edit", "basket", "burgundy"],
  ["candlelight-and-scent", "candle", "sage"],
];

const EDITORIAL = [
  ["hero-primary", "box", "rose", 1200, 1500],
  ["hero-secondary", "ornament", "gold", 900, 900],
  ["hero-tertiary", "candle", "sage", 900, 700],
  ["featured-collection", "wreath", "gold", 1600, 1100],
  ["personalized", "plaque", "linen", 1200, 1000],
  ["gift-wrapping", "box", "burgundy", 1000, 900],
  ["gift-message", "plaque", "rose", 1000, 900],
  ["gift-finder", "basket", "sage", 1000, 1100],
  ["about-atelier", "vase", "linen", 1400, 900],
];

/* ------------------------------------------------------------------ */

async function main() {
  const tasks = [];

  for (const [slug, motif, tone] of PRODUCTS) {
    // Three plates per product: primary, hover angle, and a detail crop.
    tasks.push(emit(`products/${slug}-1.svg`, plate({ width: 1000, height: 1250, tone, motif, seed: `${slug}-1` })));
    const altTone = TONE_KEYS[(hash(slug) + 2) % TONE_KEYS.length];
    tasks.push(
      emit(`products/${slug}-2.svg`, plate({ width: 1000, height: 1250, tone: altTone, motif, seed: `${slug}-2`, scale: 0.82 })),
    );
    const detailMotif = MOTIF_KEYS[(hash(slug) + 4) % MOTIF_KEYS.length];
    tasks.push(
      emit(
        `products/${slug}-3.svg`,
        plate({ width: 1000, height: 1250, tone, motif: detailMotif, seed: `${slug}-3`, scale: 1.14 }),
      ),
    );
  }

  for (const [slug, motif, tone] of OCCASIONS) {
    tasks.push(emit(`occasions/${slug}.svg`, plate({ width: 800, height: 1000, tone, motif, seed: `occasion-${slug}` })));
  }
  for (const [slug, motif, tone] of RECIPIENTS) {
    tasks.push(emit(`recipients/${slug}.svg`, plate({ width: 800, height: 1000, tone, motif, seed: `recipient-${slug}` })));
  }
  for (const [slug, motif, tone] of CATEGORIES) {
    tasks.push(emit(`categories/${slug}.svg`, plate({ width: 800, height: 800, tone, motif, seed: `category-${slug}` })));
  }
  for (const [slug, motif, tone] of COLLECTIONS) {
    tasks.push(emit(`collections/${slug}.svg`, plate({ width: 1600, height: 1000, tone, motif, seed: `collection-${slug}` })));
  }
  for (const [slug, motif, tone, w, h] of EDITORIAL) {
    tasks.push(emit(`editorial/${slug}.svg`, plate({ width: w, height: h, tone, motif, seed: `editorial-${slug}` })));
  }
  for (let i = 1; i <= 8; i += 1) {
    const motif = MOTIF_KEYS[i % MOTIF_KEYS.length];
    const tone = TONE_KEYS[i % TONE_KEYS.length];
    tasks.push(emit(`gallery/moment-${i}.svg`, plate({ width: 900, height: 900, tone, motif, seed: `gallery-${i}` })));
  }

  await Promise.all(tasks);
  console.log(`Generated ${tasks.length} placeholder plates in public/images.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
