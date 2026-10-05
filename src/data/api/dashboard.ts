import { subMonths } from 'date-fns';

import type { DashboardKpis, RiskDistribution, ScoreHistoryPoint, ActivityEvent, Supplier } from '@/types';

import { suppliersFixture } from '@/data/fixtures/suppliers';
import { activityFixture } from '@/data/fixtures/activity';
import { monthKey, mulberry32 } from '@/data/fixtures/helpers';

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

// ---------------------------------------------------------------------------
// Per-KPI sparkline series (12 monthly points, oldest first → newest last).
// Each ends at the current value so the card and sparkline tell the same story.
// ---------------------------------------------------------------------------

function buildTotalSuppliersSparkline(current: number): number[] {
  // Monotonic-ish climb: started ~93% of current, ended at current.
  // Slight stalls but never decreases by more than 1.
  const rng = mulberry32(0xA1B2C3);
  const start = Math.round(current * 0.93);
  const out: number[] = [];
  let v = start;
  for (let i = 0; i < 12; i++) {
    if (i === 11) { v = current; }
    else {
      const target = start + ((current - start) * (i / 10));
      const drift = Math.round((rng() - 0.35) * 1.5); // mostly up
      v = Math.max(v, Math.round(target + drift));
    }
    out.push(v);
  }
  out[11] = current;
  return out;
}

function buildAvgEsgSparkline(current: number): number[] {
  // Small fluctuations around current with a slight upward trend.
  const rng = mulberry32(0xB2C3D4);
  const out: number[] = [];
  for (let i = 0; i < 12; i++) {
    const trendShift = (i - 11) * 0.4;     // older months ~4 points lower
    const noise = (rng() - 0.5) * 3;       // ±1.5 noise
    out.push(Math.round((current + trendShift + noise) * 10) / 10);
  }
  out[11] = current;
  return out;
}

function buildHighRiskSparkline(current: number): number[] {
  // Volatile: spikes when audits flag issues, recovery between.
  const rng = mulberry32(0xC3D4E5);
  const out: number[] = [];
  // Pre-seed with bumps so the curve isn't a smooth ramp.
  const bumps = [0, 1, 3, 5, 4, 2, 4, 6, 4, 3, 2];
  for (let i = 0; i < 12; i++) {
    if (i === 11) { out.push(current); continue; }
    const bump = bumps[i] ?? 0;
    const noise = Math.round((rng() - 0.5) * 2);
    out.push(Math.max(0, current + bump + noise - 2));
  }
  return out;
}

function buildAuditsDueSparkline(current: number): number[] {
  // Audit cycles bunch — produce a clear peak-and-trough.
  const rng = mulberry32(0xD4E5F6);
  const out: number[] = [];
  // Sinusoidal-ish bursts with noise.
  for (let i = 0; i < 12; i++) {
    if (i === 11) { out.push(current); continue; }
    const phase = Math.sin((i / 11) * Math.PI * 2 + 0.6);  // 1 cycle over the year
    const base = current + Math.round(phase * (current * 0.4));
    const noise = Math.round((rng() - 0.5) * 3);
    out.push(Math.max(0, base + noise));
  }
  return out;
}

// ---------------------------------------------------------------------------
// KPI fetcher
// ---------------------------------------------------------------------------

export async function fetchKpis(): Promise<DashboardKpis> {
  await sleep(200 + Math.random() * 300);

  const totalSuppliers = suppliersFixture.length;
  const avgEsgScore = computeAvgEsg();
  const highRiskCount = computeHighRiskCount();
  const auditsDue = computeAuditsDue();

  return {
    totalSuppliers,
    totalDelta: Math.round(deterministicDelta(totalSuppliers, 3)),
    totalSparkline: buildTotalSuppliersSparkline(totalSuppliers),

    avgEsgScore,
    avgEsgDelta: deterministicDelta(avgEsgScore, 2),
    avgEsgSparkline: buildAvgEsgSparkline(avgEsgScore),

    highRiskCount,
    highRiskDelta: Math.round(deterministicDelta(highRiskCount, 2)),
    highRiskSparkline: buildHighRiskSparkline(highRiskCount),

    auditsDue,
    auditsDueDelta: Math.round(deterministicDelta(auditsDue, 3)),
    auditsDueSparkline: buildAuditsDueSparkline(auditsDue),
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
// Score trend — aggregate portfolio monthly averages with macro factors
// so the three lines actually move month-to-month.
// ---------------------------------------------------------------------------

export async function fetchScoreTrend(): Promise<ScoreHistoryPoint[]> {
  await sleep(200 + Math.random() * 300);

  // Independent macro factor PRNGs per dimension so E/S/G diverge.
  const macroE = mulberry32(0xE5F60A);
  const macroS = mulberry32(0x12345678);
  const macroG = mulberry32(0x9ABCDEF);

  // Pre-roll smooth random walks for each dimension so adjacent months feel related.
  function walk(rng: () => number): number[] {
    const out: number[] = [];
    let v = 0;
    for (let i = 0; i < 12; i++) {
      v = v * 0.6 + (rng() - 0.5) * 4;       // mean-reverting random walk
      out.push(Math.round(v * 10) / 10);
    }
    return out;
  }

  const macroEArr = walk(macroE);
  const macroSArr = walk(macroS);
  const macroGArr = walk(macroG);

  const months: ScoreHistoryPoint[] = [];

  for (let i = 11; i >= 0; i--) {
    const date = subMonths(REFERENCE, i);
    const key = monthKey(date);
    const idx = 11 - i; // oldest = 0, newest = 11

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
    const baseE = sumE / safeCount;
    const baseS = sumS / safeCount;
    const baseG = sumG / safeCount;

    // Apply macro shift; clamp to 0–100.
    const e = Math.round(Math.max(0, Math.min(100, baseE + (macroEArr[idx] ?? 0))));
    const sScore = Math.round(Math.max(0, Math.min(100, baseS + (macroSArr[idx] ?? 0))));
    const g = Math.round(Math.max(0, Math.min(100, baseG + (macroGArr[idx] ?? 0))));
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
