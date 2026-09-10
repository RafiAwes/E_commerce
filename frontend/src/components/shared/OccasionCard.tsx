import type { Occasion } from "@/types/common";
import { TileCard } from "./TileCard";

/** Domain wrapper: maps an Occasion onto the shared tile. */
export function OccasionCard({ occasion, sizes }: { occasion: Occasion; sizes?: string }) {
  return (
    <TileCard
      href={`/occasions/${occasion.slug}`}
      title={occasion.name}
      subtitle={occasion.tagline}
      image={occasion.image}
      imageAlt={`${occasion.name} gifts`}
      sizes={sizes}
    />
  );
}
