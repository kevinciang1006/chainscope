import { AlertTriangle } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface KeyRisksListProps {
  risks: string[];
}

export function KeyRisksList({ risks }: KeyRisksListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Risks</CardTitle>
      </CardHeader>
      <CardContent>
        {risks.length === 0 ? (
          <p className="text-sm text-text-3">No risks flagged.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {risks.map((risk, index) => (
              <li key={index} className="flex items-start gap-2.5">
                <AlertTriangle
                  className="h-4 w-4 shrink-0 text-warning mt-0.5"
                  aria-hidden="true"
                />
                <span className="text-sm text-text-2">{risk}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
