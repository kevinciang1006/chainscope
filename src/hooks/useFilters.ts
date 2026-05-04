import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { GRADES, INDUSTRIES, REGIONS, RISK_LEVELS, TIERS } from '@/lib/constants';
import type { EsgGrade, Industry, Region, RiskLevel, SupplierFilters, Tier } from '@/types';

const KEYS = {
  search: 'q',
  industries: 'ind',
  regions: 'reg',
  tiers: 'tier',
  riskLevels: 'risk',
  ratings: 'rate',
} as const;

function parseList<T extends string>(raw: string | null, allowed: readonly T[]): T[] | undefined {
  if (!raw) return undefined;
  const parts = raw.split(',').map((s) => s.trim()).filter(Boolean);
  const valid = parts.filter((p): p is T => (allowed as readonly string[]).includes(p));
  return valid.length ? valid : undefined;
}

function encodeList<T extends string>(values?: readonly T[]): string | undefined {
  return values && values.length ? values.join(',') : undefined;
}

export interface UseFiltersResult {
  filters: SupplierFilters;
  setFilters: (next: SupplierFilters) => void;
  patchFilters: (patch: Partial<SupplierFilters>) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

export function useFilters(): UseFiltersResult {
  const [params, setParams] = useSearchParams();

  const filters = useMemo<SupplierFilters>(() => ({
    search: params.get(KEYS.search) ?? undefined,
    industries: parseList<Industry>(params.get(KEYS.industries), INDUSTRIES),
    regions: parseList<Region>(params.get(KEYS.regions), REGIONS),
    tiers: parseList<Tier>(params.get(KEYS.tiers), TIERS),
    riskLevels: parseList<RiskLevel>(params.get(KEYS.riskLevels), RISK_LEVELS),
    ratings: parseList<EsgGrade>(params.get(KEYS.ratings), GRADES),
  }), [params]);

  const writeFilters = useCallback(
    (next: SupplierFilters) => {
      const sp = new URLSearchParams();
      if (next.search) sp.set(KEYS.search, next.search);
      const ind = encodeList(next.industries); if (ind) sp.set(KEYS.industries, ind);
      const reg = encodeList(next.regions);    if (reg) sp.set(KEYS.regions, reg);
      const tier = encodeList(next.tiers);     if (tier) sp.set(KEYS.tiers, tier);
      const risk = encodeList(next.riskLevels); if (risk) sp.set(KEYS.riskLevels, risk);
      const rate = encodeList(next.ratings);   if (rate) sp.set(KEYS.ratings, rate);
      setParams(sp, { replace: true });
    },
    [setParams]
  );

  const setFilters = useCallback((next: SupplierFilters) => writeFilters(next), [writeFilters]);

  const patchFilters = useCallback(
    (patch: Partial<SupplierFilters>) => writeFilters({ ...filters, ...patch }),
    [filters, writeFilters]
  );

  const clearFilters = useCallback(() => {
    setParams(new URLSearchParams(), { replace: true });
  }, [setParams]);

  const hasActiveFilters = Boolean(
    filters.search ||
    filters.industries?.length ||
    filters.regions?.length ||
    filters.tiers?.length ||
    filters.riskLevels?.length ||
    filters.ratings?.length
  );

  return { filters, setFilters, patchFilters, clearFilters, hasActiveFilters };
}
