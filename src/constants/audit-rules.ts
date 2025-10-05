export type VulnerabilitySeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface AuditRule {
  id: string;
  enabled: boolean;
  severity: VulnerabilitySeverity;
}

export const auditRules: Record<string, AuditRule> = {
  REENTRANCY: { id: 'REENTRANCY', enabled: true, severity: 'CRITICAL' },
  TX_ORIGIN: { id: 'TX_ORIGIN', enabled: true, severity: 'HIGH' },
  TIMESTAMP: { id: 'TIMESTAMP', enabled: true, severity: 'MEDIUM' },
  UNCHECKED_CALL: { id: 'UNCHECKED_CALL', enabled: true, severity: 'HIGH' },
  ARITH_OVERFLOW: { id: 'ARITH_OVERFLOW', enabled: true, severity: 'HIGH' },
};
