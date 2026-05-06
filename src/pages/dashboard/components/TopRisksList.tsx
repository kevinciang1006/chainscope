import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';

import type { Supplier } from '@/types';
import { RatingBadge } from '@/components/common/RatingBadge';
import { RiskPill } from '@/components/common/RiskPill';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface TopRisksListProps {
  suppliers: Supplier[];
}

export function TopRisksList({ suppliers }: TopRisksListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Risk Suppliers</CardTitle>
        <CardDescription>Highest-priority follow-ups</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <ul className="flex flex-col">
          {suppliers.map((s, idx) => (
            <li
              key={s.id}
              className="flex items-center gap-3 px-6 py-3 border-b border-border last:border-b-0 hover:bg-surface-2 transition-colors duration-100"
            >
              <span className="font-mono text-xs text-text-3 tabular-nums w-5">
                {idx + 1}
              </span>
              <Link
                to={`/suppliers/${s.id}`}
                className="flex-1 truncate text-sm font-medium text-text-1 hover:underline"
              >
                {s.name}
              </Link>
              <RatingBadge grade={s.esgRating} size="sm" />
              <RiskPill level={s.riskLevel} size="sm" />
              <ChevronRight className="h-4 w-4 text-text-3" aria-hidden="true" />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
