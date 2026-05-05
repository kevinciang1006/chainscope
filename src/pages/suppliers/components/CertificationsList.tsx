import type { Certification, CertificationStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatShortDate } from '@/lib/formatters';

interface CertificationsListProps {
  certifications: Certification[];
  variant?: 'compact' | 'full';
}

const STATUS_ORDER: Record<CertificationStatus, number> = {
  active: 0,
  expiring: 1,
  expired: 2,
};

function StatusBadge({ status }: { status: CertificationStatus }) {
  if (status === 'active') {
    return <Badge variant="success">Active</Badge>;
  }
  if (status === 'expiring') {
    return <Badge variant="warning">Expiring</Badge>;
  }
  return <Badge variant="muted">Expired</Badge>;
}

export function CertificationsList({ certifications, variant = 'full' }: CertificationsListProps) {
  const sorted = [...certifications].sort(
    (a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status],
  );

  if (sorted.length === 0) {
    return (
      <p className="px-6 py-4 text-sm text-text-3">No certifications on record.</p>
    );
  }

  return (
    <ul className="flex flex-col gap-2 px-6 py-4">
      {sorted.map((cert) => {
        const isExpired = cert.status === 'expired';

        return (
          <li
            key={cert.id}
            className="flex items-center justify-between gap-3 rounded-md border border-border bg-surface p-3"
          >
            {/* Left: name + (full: dates) */}
            <div className="flex flex-col gap-0.5 min-w-0">
              <span
                className={cn(
                  'text-sm font-medium text-text-1 truncate',
                  isExpired && 'line-through text-text-3',
                )}
              >
                {cert.name}
              </span>

              {variant === 'full' && (
                <div className="flex flex-wrap gap-x-4 gap-y-0.5">
                  <span className="text-xs text-text-3">
                    Issued: {formatShortDate(cert.issuedDate)}
                  </span>
                  <span className={cn('text-xs text-text-3', isExpired && 'text-error')}>
                    Expires: {formatShortDate(cert.expiryDate)}
                  </span>
                </div>
              )}

              {variant === 'compact' && (
                <span
                  className={cn(
                    'inline-block h-1.5 w-1.5 rounded-full mt-0.5',
                    cert.status === 'active' && 'bg-success',
                    cert.status === 'expiring' && 'bg-warning',
                    cert.status === 'expired' && 'bg-text-3',
                  )}
                  aria-hidden="true"
                />
              )}
            </div>

            {/* Right: status badge */}
            <StatusBadge status={cert.status} />
          </li>
        );
      })}
    </ul>
  );
}
