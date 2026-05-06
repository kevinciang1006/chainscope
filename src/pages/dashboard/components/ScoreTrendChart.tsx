import type { ScoreHistoryPoint } from '@/types';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface ScoreTrendChartProps {
  trend: ScoreHistoryPoint[];
}

// Month abbreviations indexed 0–11
const MONTH_ABBR = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

function formatMonthLabel(yyyyMm: string): string {
  const parts = yyyyMm.split('-');
  const monthPart = parts[1];
  if (parts.length < 2 || !monthPart) return yyyyMm;
  const monthIndex = parseInt(monthPart, 10) - 1;
  return MONTH_ABBR[monthIndex] ?? yyyyMm;
}

interface ChartPoint {
  month: string;
  e: number;
  s: number;
  g: number;
}

// ---------------------------------------------------------------------------
// Custom tooltip — typed loosely to avoid Recharts v3 internal type friction
// ---------------------------------------------------------------------------
interface TooltipPayloadItem {
  dataKey?: string | number;
  value?: number | string;
  color?: string;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border bg-surface px-3 py-2 shadow-md">
      <p className="text-xs font-medium text-text-2 mb-1">{label}</p>
      <ul className="flex flex-col gap-0.5 text-xs">
        {payload.map((p) => (
          <li key={String(p.dataKey)} className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full shrink-0"
              style={{ background: p.color }}
              aria-hidden="true"
            />
            <span className="font-mono tabular-nums">
              {String(p.dataKey).toUpperCase()}: {p.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Series definitions
// ---------------------------------------------------------------------------
const SERIES = [
  { key: 'e' as const, label: 'Environmental', color: 'var(--color-brand-400)' },
  { key: 's' as const, label: 'Social',        color: 'var(--color-info)' },
  { key: 'g' as const, label: 'Governance',    color: 'var(--color-warning)' },
] as const;

export function ScoreTrendChart({ trend }: ScoreTrendChartProps) {
  const data: ChartPoint[] = trend.slice(-12).map((pt) => ({
    month: formatMonthLabel(pt.month),
    e: pt.e,
    s: pt.s,
    g: pt.g,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>ESG Score Trend</CardTitle>
        <CardDescription>Last 12 months, portfolio average.</CardDescription>
      </CardHeader>
      <CardContent>
        <figure>
          <figcaption className="sr-only">
            12-month portfolio average ESG score, broken into Environmental, Social, and
            Governance dimensions.
          </figcaption>

          <div className="min-h-[220px]">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
                <CartesianGrid
                  stroke="var(--color-border)"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: 'var(--color-text-3)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: 'var(--color-text-3)' }}
                  axisLine={false}
                  tickLine={false}
                  width={32}
                />
                <Tooltip content={<ChartTooltip />} />
                {SERIES.map(({ key, color }) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={color}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 3, strokeWidth: 0 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Manual legend */}
          <ul
            className="flex items-center gap-4 text-xs text-text-2 mt-2"
            aria-hidden="true"
          >
            {SERIES.map(({ key, label, color }) => (
              <li key={key} className="flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ background: color }}
                />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </figure>
      </CardContent>
    </Card>
  );
}
