import { useQuery } from '@tanstack/react-query';

import { fetchSupplierById } from '@/data/api/suppliers';

export function useSupplier(id: string | undefined) {
  return useQuery({
    queryKey: ['supplier', id],
    queryFn: () => {
      if (!id) throw new Error('Supplier id required');
      return fetchSupplierById(id);
    },
    enabled: Boolean(id),
    staleTime: 30_000,
  });
}
