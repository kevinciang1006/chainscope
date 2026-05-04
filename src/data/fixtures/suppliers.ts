import { subMonths, addMonths, addDays } from 'date-fns';

import type {
  Supplier,
  Region,
  Industry,
  EsgGrade,
  RiskLevel,
  Tier,
  Certification,
  CertificationStatus,
  ScoreHistoryPoint,
  AuditEntry,
  SupplierMeta,
} from '@/types';

import {
  SEED,
  mulberry32,
  pickWeighted,
  pickN,
  randInt,
  randRange,
  dateMonthsAgo,
  monthKey,
} from '@/data/fixtures/helpers';

// ---------------------------------------------------------------------------
// Company name pool — 88 unique, geographically varied names
// ---------------------------------------------------------------------------

const COMPANY_NAMES: readonly string[] = [
  // Manufacturing (16)
  'Bavarian Steel Works GmbH',
  'São Paulo Heavy Industries',
  'Hokkaido Precision Metals',
  'Lagos Foundry Group',
  'Danube Fabrication AG',
  'Minas Gerais Metal Corp',
  'Osaka Industrial Systems',
  'Accra Rolling Mills',
  'Rhine Forging & Stamping',
  'Monterrey Metalworks SA',
  'Kyushu Component Solutions',
  'Casablanca Heavy Engineering',
  'Gdańsk Structural Steel',
  'Chennai Auto Parts Ltd',
  'Belo Horizonte Castings',
  'Warsaw Precision Tooling',
  // Apparel (15)
  'Mekong Textile Cooperative',
  'Porto Linen Mills',
  'Atlanta Garment Co.',
  'Hanoi Woven Goods Ltd',
  'Manchester Cotton Works',
  'Dhaka Knitwear Alliance',
  'Istanbul Denim House',
  'Medellín Apparel Group',
  'Ho Chi Minh City Fabrics',
  'Lisbon Heritage Textiles',
  'Nairobi Ethical Fashions',
  'Bogotá Workwear Solutions',
  'Phnom Penh Garments Ltd',
  'Valencia Silk & Linen SA',
  'Accra Fair Stitch Co.',
  // Electronics (15)
  'Shenzhen Precision Industries',
  'Pacific Rim Electronics',
  'Helsinki Microsystems',
  'Busan Semiconductor Group',
  'Hsinchu Circuit Works',
  'Singapore Optoelectronics',
  'Nagoya Display Components',
  'Penang Advanced Electronics',
  'Seoul Sensor Technologies',
  'Stockholm Smart Devices',
  'Eindhoven Embedded Systems',
  'Guangzhou PCB Solutions',
  'Kuala Lumpur Chip Assembly',
  'Yokohama Power Electronics',
  'Munich Automotive Electronics GmbH',
  // Agriculture (14)
  'Cotopaxi Agro SA',
  'Kentish Orchards Ltd',
  'Songkhla Rice Collective',
  'Mato Grosso Soy Partners',
  'Hokkaido Dairy Cooperative',
  'Ghana Cocoa Growers Alliance',
  'Andalucía Olive & Wine Group',
  'Chiang Mai Tropical Produce',
  'Paraná Grain Exporters',
  'Kenya Tea Estates Ltd',
  'Loire Valley Vineyards',
  'Punjab Wheat Trading Co.',
  'Minas Gerais Coffee Guild',
  'Nile Delta Agriculture SA',
  // Logistics (14)
  'Norfolk Logistics Holdings',
  'Suez Maritime Logistics',
  'Andes Freight Network',
  'Rotterdam Distribution BV',
  'Laem Chabang Forwarding Co.',
  'Lagos Port Logistics Ltd',
  'São Paulo Last-Mile Solutions',
  'Hamburg Cold Chain GmbH',
  'Manila Freight Alliance',
  'Cape Town Cargo Services',
  'Busan Container Lines',
  'Auckland Pacific Freight',
  'Dubai Trade Logistics FZCO',
  'Veracruz Port Operators SA',
  // Chemicals (14)
  'Rhine Valley Chemicals AG',
  'Gulf Coast Polymers',
  'Yangtze Specialty Chemicals',
  'BASF-Rhein Intermediates GmbH',
  'Jurong Island Chemical Corp',
  'Tarragona Fine Chemicals SA',
  'Ulsan Petrochemical Alliance',
  'Texas Specialty Resins LLC',
  'Suzhou Advanced Materials',
  'Rotterdam Oleochemicals BV',
  'Cartagena Agrochemicals SA',
  'Ludwigshafen Coating Systems',
  'Zibo Industrial Solvents',
  'Mumbai Specialty Pharma Chem',
];

