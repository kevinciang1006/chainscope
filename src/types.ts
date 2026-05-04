export type Tier = 'Tier 1' | 'Tier 2' | 'Tier 3';
export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type EsgGrade = 'AAA' | 'AA' | 'A' | 'BBB' | 'BB' | 'B' | 'CCC' | 'D';
export type Industry = 'Manufacturing' | 'Apparel' | 'Electronics' | 'Agriculture' | 'Logistics' | 'Chemicals';
export type Region = 'Southeast Asia' | 'East Asia' | 'Europe' | 'North America' | 'South America' | 'Africa';
export type CertificationStatus = 'active' | 'expiring' | 'expired';
export type ActivityType = 'audit' | 'score_change' | 'certification' | 'risk_flag';

export interface Certification {
  id: string;
  name: string;
  issuedDate: string;
  expiryDate: string;
  status: CertificationStatus;
}

export interface ScoreHistoryPoint {
  month: string;       // 'YYYY-MM'
  e: number; s: number; g: number; overall: number;
}

export interface AuditEntry {
  id: string; date: string; type: string; auditor: string;
  scoreChange: number; notes: string;
}

export interface SupplierMeta {
  revenue: string; employees: number; founded: number; parent?: string;
}

export interface Supplier {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  region: Region;
  industry: Industry;
  tier: Tier;
  esgRating: EsgGrade;
  scores: { e: number; s: number; g: number };
  riskLevel: RiskLevel;
  lastAuditDate: string;
  nextAuditDue: string;
  certifications: Certification[];
  keyRisks: string[];
  scoreHistory: ScoreHistoryPoint[];
  auditHistory: AuditEntry[];
  meta: SupplierMeta;
}

export interface ActivityEvent {
  id: string; type: ActivityType; supplierId: string; supplierName: string;
  timestamp: string; description: string;
}

export interface SupplierFilters {
  search?: string;
  industries?: Industry[];
  regions?: Region[];
  tiers?: Tier[];
  riskLevels?: RiskLevel[];
  ratings?: EsgGrade[];
}

export interface DashboardKpis {
  totalSuppliers: number; totalDelta: number;
  avgEsgScore: number; avgEsgDelta: number;
  highRiskCount: number; highRiskDelta: number;
  auditsDue: number; auditsDueDelta: number;
}

export interface RiskDistribution {
  level: RiskLevel; count: number; percentage: number;
}
