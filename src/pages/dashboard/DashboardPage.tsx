import { PageHeader } from '@/components/common/PageHeader';

export function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Portfolio Overview"
        description="KPIs, risk distribution, score trends, and recent activity across your supplier portfolio."
      />
      <div className="px-6 py-6 text-sm text-text-3">Dashboard content lands in Phase 9.</div>
    </>
  );
}
