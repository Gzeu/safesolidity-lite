export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Vulnerability {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  line: number | null;
  snippet?: string;
}

export interface AuditResult {
  meta: { engine: 'rule-based' };
  vulnerabilities: Vulnerability[];
}
