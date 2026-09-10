import type { Occasion } from "@/types/common";

export const occasions: readonly Occasion[] = [
  {
    id: "birthday",
    slug: "birthday",
    name: "Birthday",
    tagline: "Make the day feel like an occasion.",
    description:
      "Gifts with a little celebration built in — candles worth lighting, boxes worth keeping and ornaments that stay long after the cake is gone.",
    image: "/images/occasions/birthday.svg",
    accent: "gold",
  },
  {
    id: "anniversary",
    slug: "anniversary",
    name: "Anniversary",
    tagline: "For the years, and the ones ahead.",
    description:
      "Considered pieces for a shared history — engraved keepsakes, paired ornaments and quiet luxuries for two.",
    image: "/images/occasions/anniversary.svg",
    accent: "rose",
  },
  {
    id: "wedding",
    slug: "wedding",
    name: "Wedding",
    tagline: "A gift for the beginning of everything.",
    description:
      "Heirloom-minded gifts for the couple and their first home together, wrapped and ready to give at the reception table.",
    image: "/images/occasions/wedding.svg",
    accent: "gold",
  },
  {
    id: "valentines",
    slug: "valentines",
    name: "Valentine's",
    tagline: "Romance, without the cliché.",
    description:
      "Softly romantic gifts — blush candles, keepsake hearts and personalized pieces that say more than a card can.",
    image: "/images/occasions/valentines.svg",
    accent: "burgundy",
  },
  {
    id: "eid",
    slug: "eid",
    name: "Eid",
    tagline: "Give generously, beautifully.",
    description:
      "Hampers and ornaments made for family gatherings, gifted across generations and always beautifully wrapped.",
    image: "/images/occasions/eid.svg",
    accent: "sage",
  },
  {
    id: "christmas",
    slug: "christmas",
    name: "Christmas",
    tagline: "Ornaments worth unpacking every year.",
    description:
      "Hand-finished ornaments, scented candles and gift boxes that make the season feel considered rather than rushed.",
    image: "/images/occasions/christmas.svg",
    accent: "sage",
  },
  {
    id: "new-home",
    slug: "new-home",
    name: "New Home",
    tagline: "Something lovely for the first shelf.",
    description:
      "Housewarming gifts with staying power — porcelain, brass and scent for a home that is only just starting.",
    image: "/images/occasions/new-home.svg",
    accent: "sage",
  },
  {
    id: "thank-you",
    slug: "thank-you",
    name: "Thank You",
    tagline: "Gratitude, properly expressed.",
    description:
      "Elegant, easy-to-send gifts for the people who showed up — colleagues, hosts, friends and the ones who quietly helped.",
    image: "/images/occasions/thank-you.svg",
    accent: "rose",
  },
  {
    id: "just-because",
    slug: "just-because",
    name: "Just Because",
    tagline: "No occasion required.",
    description:
      "The unprompted gift. Small, warm and often the one people remember longest.",
    image: "/images/occasions/just-because.svg",
    accent: "gold",
  },
];
