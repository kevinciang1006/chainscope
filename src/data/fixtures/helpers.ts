import { subMonths } from 'date-fns';

// ---------------------------------------------------------------------------
// Seeded PRNG — Mulberry32
// ---------------------------------------------------------------------------

export const SEED = 0x5c00ce15;

export function mulberry32(seed: number): () => number {
  let s = seed;
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------------------------
// Weighted pick
// ---------------------------------------------------------------------------

export function pickWeighted<T>(
  rng: () => number,
  items: { value: T; weight: number }[],
): T {
  const total = items.reduce((acc, i) => acc + i.weight, 0);
  let r = rng() * total;
  for (const item of items) {
    r -= item.weight;
    if (r <= 0) return item.value;
  }
  // Fallback to last item (handles floating-point edge cases)
  const last = items[items.length - 1];
  if (last === undefined) throw new Error('pickWeighted: empty items array');
  return last.value;
}

// ---------------------------------------------------------------------------
// Pick N distinct items
// ---------------------------------------------------------------------------

export function pickN<T>(rng: () => number, items: readonly T[], n: number): T[] {
  const pool = [...items];
  const result: T[] = [];
  const count = Math.min(n, pool.length);
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(rng() * (pool.length - i));
    const picked = pool[idx];
    if (picked === undefined) continue;
    result.push(picked);
    // swap with end of remaining pool
    const end = pool[pool.length - 1 - i];
    if (end !== undefined) pool[idx] = end;
  }
  return result;
}

// ---------------------------------------------------------------------------
// Random int (inclusive) and float
// ---------------------------------------------------------------------------

export function randInt(rng: () => number, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

export function randRange(rng: () => number, min: number, max: number): number {
  return rng() * (max - min) + min;
}

// ---------------------------------------------------------------------------
// Date helpers
// Fixed reference: 2026-05-01 — keeps fixtures stable across calendar days
// ---------------------------------------------------------------------------

const REFERENCE_DATE = new Date('2026-05-01T00:00:00.000Z');

export function dateMonthsAgo(n: number): string {
  const d = subMonths(REFERENCE_DATE, n);
  return d.toISOString().slice(0, 10);
}

export function monthKey(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}
