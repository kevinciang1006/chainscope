import type { RiskLevel } from '@/types';
import { cn } from '@/lib/utils';
import { RISK_CLASSES } from '@/lib/risk';

interface RiskPillProps {
  level: RiskLevel;
  size?: 'sm' | 'md';
  className?: string;
}

const SIZE_CLASSES = {
  sm: {
    container: 'h-5 px-2 text-[0.6875rem]',
    dot: 'h-1.5 w-1.5',
  },
  md: {
    container: 'h-6 px-2.5 text-xs',
    dot: 'h-2 w-2',
  },
} as const;

export function RiskPill({ level, size = 'md', className }: RiskPillProps) {
  const classes = RISK_CLASSES[level];
  const sizes = SIZE_CLASSES[size];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        sizes.container,
        classes.bg,
        classes.text,
        className,
      )}
    >
      <span className={cn('rounded-full shrink-0', sizes.dot, classes.dot)} />
      {level}
    </span>
  );
}
