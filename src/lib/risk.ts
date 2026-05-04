import type { EsgGrade, RiskLevel } from '@/types';

export const RISK_CLASSES: Record<RiskLevel, { text: string; bg: string; dot: string }> = {
  Low:      { text: 'text-risk-low',      bg: 'bg-risk-low-bg',      dot: 'bg-risk-low' },
  Medium:   { text: 'text-risk-medium',   bg: 'bg-risk-medium-bg',   dot: 'bg-risk-medium' },
  High:     { text: 'text-risk-high',     bg: 'bg-risk-high-bg',     dot: 'bg-risk-high' },
  Critical: { text: 'text-risk-critical', bg: 'bg-risk-critical-bg', dot: 'bg-risk-critical' },
};

export type GradeBand = 'excellent' | 'good' | 'fair' | 'poor' | 'critical';

export function gradeBand(grade: EsgGrade): GradeBand {
  if (grade === 'AAA' || grade === 'AA') return 'excellent';
  if (grade === 'A' || grade === 'BBB') return 'good';
  if (grade === 'BB' || grade === 'B') return 'fair';
  if (grade === 'CCC') return 'poor';
  return 'critical';
}

export const GRADE_BAR_CLASSES: Record<GradeBand, { bar: string; text: string }> = {
  excellent: { bar: 'bg-brand-700',     text: 'text-brand-700' },
  good:      { bar: 'bg-brand-400',     text: 'text-brand-700' },
  fair:      { bar: 'bg-risk-medium',   text: 'text-text-1' },
  poor:      { bar: 'bg-risk-high',     text: 'text-text-1' },
  critical:  { bar: 'bg-risk-critical', text: 'text-text-1' },
};
