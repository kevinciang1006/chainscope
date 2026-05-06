import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboard } from '@/hooks/useDashboard';

import { ActivityFeed } from './components/ActivityFeed';
import { KpiCard } from './components/KpiCard';
import { RiskDistributionChart } from './components/RiskDistributionChart';
import { ScoreTrendChart } from './components/ScoreTrendChart';
import { TopRisksList } from './components/TopRisksList';

// Helper: synthesise a plausible 12-point sparkline series deterministically
// from a single seed value. The KPIs don't have per-month histories server-side,
// so we derive small variations from a LCG to fill the mini area chart.
function makeSparkline(seed: number, points = 12): number[] {
  const out: number[] = [];
  let v = seed;
  for (let i = 0; i < points; i++) {
    v = (v * 9301 + 49297) % 233280;
    out.push((v / 233280) * 0.4 + 0.3); // range 0.3–0.7
  }
  return out;
}

export function DashboardPage() {
  const { kpis, riskDistribution, scoreTrend, topRisks, activity } = useDashboard();

  const total = riskDistribution?.reduce((sum, d) => sum + d.count, 0) ?? 0;

  return (
    <>
      <PageHeader
        title="Portfolio Overview"
        description="Supplier risk and ESG performance across your supply chain."
        actions={<span className="text-xs text-text-3">Last updated: 2 hours ago</span>}
      />

      <div className="px-6 py-6 flex flex-col gap-6 animate-fade-in">
        {/* KPI grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpis ? (
            <>
              <KpiCard
                label="Total Suppliers"
                value={kpis.totalSuppliers}
                delta={kpis.totalDelta}
                deltaFormat="absolute"
                sparkline={makeSparkline(kpis.totalSuppliers)}
              />
              <KpiCard
                label="Avg ESG Score"
                value={kpis.avgEsgScore}
                delta={kpis.avgEsgDelta}
                deltaFormat="percent"
                sparkline={makeSparkline(Math.round(kpis.avgEsgScore))}
              />
              <KpiCard
                label="High-Risk Suppliers"
                value={kpis.highRiskCount}
                delta={kpis.highRiskDelta}
                deltaFormat="absolute"
                inverted
                sparkline={makeSparkline(kpis.highRiskCount + 7)}
              />
              <KpiCard
                label="Audits Due (90d)"
                value={kpis.auditsDue}
                delta={kpis.auditsDueDelta}
                deltaFormat="absolute"
                inverted
                sparkline={makeSparkline(kpis.auditsDue + 13)}
              />
            </>
          ) : (
            Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-32" />)
          )}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-1">
            {riskDistribution ? (
              <RiskDistributionChart distribution={riskDistribution} total={total} />
            ) : (
              <Card>
                <CardContent className="py-6">
                  <Skeleton className="h-32" />
                </CardContent>
              </Card>
            )}
          </div>
          <div className="lg:col-span-2">
            {scoreTrend ? (
              <ScoreTrendChart trend={scoreTrend} />
            ) : (
              <Card>
                <CardContent className="py-6">
                  <Skeleton className="h-48" />
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {topRisks ? (
            <TopRisksList suppliers={topRisks} />
          ) : (
            <Card>
              <CardContent className="py-6">
                <Skeleton className="h-48" />
              </CardContent>
            </Card>
          )}
          {activity ? (
            <ActivityFeed events={activity} />
          ) : (
            <Card>
              <CardContent className="py-6">
                <Skeleton className="h-48" />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
