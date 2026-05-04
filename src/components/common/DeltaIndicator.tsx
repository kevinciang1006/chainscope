import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

import { cn } from '@/lib/utils';
import { formatDelta } from '@/lib/formatters';

interface DeltaIndicatorProps {
  value: number;
  format?: 'percent' | 'absolute';
  inverted?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

const SIZE_CLASSES = {
  sm: { text: 'text-xs', icon: 'h-3.5 w-3.5' },
  md: { text: 'text-sm', icon: 'h-4 w-4' },
} as const;

function getColorClass(value: number, inverted: boolean): string {
  if (value === 0) return 'text-text-3';
  if (value > 0) return inverted ? 'text-risk-high' : 'text-success';
  return inverted ? 'text-success' : 'text-risk-high';
}

export function DeltaIndicator({
  value,
  format = 'absolute',
  inverted = false,
  size = 'md',
  className,
}: DeltaIndicatorProps) {
  const sizes = SIZE_CLASSES[size];
  const colorClass = getColorClass(value, inverted);
  const formatted = formatDelta(value, format);

  const Icon =
    value > 0 ? ArrowUpRight : value < 0 ? ArrowDownRight : Minus;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-mono tabular-nums',
        sizes.text,
        colorClass,
        className,
      )}
    >
      <Icon className={sizes.icon} aria-hidden="true" />
      {formatted}
    </span>
  );
}
