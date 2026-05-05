import { PageHeader } from '@/components/common/PageHeader';

export function SuppliersListPage() {
  return (
    <>
      <PageHeader
        title="Suppliers"
        description="80 suppliers across 6 industries and 6 regions. Filter, sort, and drill in."
      />
      <div className="px-6 py-6 text-sm text-text-3">
        Filter bar, table, and bulk actions land in Phase 7.
      </div>
    </>
  );
}
