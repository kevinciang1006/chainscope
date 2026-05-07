import { CountUpNumber } from '@/components/common/CountUpNumber';
import { DeltaIndicator } from '@/components/common/DeltaIndicator';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  label: string;
  value: number;
  delta: number;
  deltaFormat?: 'percent' | 'absolute' | 'count';
  inverted?: boolean;
  sparkline: number[];
  isLoading?: boolean;
}

const SPARK_WIDTH = 120;
const SPARK_HEIGHT = 36;

interface SparklineProps {
  data: number[];
  inverted: boolean;
  className?: string;
}

function Sparkline({ data, inverted, className }: SparklineProps) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((value, i) => {
      const x = (i / (data.length - 1)) * SPARK_WIDTH;
      const y = SPARK_HEIGHT - ((value - min) / range) * SPARK_HEIGHT;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');

  const areaPoints = `0,${SPARK_HEIGHT} ${points} ${SPARK_WIDTH},${SPARK_HEIGHT}`;

  const stroke = inverted ? 'var(--color-risk-high)' : 'var(--color-brand-600)';
  const fill = inverted ? 'var(--color-risk-high-bg)' : 'var(--color-brand-100)';

  return (
    <svg
      viewBox={`0 0 ${SPARK_WIDTH} ${SPARK_HEIGHT}`}
      className={cn('h-full w-full', className)}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <polygon points={areaPoints} fill={fill} opacity="0.6" />
      <polyline
        points={points}
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function KpiCard({
  label,
  value,
  delta,
  deltaFormat = 'percent',
  inverted = false,
  sparkline,
  isLoading = false,
}: KpiCardProps) {
  if (isLoading) {
    return <Skeleton className="h-24 w-full" />;
  }

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="py-5">
        <p className="text-xs uppercase tracking-wide text-text-3">{label}</p>
        <div className="mt-2 flex items-end gap-3">
          <span className="text-4xl font-semibold tabular-nums">
            <CountUpNumber value={value} />
          </span>
          <DeltaIndicator
            value={delta}
            format={deltaFormat}
            inverted={inverted}
            className="mb-1.5"
          />
        </div>
        <div className="mt-3 h-10">
          <Sparkline data={sparkline} inverted={inverted} />
        </div>
      </CardContent>
    </Card>
  );
}
