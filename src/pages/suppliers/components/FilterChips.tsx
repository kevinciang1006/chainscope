import { useCallback, useState } from 'react';
import { X } from 'lucide-react';

import { useFilters } from '@/hooks/useFilters';
import { cn } from '@/lib/utils';
import type { EsgGrade, Industry, Region, RiskLevel, SupplierFilters, Tier } from '@/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ChipDef {
  id: string;
  label: string;
  remove: () => void;
}

const CHIP_EXIT_MS = 150;

// ---------------------------------------------------------------------------
// FilterChips — exported
// ---------------------------------------------------------------------------

export function FilterChips() {
  const { filters, patchFilters, clearFilters, hasActiveFilters } = useFilters();

  // Track chips currently in their exit animation
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());

  const scheduleRemove = useCallback(
    (id: string, remove: () => void) => {
      setRemovingIds((prev) => new Set([...prev, id]));
      window.setTimeout(() => {
        remove();
        setRemovingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }, CHIP_EXIT_MS);
    },
    [],
  );

  if (!hasActiveFilters) return null;

  // Build the chip list from current filters
  const chips: ChipDef[] = [];

  if (filters.search) {
    chips.push({
      id: 'search',
      label: `Search: ${filters.search}`,
      remove: () => patchFilters({ search: undefined }),
    });
  }

  (filters.industries ?? []).forEach((v: Industry) =>
    chips.push({
      id: `industry-${v}`,
      label: `Industry: ${v}`,
      remove: () => {
        const next = (filters.industries ?? []).filter((x) => x !== v);
        patchFilters({ industries: next.length ? next : undefined });
      },
    }),
  );

  (filters.regions ?? []).forEach((v: Region) =>
    chips.push({
      id: `region-${v}`,
      label: `Region: ${v}`,
      remove: () => {
        const next = (filters.regions ?? []).filter((x) => x !== v);
        patchFilters({ regions: next.length ? next : undefined });
      },
    }),
  );

  (filters.tiers ?? []).forEach((v: Tier) =>
    chips.push({
      id: `tier-${v}`,
      label: `Tier: ${v}`,
      remove: () => {
        const next = (filters.tiers ?? []).filter((x) => x !== v);
        patchFilters({ tiers: next.length ? next : undefined });
      },
    }),
  );

  (filters.riskLevels ?? []).forEach((v: RiskLevel) =>
    chips.push({
      id: `risk-${v}`,
      label: `Risk: ${v}`,
      remove: () => {
        const next = (filters.riskLevels ?? []).filter((x) => x !== v);
        patchFilters({ riskLevels: next.length ? next : undefined } as Partial<SupplierFilters>);
      },
    }),
  );

  (filters.ratings ?? []).forEach((v: EsgGrade) =>
    chips.push({
      id: `rating-${v}`,
      label: `Rating: ${v}`,
      remove: () => {
        const next = (filters.ratings ?? []).filter((x) => x !== v);
        patchFilters({ ratings: next.length ? next : undefined });
      },
    }),
  );

  return (
    <div className="flex flex-wrap items-center gap-2 px-6 py-3 border-b border-border">
      {chips.map((chip) => {
        const isRemoving = removingIds.has(chip.id);
        return (
          <span
            key={chip.id}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full bg-surface-2 border border-border',
              'px-3 py-1 text-xs font-medium text-text-2',
              'animate-slide-up',
              isRemoving && 'opacity-0 scale-95 transition-all duration-150',
            )}
          >
            {chip.label}
            <button
              type="button"
              aria-label={`Remove filter ${chip.label}`}
              onClick={() => scheduleRemove(chip.id, chip.remove)}
              className={cn(
                'rounded-full h-3.5 w-3.5 flex items-center justify-center',
                'text-text-3 hover:text-text-1 hover:bg-border',
                'transition-colors duration-100',
                'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-700',
              )}
            >
              <X className="h-2.5 w-2.5" aria-hidden="true" />
            </button>
          </span>
        );
      })}

      <button
        type="button"
        onClick={clearFilters}
        className="text-xs text-text-3 hover:text-text-1 underline-offset-4 hover:underline transition-colors duration-100 ml-1"
      >
        Clear all
      </button>
    </div>
  );
}
