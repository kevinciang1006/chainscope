import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { useFilters } from './useFilters';

function setup(initialEntry: string) {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[initialEntry]}>{children}</MemoryRouter>
  );
  return renderHook(
    () => ({ filters: useFilters(), location: useLocation() }),
    { wrapper },
  );
}

describe('useFilters', () => {
  it('parses filters from the URL', () => {
    const { result } = setup('/suppliers?q=acme&ind=Apparel,Electronics&risk=High&rate=AA');
    const { filters, hasActiveFilters } = result.current.filters;
    expect(filters.search).toBe('acme');
    expect(filters.industries).toEqual(['Apparel', 'Electronics']);
    expect(filters.riskLevels).toEqual(['High']);
    expect(filters.ratings).toEqual(['AA']);
    expect(filters.regions).toBeUndefined();
    expect(hasActiveFilters).toBe(true);
  });

  it('drops values that are not in the allowed lists', () => {
    const { result } = setup('/suppliers?ind=Apparel,Nonsense&tier=Tier 9');
    expect(result.current.filters.filters.industries).toEqual(['Apparel']);
    expect(result.current.filters.filters.tiers).toBeUndefined();
  });

  it('writes updated filters to the URL and keeps existing ones', () => {
    const { result } = setup('/suppliers?risk=High');
    act(() => result.current.filters.patchFilters({ regions: ['Europe', 'Africa'] }));
    const params = new URLSearchParams(result.current.location.search);
    expect(params.get('reg')).toBe('Europe,Africa');
    expect(params.get('risk')).toBe('High');
    expect(result.current.filters.filters.regions).toEqual(['Europe', 'Africa']);
  });

  it('removes all params when filters are cleared', () => {
    const { result } = setup('/suppliers?q=acme&risk=High&tier=Tier 1');
    act(() => result.current.filters.clearFilters());
    expect(result.current.location.search).toBe('');
    expect(result.current.filters.hasActiveFilters).toBe(false);
  });
});
