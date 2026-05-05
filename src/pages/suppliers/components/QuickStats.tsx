import type { SupplierMeta } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCount } from '@/lib/formatters';

interface QuickStatsProps {
  meta: SupplierMeta;
}

interface StatRow {
  label: string;
  value: string;
}

export function QuickStats({ meta }: QuickStatsProps) {
  const rows: StatRow[] = [
    { label: 'Revenue', value: meta.revenue },
    { label: 'Employees', value: formatCount(meta.employees) },
    { label: 'Founded', value: String(meta.founded) },
  ];

  if (meta.parent) {
    rows.push({ label: 'Parent', value: meta.parent });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="flex flex-col gap-3 text-sm">
          {rows.map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between border-b border-border last:border-b-0 pb-3 last:pb-0"
            >
              <dt className="text-text-3">{label}</dt>
              <dd className="font-mono tabular-nums text-text-1">{value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
