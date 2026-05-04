import type { EsgGrade } from '@/types';
import { cn } from '@/lib/utils';
import { gradeBand, GRADE_BAR_CLASSES } from '@/lib/risk';

interface RatingBadgeProps {
  grade: EsgGrade;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_CLASSES = {
  sm: {
    container: 'h-6',
    text: 'text-[0.6875rem] pl-2 pr-2',
    bar: 'w-0.5',
  },
  md: {
    container: 'h-7',
    text: 'text-xs pl-2.5 pr-2.5',
    bar: 'w-0.5',
  },
  lg: {
    container: 'h-9',
    text: 'text-sm pl-3 pr-3',
    bar: 'w-1',
  },
} as const;

export function RatingBadge({ grade, size = 'md', className }: RatingBadgeProps) {
  const band = gradeBand(grade);
  const sizes = SIZE_CLASSES[size];

  return (
    <span
      aria-label={`ESG rating ${grade}`}
      className={cn(
        'inline-flex items-stretch overflow-hidden rounded-md border border-border bg-surface',
        sizes.container,
        className,
      )}
    >
      <span className={cn('shrink-0', sizes.bar, GRADE_BAR_CLASSES[band].bar)} />
      <span
        className={cn(
          'font-mono font-semibold tracking-wide flex items-center',
          sizes.text,
          GRADE_BAR_CLASSES[band].text,
        )}
      >
        {grade}
      </span>
    </span>
  );
}
