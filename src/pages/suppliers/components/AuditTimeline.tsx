import type { AuditEntry } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatShortDate } from '@/lib/formatters';

interface AuditTimelineProps {
  audits: AuditEntry[];
}

export function AuditTimeline({ audits }: AuditTimelineProps) {
  // Sort newest-first
  const sorted = [...audits].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  if (sorted.length === 0) {
    return (
      <p className="px-6 py-4 text-sm text-text-3">No audits recorded.</p>
    );
  }

  return (
    <ol className="flex flex-col gap-6 px-6 py-4">
      {sorted.map((audit, index) => {
        const isLast = index === sorted.length - 1;
        const scoreChange = audit.scoreChange;

        return (
          <li key={audit.id} className="flex gap-4">
            {/* Left: date + dot + connector */}
            <div className="flex flex-col items-center">
              <span className="font-mono text-xs text-text-3 tabular-nums whitespace-nowrap">
                {formatShortDate(audit.date)}
              </span>
              <div className="mt-1 h-2 w-2 rounded-full bg-brand-700 shrink-0" aria-hidden="true" />
              {!isLast && (
                <div className="flex-1 w-px bg-border mt-1" aria-hidden="true" />
              )}
            </div>

            {/* Right: card */}
            <Card className="flex-1 mb-2">
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col">
                    <h3 className="text-sm font-medium text-text-1">{audit.type}</h3>
                    <p className="text-xs text-text-3 mt-0.5">by {audit.auditor}</p>
                  </div>

                  {/* Score change pill */}
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium tabular-nums font-mono shrink-0',
                      scoreChange > 0 && 'bg-brand-50 text-brand-800',
                      scoreChange < 0 && 'bg-risk-high-bg text-risk-high',
                      scoreChange === 0 && 'bg-surface-2 text-text-3',
                    )}
                    aria-label={`Score change: ${scoreChange > 0 ? '+' : ''}${scoreChange}`}
                  >
                    {scoreChange > 0 ? '+' : scoreChange < 0 ? '−' : ''}
                    {Math.abs(scoreChange)}
                  </span>
                </div>

                <p className="text-sm text-text-2 mt-2">{audit.notes}</p>
              </CardContent>
            </Card>
          </li>
        );
      })}
    </ol>
  );
}
