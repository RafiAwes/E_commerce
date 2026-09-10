import type { BudgetBand } from "../types";

export const BUDGET_BANDS: readonly BudgetBand[] = [
  { id: "under-500", label: "Under ৳500", min: null, max: 500 },
  { id: "500-1000", label: "৳500 – ৳1,000", min: 500, max: 1000 },
  { id: "1000-2500", label: "৳1,000 – ৳2,500", min: 1000, max: 2500 },
  { id: "over-2500", label: "৳2,500+", min: 2500, max: null },
];

export function findBudgetBand(id: string | null): BudgetBand | null {
  if (!id) return null;
  return BUDGET_BANDS.find((band) => band.id === id) ?? null;
}
