import { useQuery } from '@tanstack/react-query';

import { fetchSuppliers } from '@/data/api/suppliers';
import type { SupplierFilters } from '@/types';

export function useSuppliers(filters?: SupplierFilters) {
  return useQuery({
    queryKey: ['suppliers', filters ?? {}],
    queryFn: () => fetchSuppliers(filters),
    staleTime: 30_000,
  });
}