// ---------------------------------------------------------------------------
// Region → countries mapping
// ---------------------------------------------------------------------------

type CountryInfo = { name: string; code: string };

const REGION_COUNTRIES: Record<Region, readonly CountryInfo[]> = {
  'Southeast Asia': [
    { name: 'Vietnam', code: 'VN' },
    { name: 'Thailand', code: 'TH' },
    { name: 'Malaysia', code: 'MY' },
    { name: 'Indonesia', code: 'ID' },
    { name: 'Philippines', code: 'PH' },
    { name: 'Cambodia', code: 'KH' },
    { name: 'Singapore', code: 'SG' },
  ],
  'East Asia': [
    { name: 'China', code: 'CN' },
    { name: 'Japan', code: 'JP' },
    { name: 'South Korea', code: 'KR' },
    { name: 'Taiwan', code: 'TW' },
  ],
  'Europe': [
    { name: 'Germany', code: 'DE' },
    { name: 'Netherlands', code: 'NL' },
    { name: 'Finland', code: 'FI' },
    { name: 'Poland', code: 'PL' },
    { name: 'Portugal', code: 'PT' },
    { name: 'Spain', code: 'ES' },
    { name: 'Sweden', code: 'SE' },
    { name: 'United Kingdom', code: 'GB' },
    { name: 'France', code: 'FR' },
    { name: 'Turkey', code: 'TR' },
  ],
  'North America': [
    { name: 'United States', code: 'US' },
    { name: 'Canada', code: 'CA' },
    { name: 'Mexico', code: 'MX' },
  ],
  'South America': [
    { name: 'Brazil', code: 'BR' },
    { name: 'Colombia', code: 'CO' },
    { name: 'Ecuador', code: 'EC' },
    { name: 'Argentina', code: 'AR' },
    { name: 'Chile', code: 'CL' },
    { name: 'Peru', code: 'PE' },
  ],
  'Africa': [
    { name: 'Ghana', code: 'GH' },
    { name: 'Nigeria', code: 'NG' },
    { name: 'Kenya', code: 'KE' },
    { name: 'South Africa', code: 'ZA' },
    { name: 'Egypt', code: 'EG' },
    { name: 'Morocco', code: 'MA' },
  ],
};

// ---------------------------------------------------------------------------
// ESG rating weights → target distribution over 80 suppliers
// ---------------------------------------------------------------------------

const RATING_WEIGHTS: { value: EsgGrade; weight: number }[] = [
  { value: 'AAA', weight: 10 },
  { value: 'AA', weight: 18 },
  { value: 'A', weight: 22 },
  { value: 'BBB', weight: 22 },
  { value: 'BB', weight: 14 },
  { value: 'B', weight: 8 },
  { value: 'CCC', weight: 4 },
  { value: 'D', weight: 2 },
];

// Base mean scores per rating band
const RATING_SCORE_MEAN: Record<EsgGrade, number> = {
  AAA: 92,
  AA: 83,
  A: 77,
  BBB: 68,
  BB: 58,
  B: 48,
  CCC: 37,
  D: 25,
};

// Base risk per rating
const RATING_BASE_RISK: Record<EsgGrade, RiskLevel> = {
  AAA: 'Low',
  AA: 'Low',
  A: 'Low',
  BBB: 'Medium',
  BB: 'Medium',
  B: 'High',
  CCC: 'High',
  D: 'Critical',
};

const RISK_LEVELS: readonly RiskLevel[] = ['Low', 'Medium', 'High', 'Critical'];

function riskLevelIndex(r: RiskLevel): number {
  return RISK_LEVELS.indexOf(r);
}

function riskLevelFromIndex(i: number): RiskLevel {
  const clamped = Math.max(0, Math.min(RISK_LEVELS.length - 1, i));
  return RISK_LEVELS[clamped] ?? 'Medium';
}

function deriveRiskLevel(rng: () => number, rating: EsgGrade): RiskLevel {
  const base = RATING_BASE_RISK[rating];
  const baseIdx = riskLevelIndex(base);
  const roll = rng();
  // ~15% chance shift up (worse), ~10% chance shift down (better)
  let shift = 0;
  if (roll < 0.10) shift = -1;
  else if (roll < 0.25) shift = 1;
  return riskLevelFromIndex(baseIdx + shift);
}

// ---------------------------------------------------------------------------
// Tier weights
// ---------------------------------------------------------------------------

const TIER_WEIGHTS: { value: Tier; weight: number }[] = [
  { value: 'Tier 1', weight: 40 },
  { value: 'Tier 2', weight: 40 },
  { value: 'Tier 3', weight: 20 },
];

