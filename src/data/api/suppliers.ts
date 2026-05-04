import type { Supplier, SupplierFilters } from '@/types';

import { suppliersFixture } from '@/data/fixtures/suppliers';

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function applyFilters(
  list: readonly Supplier[],
  filters?: SupplierFilters,
): Supplier[] {
  if (!filters) return [...list];
  const q = filters.search?.trim().toLowerCase();

  return list.filter((s) => {
    if (q) {
      const haystack = `${s.name} ${s.country}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (filters.industries?.length && !filters.industries.includes(s.industry)) return false;
    if (filters.regions?.length && !filters.regions.includes(s.region)) return false;
    if (filters.tiers?.length && !filters.tiers.includes(s.tier)) return false;
    if (filters.riskLevels?.length && !filters.riskLevels.includes(s.riskLevel)) return false;
    if (filters.ratings?.length && !filters.ratings.includes(s.esgRating)) return false;
    return true;
  });
}

export async function fetchSuppliers(filters?: SupplierFilters): Promise<Supplier[]> {
  await sleep(280 + Math.random() * 320);
  return applyFilters(suppliersFixture, filters);
}

export async function fetchSupplierById(id: string): Promise<Supplier> {
  await sleep(220 + Math.random() * 200);
  const found = suppliersFixture.find((s) => s.id === id);
  if (!found) throw new Error(`Supplier ${id} not found`);
  return found;
}
