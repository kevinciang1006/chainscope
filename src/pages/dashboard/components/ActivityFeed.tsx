import type { LucideIcon } from 'lucide-react';
import { AlertTriangle, Award, ClipboardCheck, TrendingUp } from 'lucide-react';
import { Link } from 'react-router';

import type { ActivityEvent, ActivityType } from '@/types';
import { cn } from '@/lib/utils';
import { formatRelative } from '@/lib/formatters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ActivityFeedProps {
  events: ActivityEvent[];
}

interface IconMeta {
  icon: LucideIcon;
  bg: string;
  fg: string;
}

const ICON_BY_TYPE: Record<ActivityType, IconMeta> = {
  audit:        { icon: ClipboardCheck, bg: 'bg-brand-50',       fg: 'text-brand-700' },
  score_change: { icon: TrendingUp,     bg: 'bg-brand-50',       fg: 'text-brand-700' },
  certification: { icon: Award,         bg: 'bg-risk-medium-bg', fg: 'text-warning' },
  risk_flag:    { icon: AlertTriangle,  bg: 'bg-risk-high-bg',   fg: 'text-risk-high' },
};

export function ActivityFeed({ events }: ActivityFeedProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <ul className="flex flex-col">
          {events.map((evt) => {
            const meta = ICON_BY_TYPE[evt.type];
            const Icon = meta.icon;
            return (
              <li
                key={evt.id}
                className="flex items-start gap-3 px-6 py-3 border-b border-border last:border-b-0"
              >
                <span
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                    meta.bg,
                    meta.fg,
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <Link
                      to={`/suppliers/${evt.supplierId}`}
                      className="font-medium text-text-1 hover:underline"
                    >
                      {evt.supplierName}
                    </Link>
                    <span className="text-text-2"> · {evt.description}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-text-3">
                    {formatRelative(evt.timestamp)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
