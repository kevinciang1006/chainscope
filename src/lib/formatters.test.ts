import { describe, expect, it } from 'vitest';

import { formatCount, formatDelta, formatPercent, formatScore } from './formatters';

describe('formatCount', () => {
  it('formats zero and large numbers with en-US grouping by default and honours a locale', () => {
    expect(formatCount(0)).toBe('0');
    expect(formatCount(1234567)).toBe('1,234,567');
    expect(formatCount(1234567, 'de-DE')).toBe('1.234.567');
  });
});

describe('formatPercent', () => {
  it('uses one fraction digit by default, respects fractionDigits, and does not group', () => {
    expect(formatPercent(0)).toBe('0.0%');
    expect(formatPercent(12.34)).toBe('12.3%');
    expect(formatPercent(45.6, 0)).toBe('46%');
    expect(formatPercent(12345.67)).toBe('12345.7%');
  });

  it('honours a non-default locale', () => {
    expect(formatPercent(12.34, 1, 'de-DE')).toBe('12,3%');
  });
});

describe('formatScore', () => {
  it('rounds to a whole number', () => {
    expect(formatScore(0)).toBe('0');
    expect(formatScore(72.4)).toBe('72');
    expect(formatScore(72.6)).toBe('73');
  });
});

describe('formatDelta', () => {
  it('prefixes + for positive, a true minus sign for negative, nothing for zero', () => {
    expect(formatDelta(2.34)).toBe('+2.3');
    expect(formatDelta(-2.34)).toBe('−2.3');
    expect(formatDelta(0)).toBe('0.0');
  });

  it('supports percent and count formats and a non-default locale', () => {
    expect(formatDelta(5.56, 'percent')).toBe('+5.6%');
    expect(formatDelta(-3.6, 'count')).toBe('−4');
    expect(formatDelta(2.34, 'absolute', 'de-DE')).toBe('+2,3');
  });
});
