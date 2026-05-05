import { useParams } from 'react-router-dom';

import { PageHeader } from '@/components/common/PageHeader';

export function SupplierDetailPage() {
  const { id } = useParams<{ id: string }>();
  return (
    <>
      <PageHeader
        title="Supplier detail"
        description={id ? `Loading details for ${id}` : 'No supplier id provided.'}
      />
      <div className="px-6 py-6 text-sm text-text-3">
        Score breakdown, history, audits, and certifications land in Phase 8.
      </div>
    </>
  );
}
