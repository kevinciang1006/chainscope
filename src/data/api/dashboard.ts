import { subMonths } from 'date-fns';

import type { DashboardKpis, RiskDistribution, ScoreHistoryPoint, ActivityEvent, Supplier } from '@/types';

import { suppliersFixture } from '@/data/fixtures/suppliers';
import { activityFixture } from '@/data/fixtures/activity';
import { monthKey } from '@/data/fixtures/helpers';

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const REFERENCE = new Date('2026-05-01T00:00:00.000Z');
const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;

// ---------------------------------------------------------------------------
// KPI helpers
// ---------------------------------------------------------------------------

function computeAvgEsg(): number {
  const total = suppliersFixture.reduce((acc, s) => {
    return acc + Math.round((s.scores.e + s.scores.s + s.scores.g) / 3);
  }, 0);
  return Math.round(total / suppliersFixture.length);
}

function computeHighRiskCount(): number {
  return suppliersFixture.filter((s) => s.riskLevel === 'High' || s.riskLevel === 'Critical').length;
}

function computeAuditsDue(): number {
  return suppliersFixture.filter((s) => {
    const due = new Date(s.nextAuditDue);
    return due.getTime() - REFERENCE.getTime() <= NINETY_DAYS_MS && due >= REFERENCE;
  }).length;
}

// Deterministic deltas — derived from fixture sums so they never change
function deterministicDelta(seed: number, scale: number): number {
  const hash = (seed * 2654435761) >>> 0;
  const val = ((hash % 200) - 100) / 100;
  return Math.round(val * scale * 10) / 10;
}

export async function fetchKpis(): Promise<DashboardKpis> {
  await sleep(200 + Math.random() * 300);

  const totalSuppliers = suppliersFixture.length;
  const avgEsgScore = computeAvgEsg();
  const highRiskCount = computeHighRiskCount();
  const auditsDue = computeAuditsDue();

  return {
    totalSuppliers,
    totalDelta: deterministicDelta(totalSuppliers, 3),
    avgEsgScore,
    avgEsgDelta: deterministicDelta(avgEsgScore, 2),
    highRiskCount,
    highRiskDelta: deterministicDelta(highRiskCount, 2),
    auditsDue,
    auditsDueDelta: deterministicDelta(auditsDue, 3),
  };
}

// ---------------------------------------------------------------------------
// Risk distribution
// ---------------------------------------------------------------------------

export async function fetchRiskDistribution(): Promise<RiskDistribution[]> {
  await sleep(200 + Math.random() * 300);

  const counts: Record<string, number> = { Low: 0, Medium: 0, High: 0, Critical: 0 };
  for (const s of suppliersFixture) {
    counts[s.riskLevel] = (counts[s.riskLevel] ?? 0) + 1;
  }

  const total = suppliersFixture.length;
  const levels = ['Low', 'Medium', 'High', 'Critical'] as const;

  return levels.map((level) => ({
    level,
    count: counts[level] ?? 0,
    percentage: Math.round(((counts[level] ?? 0) / total) * 1000) / 10,
  }));
}

// ---------------------------------------------------------------------------
// Score trend — aggregate portfolio monthly averages
// ---------------------------------------------------------------------------

export async function fetchScoreTrend(): Promise<ScoreHistoryPoint[]> {
  await sleep(200 + Math.random() * 300);

  const months: ScoreHistoryPoint[] = [];

  for (let i = 11; i >= 0; i--) {
    const date = subMonths(REFERENCE, i);
    const key = monthKey(date);

    let sumE = 0, sumS = 0, sumG = 0, count = 0;

    for (const s of suppliersFixture) {
      const pt = s.scoreHistory.find((h) => h.month === key);
      if (pt) {
        sumE += pt.e;
        sumS += pt.s;
        sumG += pt.g;
        count++;
      }
    }

    const safeCount = count > 0 ? count : 1;
    const e = Math.round(sumE / safeCount);
    const sScore = Math.round(sumS / safeCount);
    const g = Math.round(sumG / safeCount);
    const overall = Math.round((e + sScore + g) / 3);

    months.push({ month: key, e, s: sScore, g, overall });
  }

  return months;
}

// ---------------------------------------------------------------------------
// Top risks — ordered Critical > High > Medium > Low, then ascending score
// ---------------------------------------------------------------------------

const RISK_ORDER: Record<string, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 };

export async function fetchTopRisks(limit = 5): Promise<Supplier[]> {
  await sleep(200 + Math.random() * 300);

  return [...suppliersFixture]
    .sort((a, b) => {
      const riskDiff = (RISK_ORDER[b.riskLevel] ?? 0) - (RISK_ORDER[a.riskLevel] ?? 0);
      if (riskDiff !== 0) return riskDiff;
      const aScore = Math.round((a.scores.e + a.scores.s + a.scores.g) / 3);
      const bScore = Math.round((b.scores.e + b.scores.s + b.scores.g) / 3);
      return aScore - bScore; // ascending: worse score = more risky
    })
    .slice(0, limit);
}

// ---------------------------------------------------------------------------
// Recent activity
// ---------------------------------------------------------------------------

export async function fetchRecentActivity(limit = 8): Promise<ActivityEvent[]> {
  await sleep(200 + Math.random() * 300);
  return activityFixture.slice(0, limit);
}
