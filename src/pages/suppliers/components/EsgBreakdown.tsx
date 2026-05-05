import type { Supplier } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DeltaIndicator } from '@/components/common/DeltaIndicator';

interface EsgBreakdownProps {
  supplier: Supplier;
}

const DIM_LABELS: { key: 'e' | 's' | 'g'; short: string; long: string }[] = [
  { key: 'e', short: 'E', long: 'Environmental' },
  { key: 's', short: 'S', long: 'Social' },
  { key: 'g', short: 'G', long: 'Governance' },
];

export function EsgBreakdown({ supplier }: EsgBreakdownProps) {
  const history = supplier.scoreHistory;
  // Find the score from ~3 months ago (4th from end means 3 months back in a monthly series)
  const threeMonthsBack = history.length >= 4 ? history[history.length - 4] : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>ESG Score Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-4">
        {DIM_LABELS.map(({ key, short, long }) => {
          const score = supplier.scores[key];
          const delta = threeMonthsBack != null ? score - threeMonthsBack[key] : 0;

          return (
            <figure key={key} className="flex flex-col gap-2">
              <figcaption className="sr-only">
                {long} score: {score} out of 100
                {threeMonthsBack != null
                  ? `, ${delta >= 0 ? '+' : ''}${delta.toFixed(1)} vs 3 months ago`
                  : ''}
              </figcaption>

              <span className="text-xs uppercase tracking-wide text-text-3">{long}</span>

              <span
                className="text-5xl font-semibold tabular-nums font-mono leading-none"
                aria-hidden="true"
              >
                {score}
              </span>

              {/* Mini bar */}
              <div className="h-1.5 rounded-full bg-surface-2" aria-hidden="true">
                <div
                  className="h-full rounded-full bg-brand-700 transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
                />
              </div>

              {threeMonthsBack != null && (
                <DeltaIndicator value={delta} format="absolute" size="sm" />
              )}
            </figure>
          );
        })}
      </CardContent>
    </Card>
  );
}
