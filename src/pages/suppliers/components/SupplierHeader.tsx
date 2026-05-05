import type { Supplier } from '@/types';
import { RatingBadge } from '@/components/common/RatingBadge';
import { RiskPill } from '@/components/common/RiskPill';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/useToast';

// ---------------------------------------------------------------------------
// Country code → flag emoji helper
// Uses the Unicode regional indicator symbols trick: A=0x1F1E6 offset by char index
// ---------------------------------------------------------------------------
function countryFlag(code: string): string {
  try {
    const upper = code.toUpperCase().slice(0, 2);
    if (!/^[A-Z]{2}$/.test(upper)) return code;
    return String.fromCodePoint(
      0x1f1e6 + upper.charCodeAt(0) - 65,
      0x1f1e6 + upper.charCodeAt(1) - 65,
    );
  } catch {
    return code;
  }
}

interface SupplierHeaderProps {
  supplier: Supplier;
}

export function SupplierHeader({ supplier }: SupplierHeaderProps) {
  const flag = countryFlag(supplier.countryCode);

  function handleScheduleAudit() {
    toast({
      title: 'Schedule Audit',
      description: `An audit request for ${supplier.name} has been initiated.`,
      variant: 'info',
    });
  }

  function handleGenerateReport() {
    toast({
      title: 'Generate Report',
      description: `Generating ESG report for ${supplier.name}...`,
      variant: 'info',
    });
  }

  return (
    <div className="flex flex-col gap-4 px-6 py-6 border-b border-border md:flex-row md:items-start md:justify-between md:gap-8">
      {/* Left: name + meta */}
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono text-text-3">
          <span aria-hidden="true">{flag}</span>
          <span>{supplier.countryCode}</span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-text-1">{supplier.name}</h1>
        <p className="text-sm text-text-2">
          {supplier.industry} &bull; {supplier.country} &bull; {supplier.tier}
        </p>
      </div>

      {/* Right: badges + actions */}
      <div className="flex flex-wrap items-center gap-3 md:flex-col md:items-end md:gap-4">
        <div className="flex items-center gap-2">
          <RatingBadge grade={supplier.esgRating} size="lg" />
          <RiskPill level={supplier.riskLevel} size="md" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleScheduleAudit}>
            Schedule Audit
          </Button>
          <Button onClick={handleGenerateReport}>Generate Report</Button>
        </div>
      </div>
    </div>
  );
}
