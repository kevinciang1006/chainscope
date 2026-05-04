import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center gap-3 py-12 px-6',
        className,
      )}
    >
      {icon && (
        <div className="h-12 w-12 rounded-full bg-surface-2 flex items-center justify-center text-text-3">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-text-1">{title}</h3>
      {description && (
        <p className="text-sm text-text-3 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