// ---------------------------------------------------------------------------
// Certifications
// ---------------------------------------------------------------------------

const CERT_NAMES = [
  'ISO 14001',
  'ISO 45001',
  'B Corp',
  'Fair Trade',
  'FSC',
  'RSPO',
  'GOTS',
  'SA8000',
  'GRS',
  'EcoVadis Gold',
  'EcoVadis Silver',
  'EcoVadis Bronze',
] as const;

const REFERENCE = new Date('2026-05-01T00:00:00.000Z');

function makeCertification(rng: () => number, idx: number, certName: string): Certification {
  const yearsAgo = randInt(rng, 1, 4);
  const issuedDate = subMonths(REFERENCE, yearsAgo * 12 + randInt(rng, 0, 6));
  const expiryMonthsFromNow = randInt(rng, -6, 24);
  const expiryDate = addMonths(REFERENCE, expiryMonthsFromNow);

  let status: CertificationStatus;
  if (expiryDate < REFERENCE) {
    status = 'expired';
  } else {
    const daysUntilExpiry = (expiryDate.getTime() - REFERENCE.getTime()) / (1000 * 60 * 60 * 24);
    status = daysUntilExpiry <= 90 ? 'expiring' : 'active';
  }

  return {
    id: `cert-${String(idx).padStart(4, '0')}`,
    name: certName,
    issuedDate: issuedDate.toISOString().slice(0, 10),
    expiryDate: expiryDate.toISOString().slice(0, 10),
    status,
  };
}

// ---------------------------------------------------------------------------
// Audit types, auditors, notes
// ---------------------------------------------------------------------------

const AUDIT_TYPES = [
  'Internal Review',
  'On-site Audit',
  'Third-party ESG Audit',
  'Compliance Check',
  'Tier-2 Audit',
] as const;

const AUDITORS = [
  'Bureau Veritas',
  'SGS',
  'DNV',
  'TÜV SÜD',
  'Internal Team',
  'ERM Group',
  'Intertek',
  'LRQA',
] as const;

const AUDIT_NOTES: readonly string[] = [
  'No major non-conformities identified; minor corrective actions issued for documentation gaps.',
  'Water treatment systems verified compliant with local discharge standards.',
  'Worker safety signage updated; PPE compliance rate improved to 97%.',
  'Scope-1 emissions data validated against site energy meters; minor discrepancy resolved.',
  'Supply chain mapping completed for upstream Tier-2 materials.',
  'Governance structure reviewed; board ESG committee charter ratified.',
  'Waste segregation procedures confirmed; landfill diversion rate at 84%.',
  'Chemical storage audit completed; REACH substance inventory updated.',
  'Audit found overtime hours within legal limits; wage records verified.',
  'Corrective action plan from prior audit verified as closed.',
  'Renewable energy transition roadmap presented; solar installation on schedule.',
  'Third-party code-of-conduct training attendance confirmed at 100% for production staff.',
  'Living wage benchmark review completed; gap analysis shared with management.',
  'Fire safety systems inspected and recertified for another two years.',
  'Grievance mechanism usage reviewed; one open case under investigation.',
];

// ---------------------------------------------------------------------------
// Key risks pool
// ---------------------------------------------------------------------------

const KEY_RISKS_POOL: readonly string[] = [
  'Water consumption 18% above industry median',
  'Pending Tier-2 labor audit',
  'Reliance on single-source raw material',
  'Diesel scope-1 emissions trending up YoY',
  'Audit overdue by 3 months',
  'Recent governance restructuring under review',
  'Worker safety incidents flagged in latest audit',
  'Supplier of concern in upstream Tier-3 chain',
  'High exposure to monsoon-driven shipping delays',
  'Restricted-substance compliance gap (REACH)',
  'Carbon footprint disclosure not yet third-party verified',
  'Elevated waste-water discharge variance noted in Q3 audit',
  'Gender pay gap disclosure pending regulatory deadline',
  'Conflict minerals traceability not yet mapped below Tier 2',
  'Excessive subcontracting without prior notification',
  'Energy intensity 22% above peer group benchmark',
  'Board independence below recommended threshold',
  'Social insurance contributions irregularities under review',
];

