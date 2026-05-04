import type { EsgGrade, Industry, Region, RiskLevel, Tier } from '@/types';

export const INDUSTRIES: readonly Industry[] = [
  'Manufacturing', 'Apparel', 'Electronics', 'Agriculture', 'Logistics', 'Chemicals',
] as const;

export const REGIONS: readonly Region[] = [
  'Southeast Asia', 'East Asia', 'Europe', 'North America', 'South America', 'Africa',
] as const;

export const TIERS: readonly Tier[] = ['Tier 1', 'Tier 2', 'Tier 3'] as const;

export const RISK_LEVELS: readonly RiskLevel[] = ['Low', 'Medium', 'High', 'Critical'] as const;

export const GRADES: readonly EsgGrade[] = [
  'AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'CCC', 'D',
] as const;

// UI constants
export const PAGE_SIZE = 20;
export const SKELETON_ROWS = 8;
export const SEARCH_DEBOUNCE_MS = 250;
export const COUNTUP_DURATION_MS = 700;
export const TOAST_DURATION_MS = 4000;
