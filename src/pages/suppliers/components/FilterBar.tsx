import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useDebounce } from '@/hooks/useDebounce';
import { useFilters } from '@/hooks/useFilters';
import { GRADES, INDUSTRIES, REGIONS, RISK_LEVELS, SEARCH_DEBOUNCE_MS, TIERS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { EsgGrade, Industry, Region, RiskLevel, Tier } from '@/types';

// ---------------------------------------------------------------------------
// Private helper: a reusable multi-select dropdown backed by Popover
// ---------------------------------------------------------------------------

interface MultiSelectFilterProps<T extends string> {
  label: string;
  options: readonly T[];
  selected: T[];
  onChange: (next: T[]) => void;
}

function MultiSelectFilter<T extends string>({
  label,
  options,
  selected,
  onChange,
}: MultiSelectFilterProps<T>) {
  const toggle = (value: T) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 h-8"
          aria-label={`Filter by ${label}`}
        >
          <span>{label}</span>
          {selected.length > 0 && (
            <Badge
              variant="secondary"
              className="px-1.5 py-0 text-[0.625rem] font-semibold min-w-[1.125rem] justify-center normal-case tracking-normal tabular-nums"
            >
              {selected.length}
            </Badge>
          )}
          <ChevronDown className="h-3.5 w-3.5 text-text-3 shrink-0" aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="start">
        <div className="space-y-0.5">
          {options.map((option) => {
            const checked = selected.includes(option);
            return (
              <label
                key={option}
                className={cn(
                  'flex items-center gap-2.5 rounded-sm px-2 py-1.5 cursor-pointer',
                  'hover:bg-surface-2 transition-colors duration-100',
                  'text-sm text-text-1 select-none',
                )}
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => toggle(option)}
                  aria-label={option}
                />
                <span>{option}</span>
              </label>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ---------------------------------------------------------------------------
// FilterBar — exported
// ---------------------------------------------------------------------------

export function FilterBar() {
  const { filters, patchFilters, clearFilters, hasActiveFilters } = useFilters();

  // Local controlled state for the search input (debounced before hitting URL)
  const [searchInput, setSearchInput] = useState(filters.search ?? '');
  const debouncedSearch = useDebounce(searchInput, SEARCH_DEBOUNCE_MS);

  // Sync from URL when it changes externally (e.g., chip removal clears search)
  const prevUrlSearch = useRef(filters.search);
  useEffect(() => {
    if (filters.search !== prevUrlSearch.current) {
      prevUrlSearch.current = filters.search;
      setSearchInput(filters.search ?? '');
    }
  }, [filters.search]);

  // Push debounced value to URL (only when it actually differs)
  const prevDebounced = useRef(debouncedSearch);
  useEffect(() => {
    if (debouncedSearch === prevDebounced.current) return;
    prevDebounced.current = debouncedSearch;
    patchFilters({ search: debouncedSearch || undefined });
  }, [debouncedSearch, patchFilters]);

  return (
    <div className="sticky top-0 z-10 bg-bg/95 backdrop-blur border-b border-border px-6 py-3 flex flex-wrap items-center gap-2">
      {/* Search input */}
      <div className="relative">
        <Search
          className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-3 pointer-events-none"
          aria-hidden="true"
        />
        <Input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by name or country…"
          aria-label="Search suppliers"
          className="pl-8 h-8 text-sm w-48 lg:w-72"
        />
      </div>

      {/* Multi-select dropdowns */}
      <MultiSelectFilter<Industry>
        label="Industry"
        options={INDUSTRIES}
        selected={filters.industries ?? []}
        onChange={(next) => patchFilters({ industries: next.length ? next : undefined })}
      />

      <MultiSelectFilter<Region>
        label="Region"
        options={REGIONS}
        selected={filters.regions ?? []}
        onChange={(next) => patchFilters({ regions: next.length ? next : undefined })}
      />

      <MultiSelectFilter<Tier>
        label="Tier"
        options={TIERS}
        selected={filters.tiers ?? []}
        onChange={(next) => patchFilters({ tiers: next.length ? next : undefined })}
      />

      <MultiSelectFilter<RiskLevel>
        label="Risk"
        options={RISK_LEVELS}
        selected={filters.riskLevels ?? []}
        onChange={(next) => patchFilters({ riskLevels: next.length ? next : undefined })}
      />

      <MultiSelectFilter<EsgGrade>
        label="Rating"
        options={GRADES}
        selected={filters.ratings ?? []}
        onChange={(next) => patchFilters({ ratings: next.length ? next : undefined })}
      />

      {/* Clear all */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="ml-auto text-sm text-text-2 hover:text-text-1 underline-offset-4 hover:underline transition-colors duration-100"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
