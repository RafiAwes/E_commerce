import { normalizeText } from "@/lib/utils";

/**
 * A deliberately tiny projection of the catalogue for client-side
 * autocomplete. Shipping thirty of these costs a few kilobytes, where
 * shipping thirty full products would not.
 */
export interface SearchIndexItem {
  readonly slug: string;
  readonly name: string;
  readonly categoryLabel: string;
  readonly price: number;
  readonly image: string;
  /** Pre-normalised haystack: name, tags, occasions, recipients. */
  readonly keywords: string;
}

export function searchIndex(items: readonly SearchIndexItem[], rawTerm: string, limit = 6): SearchIndexItem[] {
  const term = normalizeText(rawTerm);
  if (term.length < 2) return [];

  const terms = term.split(" ").filter(Boolean);

  return items
    .map((item) => {
      const name = normalizeText(item.name);
      let score = 0;
      for (const part of terms) {
        if (name.startsWith(part)) score += 50;
        else if (name.includes(part)) score += 30;
        else if (item.keywords.includes(part)) score += 12;
        else return { item, score: 0 };
      }
      return { item, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.item);
}
