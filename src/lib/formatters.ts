import {
  differenceInMonths,
  format,
  formatDistanceToNowStrict,
  parseISO,
} from 'date-fns';

export function formatShortDate(iso: string): string {
  return format(parseISO(iso), 'd MMM yyyy');
}

export function formatRelative(iso: string): string {
  return formatDistanceToNowStrict(parseISO(iso), { addSuffix: true });
}

export function formatMonthsAgo(iso: string): string {
  const months = differenceInMonths(new Date(), parseISO(iso));
  if (months <= 0) return 'this month';
  if (months === 1) return '1 mo ago';
  return `${months} mo ago`;
}

export function formatPercent(value: number, fractionDigits = 1): string {
  return `${value.toFixed(fractionDigits)}%`;
}

export function formatCount(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export function formatScore(value: number): string {
  return value.toFixed(0);
}

export function formatDelta(
  value: number,
  format: 'percent' | 'absolute' | 'count' = 'absolute',
): string {
  const sign = value > 0 ? '+' : value < 0 ? '−' : '';
  const abs = Math.abs(value);
  if (format === 'count') return `${sign}${Math.round(abs)}`;
  if (format === 'percent') return `${sign}${abs.toFixed(1)}%`;
  return `${sign}${abs.toFixed(1)}`;
}
