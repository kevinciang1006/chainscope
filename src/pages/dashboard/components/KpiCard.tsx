import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts';

import { CountUpNumber } from '@/components/common/CountUpNumber';
import { DeltaIndicator } from '@/components/common/DeltaIndicator';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface KpiCardProps {
  label: string;
  value: number;
  delta: number;
  deltaFormat?: 'percent' | 'absolute';
  inverted?: boolean;
  sparkline: number[];
  isLoading?: boolean;
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

  const chartData = sparkline.map((v, i) => ({ i, v }));

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
          <ResponsiveContainer width="100%" height={40}>
            <AreaChart
              data={chartData}
              margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            >
              <Area
                type="monotone"
                dataKey="v"
                stroke="var(--color-brand-700)"
                strokeWidth={1.5}
                fill="var(--color-brand-200)"
                fillOpacity={0.5}
                dot={false}
              />
              <Tooltip content={() => null} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
