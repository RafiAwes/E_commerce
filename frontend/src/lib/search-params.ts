/**
 * Generic helpers for reading and writing URL search params.
 *
 * Feature-specific parsing (the catalogue filters) builds on top of these in
 * `features/catalog/lib/search-params.ts`.
 */

/** Next.js hands page components a widened search-params shape. */
export type RawSearchParams = Record<string, string | string[] | undefined>;

export function readString(params: RawSearchParams, key: string): string | undefined {
  const value = params[key];
  if (Array.isArray(value)) return value[0];
  return value;
}

/** Accepts both repeated keys (`?c=a&c=b`) and comma lists (`?c=a,b`). */
export function readList(params: RawSearchParams, key: string): string[] {
  const value = params[key];
  if (value === undefined) return [];
  const parts = Array.isArray(value) ? value : [value];
  return parts
    .flatMap((part) => part.split(","))
    .map((part) => part.trim())
    .filter(Boolean);
}

export function readNumber(params: RawSearchParams, key: string): number | undefined {
  const value = readString(params, key);
  if (value === undefined) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function readBoolean(params: RawSearchParams, key: string): boolean {
  return readString(params, key) === "true";
}

/** Only truthy, non-empty entries reach the URL, keeping links short. */
export function buildSearchParams(entries: Record<string, string | string[] | number | boolean | null | undefined>): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(entries)) {
    if (value === null || value === undefined || value === false || value === "") continue;
    if (Array.isArray(value)) {
      if (value.length > 0) params.set(key, value.join(","));
      continue;
    }
    params.set(key, String(value));
  }
  return params;
}

/** Appends a query string to a pathname, omitting the `?` when empty. */
export function withQuery(pathname: string, params: URLSearchParams): string {
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}
