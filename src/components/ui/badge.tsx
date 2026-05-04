import type { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const badgeVariants = cva(
  'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[0.6875rem] font-medium uppercase tracking-wide',
  {
    variants: {
      variant: {
        default: 'bg-brand-50 text-brand-800 border border-brand-100',
        secondary: 'bg-surface-2 text-text-2 border border-border',
        outline: 'bg-transparent text-text-2 border border-border',
        success: 'bg-brand-50 text-success border border-brand-100',
        warning: 'bg-risk-medium-bg text-warning border border-risk-medium-bg',
        danger: 'bg-risk-high-bg text-error border border-risk-high-bg',
        muted: 'bg-surface-2 text-text-3 border border-border',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
