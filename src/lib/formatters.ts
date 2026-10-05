import {
  differenceInMonths,
  format,
  formatDistanceToNowStrict,
  parseISO,
} from 'date-fns';

import { DEFAULT_LOCALE } from '@/lib/constants';

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

// Round with toFixed first so tie-breaking matches the previous output,
// then let Intl handle the locale-specific separators.
function formatFixed(value: number, fractionDigits: number, locale: string): string {
  return Number(value.toFixed(fractionDigits)).toLocaleString(locale, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
    useGrouping: false,
  });
}

export function formatPercent(
  value: number,
  fractionDigits = 1,
  locale: string = DEFAULT_LOCALE,
): string {
  return `${formatFixed(value, fractionDigits, locale)}%`;
}

export function formatCount(value: number, locale: string = DEFAULT_LOCALE): string {
  return new Intl.NumberFormat(locale).format(value);
}

export function formatScore(value: number, locale: string = DEFAULT_LOCALE): string {
  return formatFixed(value, 0, locale);
}

export function formatDelta(
  value: number,
  format: 'percent' | 'absolute' | 'count' = 'absolute',
  locale: string = DEFAULT_LOCALE,
): string {
  const sign = value > 0 ? '+' : value < 0 ? '−' : '';
  const abs = Math.abs(value);
  if (format === 'count') return `${sign}${formatFixed(Math.round(abs), 0, locale)}`;
  if (format === 'percent') return `${sign}${formatFixed(abs, 1, locale)}%`;
  return `${sign}${formatFixed(abs, 1, locale)}`;
}
