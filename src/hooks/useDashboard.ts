import { useQueries } from '@tanstack/react-query';

import {
  fetchKpis,
  fetchRecentActivity,
  fetchRiskDistribution,
  fetchScoreTrend,
  fetchTopRisks,
} from '@/data/api/dashboard';

export function useDashboard() {
  const results = useQueries({
    queries: [
      { queryKey: ['dashboard', 'kpis'],        queryFn: fetchKpis,             staleTime: 30_000 },
      { queryKey: ['dashboard', 'risk-dist'],   queryFn: fetchRiskDistribution, staleTime: 30_000 },
      { queryKey: ['dashboard', 'score-trend'], queryFn: fetchScoreTrend,       staleTime: 30_000 },
      { queryKey: ['dashboard', 'top-risks'],   queryFn: () => fetchTopRisks(),       staleTime: 30_000 },
      { queryKey: ['dashboard', 'activity'],    queryFn: () => fetchRecentActivity(), staleTime: 30_000 },
    ],
  });

  const [kpisQ, riskDistQ, trendQ, topRisksQ, activityQ] = results;

  return {
    kpis: kpisQ!.data,
    riskDistribution: riskDistQ!.data,
    scoreTrend: trendQ!.data,
    topRisks: topRisksQ!.data,
    activity: activityQ!.data,
    isLoading: results.some((r) => r.isLoading),
    isError: results.some((r) => r.isError),
  };
}
