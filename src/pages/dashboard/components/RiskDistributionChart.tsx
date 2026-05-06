import type { RiskLevel, RiskDistribution } from '@/types';
import { cn } from '@/lib/utils';
import { RISK_CLASSES } from '@/lib/risk';
import { formatCount, formatPercent } from '@/lib/formatters';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface RiskDistributionChartProps {
  distribution: RiskDistribution[];
  total: number;
}

// Solid risk color classes (not the muted *-bg variants)
const SEGMENT_BG: Record<RiskLevel, string> = {
  Low: 'bg-risk-low',
  Medium: 'bg-risk-medium',
  High: 'bg-risk-high',
  Critical: 'bg-risk-critical',
};

export function RiskDistributionChart({
  distribution,
  total,
}: RiskDistributionChartProps) {
  const safeTotal = total > 0 ? total : 1;

  const ariaLabel = distribution
    .map((d) => `${d.level}: ${d.count} (${formatPercent(d.percentage, 0)})`)
    .join(', ');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Distribution</CardTitle>
        <CardDescription>Across {formatCount(total)} suppliers</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Stacked bar */}
        <div
          className="flex h-3 w-full overflow-hidden rounded-full bg-surface-2"
          role="img"
          aria-label={ariaLabel}
        >
          {distribution.map(({ level, count }) => (
            <Tooltip key={level}>
              <TooltipTrigger asChild>
                <div
                  className={cn('h-full', SEGMENT_BG[level])}
                  style={{ width: `${(count / safeTotal) * 100}%` }}
                />
              </TooltipTrigger>
              <TooltipContent>
                {level}: {count} ({formatPercent((count / safeTotal) * 100, 0)})
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* Legend */}
        <ul className="mt-4 grid grid-cols-2 gap-2 text-xs">
          {distribution.map(({ level, count, percentage }) => (
            <li key={level} className="flex items-center gap-2">
              <span
                className={cn('h-2 w-2 rounded-full shrink-0', RISK_CLASSES[level].dot)}
              />
              <span className="text-text-2">{level}</span>
              <span className="ml-auto font-mono tabular-nums text-text-1">{count}</span>
              <span className="font-mono tabular-nums text-text-3">
                {formatPercent(percentage, 0)}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
