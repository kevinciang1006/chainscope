import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/common/PageHeader';
import { useFilters } from '@/hooks/useFilters';
import { useSuppliers } from '@/hooks/useSuppliers';
import { toast } from '@/hooks/useToast';
import { formatCount } from '@/lib/formatters';

import { BulkActionsBar } from './components/BulkActionsBar';
import { FilterBar } from './components/FilterBar';
import { FilterChips } from './components/FilterChips';
import { SuppliersTable } from './components/SuppliersTable';

export function SuppliersListPage() {
  const navigate = useNavigate();
  const { filters, clearFilters } = useFilters();
  const { data, isLoading } = useSuppliers(filters);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const suppliers = data ?? [];
  const total = suppliers.length;
  const selectedCount = Object.values(rowSelection).filter(Boolean).length;

  return (
    <>
      <PageHeader
        title="Suppliers"
        description="80 active suppliers across 6 industries and 6 regions."
        actions={
          <Button
            onClick={() =>
              toast({
                title: 'New supplier flow',
                description: 'Stub — not wired in this demo.',
                variant: 'info',
              })
            }
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add Supplier
          </Button>
        }
      />

      <FilterBar />
      <FilterChips />

      {/* Results count */}
      {!isLoading && (
        <div className="flex items-center justify-between px-6 py-3 text-sm text-text-2">
          <span className="tabular-nums">
            {formatCount(total)} of 80 suppliers
          </span>
        </div>
      )}

      <SuppliersTable
        data={suppliers}
        isLoading={isLoading}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        onRowClick={(id) => navigate(`/suppliers/${id}`)}
        onClearFilters={clearFilters}
      />

      {selectedCount > 0 && (
        <BulkActionsBar
          count={selectedCount}
          onClear={() => setRowSelection({})}
        />
      )}
    </>
  );
}
