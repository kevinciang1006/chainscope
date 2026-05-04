import type { ActivityEvent, ActivityType } from '@/types';

import { mulberry32, pickWeighted, randInt } from '@/data/fixtures/helpers';
import { suppliersFixture } from '@/data/fixtures/suppliers';

// Re-seed with a variant for activity so events are independent of supplier ordering
const ACT_SEED = 0xac71f17e;

const TYPE_WEIGHTS: { value: ActivityType; weight: number }[] = [
  { value: 'audit', weight: 35 },
  { value: 'score_change', weight: 30 },
  { value: 'certification', weight: 20 },
  { value: 'risk_flag', weight: 15 },
];

// Description templates per type
function makeDescription(rng: () => number, type: ActivityType): string {
  switch (type) {
    case 'audit': {
      const auditors = [
        'Bureau Veritas', 'SGS', 'DNV', 'TÜV SÜD', 'Intertek', 'LRQA', 'ERM Group',
      ];
      const auditTypes = [
        'On-site audit', 'Compliance check', 'Third-party ESG audit', 'Tier-2 audit',
      ];
      const idx = Math.floor(rng() * auditors.length);
      const typeIdx = Math.floor(rng() * auditTypes.length);
      return `${auditTypes[typeIdx] ?? 'On-site audit'} completed by ${auditors[idx] ?? 'Bureau Veritas'}`;
    }
    case 'score_change': {
      const delta = randInt(rng, 1, 8);
      const direction = rng() > 0.3 ? 'increased' : 'decreased';
      return `Overall ESG score ${direction} by ${delta} point${delta > 1 ? 's' : ''}`;
    }
    case 'certification': {
      const certs = [
        'ISO 14001', 'ISO 45001', 'B Corp', 'Fair Trade', 'FSC',
        'SA8000', 'GRS', 'EcoVadis Gold', 'EcoVadis Silver',
      ];
      const actions = ['renewed', 'issued', 'upgraded'];
      const idx = Math.floor(rng() * certs.length);
      const actIdx = Math.floor(rng() * actions.length);
      return `${certs[idx] ?? 'ISO 14001'} certification ${actions[actIdx] ?? 'renewed'}`;
    }
    case 'risk_flag': {
      const flags = [
        'Flagged for water-usage variance above industry median',
        'Flagged for delayed Tier-2 labor audit submission',
        'Risk flag raised for scope-1 emissions increase',
        'Flagged for restricted-substance compliance gap',
        'Flagged for governance restructuring review',
        'Risk flag raised for single-source dependency identified',
      ];
      const idx = Math.floor(rng() * flags.length);
      return flags[idx] ?? 'Risk flag raised for compliance review';
    }
  }
}

function generateActivity(): ActivityEvent[] {
  const rng = mulberry32(ACT_SEED);
  const events: ActivityEvent[] = [];

  const REFERENCE = new Date('2026-05-01T00:00:00.000Z');

  for (let i = 0; i < 30; i++) {
    // Pick a supplier
    const suppIdx = Math.floor(rng() * suppliersFixture.length);
    const supplier = suppliersFixture[suppIdx];
    if (!supplier) continue;

    // Timestamp within last 21 days
    const daysAgo = randInt(rng, 0, 20);
    const hoursAgo = randInt(rng, 0, 23);
    const minsAgo = randInt(rng, 0, 59);
    const ts = new Date(
      REFERENCE.getTime() -
        daysAgo * 86400000 -
        hoursAgo * 3600000 -
        minsAgo * 60000,
    );

    const type = pickWeighted(rng, TYPE_WEIGHTS);
    const description = makeDescription(rng, type);

    events.push({
      id: `evt-${String(i + 1).padStart(3, '0')}`,
      type,
      supplierId: supplier.id,
      supplierName: supplier.name,
      timestamp: ts.toISOString(),
      description,
    });
  }

  // Sort descending by timestamp
  events.sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  return events;
}

export const activityFixture: ActivityEvent[] = generateActivity();