// Suppliers with worse ratings get more / harsher risks
function pickKeyRisks(rng: () => number, rating: EsgGrade): string[] {
  const ratingIndex = ['AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'CCC', 'D'].indexOf(rating);
  // AAA→1 risk, AA→1-2, A→1-2, BBB→2-3, BB→2-3, B→3-4, CCC→3-4, D→4
  const minRisks = ratingIndex < 3 ? 1 : ratingIndex < 5 ? 2 : 3;
  const maxRisks = ratingIndex < 2 ? 1 : ratingIndex < 4 ? 2 : ratingIndex < 6 ? 3 : 4;
  const n = randInt(rng, minRisks, maxRisks);
  return pickN(rng, KEY_RISKS_POOL, n);
}

// ---------------------------------------------------------------------------
// Score history — random walk
// ---------------------------------------------------------------------------

function makeScoreHistory(
  rng: () => number,
  finalE: number,
  finalS: number,
  finalG: number,
): ScoreHistoryPoint[] {
  const points: ScoreHistoryPoint[] = [];
  // Walk backward from final score 11 months, then forward
  const stepE = () => randRange(rng, -3.5, 3.5);
  const stepS = () => randRange(rng, -3.5, 3.5);
  const stepG = () => randRange(rng, -3.5, 3.5);

  // Build 12 intermediate E/S/G values via a backwards walk from final
  const eArr: number[] = [finalE];
  const sArr: number[] = [finalS];
  const gArr: number[] = [finalG];

  for (let i = 1; i < 12; i++) {
    eArr.push(Math.max(10, Math.min(99, (eArr[i - 1] ?? finalE) - stepE())));
    sArr.push(Math.max(10, Math.min(99, (sArr[i - 1] ?? finalS) - stepS())));
    gArr.push(Math.max(10, Math.min(99, (gArr[i - 1] ?? finalG) - stepG())));
  }
  // Reverse so oldest is first
  eArr.reverse();
  sArr.reverse();
  gArr.reverse();

  for (let i = 0; i < 12; i++) {
    const e = Math.round(eArr[i] ?? finalE);
    const s = Math.round(sArr[i] ?? finalS);
    const g = Math.round(gArr[i] ?? finalG);
    const overall = Math.round((e + s + g) / 3);
    const monthDate = subMonths(REFERENCE, 11 - i);
    points.push({ month: monthKey(monthDate), e, s, g, overall });
  }

  return points;
}

// ---------------------------------------------------------------------------
// Audit history
// ---------------------------------------------------------------------------

function makeAuditHistory(rng: () => number, suppId: number): AuditEntry[] {
  const count = randInt(rng, 2, 6);
  const entries: AuditEntry[] = [];
  for (let i = 0; i < count; i++) {
    const daysAgo = randInt(rng, 30, 720);
    const date = addDays(REFERENCE, -daysAgo);
    const typeIdx = Math.floor(rng() * AUDIT_TYPES.length);
    const auditorIdx = Math.floor(rng() * AUDITORS.length);
    const noteIdx = Math.floor(rng() * AUDIT_NOTES.length);
    const scoreChange = randInt(rng, -5, 8);
    entries.push({
      id: `aud-${String(suppId).padStart(3, '0')}-${String(i + 1).padStart(2, '0')}`,
      date: date.toISOString().slice(0, 10),
      type: AUDIT_TYPES[typeIdx] ?? 'Internal Review',
      auditor: AUDITORS[auditorIdx] ?? 'Bureau Veritas',
      scoreChange,
      notes: AUDIT_NOTES[noteIdx] ?? 'Audit completed without major findings.',
    });
  }
  // Sort descending by date
  entries.sort((a, b) => b.date.localeCompare(a.date));
  return entries;
}

// ---------------------------------------------------------------------------
// Meta (revenue, employees, founded, parent)
// ---------------------------------------------------------------------------

function makeMeta(rng: () => number, suppIndex: number): SupplierMeta {
  const empScale = randInt(rng, 1, 10);
  let employees: number;
  if (empScale <= 3) employees = randInt(rng, 100, 999);
  else if (empScale <= 6) employees = randInt(rng, 1000, 9999);
  else if (empScale <= 8) employees = randInt(rng, 10000, 29999);
  else employees = randInt(rng, 30000, 80000);

  const revScale = randInt(rng, 1, 5);
  let revenue: string;
  if (revScale === 1) revenue = `$${randInt(rng, 10, 99)}M`;
  else if (revScale === 2) revenue = `$${randInt(rng, 100, 999)}M`;
  else if (revScale === 3) revenue = `$${(randRange(rng, 1.0, 4.9)).toFixed(1)}B`;
  else if (revScale === 4) revenue = `$${(randRange(rng, 5.0, 19.9)).toFixed(1)}B`;
  else revenue = `$${randInt(rng, 20, 80)}B`;

  const founded = randInt(rng, 1900, 2018);

  const hasParent = rng() < 0.25;
  const parentRegions = [
    'Asia-Pacific', 'European', 'Americas', 'Global', 'Nordic', 'Atlantic',
  ];
  const parentSuffixes = ['Holdings Group', 'Capital Partners', 'Industries Ltd', 'Ventures Corp'];
  const parent = hasParent
    ? `${parentRegions[suppIndex % parentRegions.length] ?? 'Global'} ${parentSuffixes[suppIndex % parentSuffixes.length] ?? 'Holdings Group'}`
    : undefined;

  return { revenue, employees, founded, parent };
}

// ---------------------------------------------------------------------------
// Region and Industry distribution — interleave to guarantee spread
// ---------------------------------------------------------------------------

const REGIONS: readonly Region[] = [
  'Southeast Asia',
  'East Asia',
  'Europe',
  'North America',
  'South America',
  'Africa',
];

const INDUSTRIES: readonly Industry[] = [
  'Manufacturing',
  'Apparel',
  'Electronics',
  'Agriculture',
  'Logistics',
  'Chemicals',
];

// ---------------------------------------------------------------------------
// Main generator
// ---------------------------------------------------------------------------

function generateSuppliers(): Supplier[] {
  const rng = mulberry32(SEED);
  const suppliers: Supplier[] = [];

  // Shuffle the name pool deterministically
  const shuffledNames = pickN(rng, COMPANY_NAMES, COMPANY_NAMES.length);

  let certCounter = 1;

  for (let i = 0; i < 80; i++) {
    // Assign region and industry cycling through all 6 of each → guaranteed spread
    const region: Region = REGIONS[i % REGIONS.length] ?? 'Europe';
    const industry: Industry = INDUSTRIES[Math.floor(i / (80 / INDUSTRIES.length)) % INDUSTRIES.length] ?? 'Manufacturing';

    // Pick country from region
    const countriesForRegion = REGION_COUNTRIES[region];
    const countryIdx = Math.floor(rng() * countriesForRegion.length);
    const country = countriesForRegion[countryIdx] ?? { name: 'Germany', code: 'DE' };

    // Rating
    const esgRating = pickWeighted(rng, RATING_WEIGHTS);

    // Risk level (correlated but noisy)
    const riskLevel = deriveRiskLevel(rng, esgRating);

    // Tier
    const tier = pickWeighted(rng, TIER_WEIGHTS);

    // E/S/G scores — mean from rating, independent variance
    const mean = RATING_SCORE_MEAN[esgRating];
    const e = Math.max(10, Math.min(99, Math.round(mean + randRange(rng, -12, 12))));
    const s = Math.max(10, Math.min(99, Math.round(mean + randRange(rng, -12, 12))));
    const g = Math.max(10, Math.min(99, Math.round(mean + randRange(rng, -12, 12))));

    // Score history
    const scoreHistory: ScoreHistoryPoint[] = makeScoreHistory(rng, e, s, g);

    // Certifications (2–5)
    const numCerts = randInt(rng, 2, 5);
    const certNames = pickN(rng, CERT_NAMES, numCerts);
    const certifications: Certification[] = certNames.map((name) => {
      const cert = makeCertification(rng, certCounter, name);
      certCounter++;
      return cert;
    });

    // Audit history
    const auditHistory: AuditEntry[] = makeAuditHistory(rng, i + 1);

    // Last audit date = most recent entry
    const lastAuditDate = auditHistory[0]?.date ?? dateMonthsAgo(3);

    // Next audit due — 6–18 months after last audit
    const lastAuditDateObj = new Date(lastAuditDate);
    const monthsUntilNext = randInt(rng, 6, 18);
    const nextAuditDue = addMonths(lastAuditDateObj, monthsUntilNext).toISOString().slice(0, 10);

    // Key risks
    const keyRisks: string[] = pickKeyRisks(rng, esgRating);

    // Meta
    const meta: SupplierMeta = makeMeta(rng, i);

    // Name from shuffled pool
    const name = shuffledNames[i] ?? `Supplier ${String(i + 1).padStart(3, '0')}`;

    const id = `sup-${String(i + 1).padStart(3, '0')}`;

    suppliers.push({
      id,
      name,
      country: country.name,
      countryCode: country.code,
      region,
      industry,
      tier,
      esgRating,
      scores: { e, s, g },
      riskLevel,
      lastAuditDate,
      nextAuditDue,
      certifications,
      keyRisks,
      scoreHistory,
      auditHistory,
      meta,
    });
  }

  return suppliers;
}

export const suppliersFixture: Supplier[] = generateSuppliers();
