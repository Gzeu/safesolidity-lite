import { AuditResults, ContractMetadata, CodeQualityMetrics, AuditStatus } from '@/types/audit.types'
import { Vulnerability, VulnerabilitySeverity, VulnerabilityCategory, VulnerabilitySummary } from '@/types/vulnerability.types'

/**
 * Analyze Solidity contract code for vulnerabilities
 */
export async function analyzeContract(
  code: string
): Promise<AuditResults> {
  const startTime = Date.now()

  // Simulate analysis delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Extract basic metadata from code
  const metadata = extractContractMetadata(code)

  // Run mock vulnerability analysis (replace with actual WASM analysis)
  const vulnerabilities = await performMockAnalysis(code)

  // Calculate summary statistics
  const summary = calculateVulnerabilitySummary(vulnerabilities)

  // Generate recommendations
  const recommendations = generateSecurityRecommendations(vulnerabilities)

  // Calculate code quality metrics
  const quality = calculateCodeQuality(code, vulnerabilities)

  const duration = Date.now() - startTime

  return {
    status: AuditStatus.COMPLETED,
    vulnerabilities,
    summary,
    metadata: {
      ...metadata,
      analysisTimestamp: new Date(),
      duration
    },
    quality,
    recommendations,
    engines: [
      {
        name: 'Mock Analysis Engine',
        version: '1.0.0',
        enabled: true,
        wasmPath: '/wasm/slither-wasm.wasm'
      }
    ]
  }
}

/**
 * Extract basic metadata from Solidity contract code
 */
function extractContractMetadata(code: string): Omit<ContractMetadata, 'analysisTimestamp' | 'duration'> {
  const lines = code.split('\n').length
  const size = new Blob([code]).size

  // Simple regex patterns to extract basic info
  const contractMatch = code.match(/contract\s+(\w+)/i)
  const pragmaMatch = code.match(/pragma\s+solidity\s+([^;]+)/i)

  return {
    name: contractMatch ? contractMatch[1] : undefined,
    version: pragmaMatch ? pragmaMatch[1].trim() : undefined,
    compiler: pragmaMatch ? pragmaMatch[1].trim() : undefined,
    size,
    linesOfCode: lines,
    functions: (code.match(/function\s+\w+/g) || []).length,
    complexity: Math.floor(lines / 10) // Simple complexity estimate
  }
}

/**
 * Perform mock vulnerability analysis (replace with actual WASM implementation)
 */
async function performMockAnalysis(code: string): Promise<Vulnerability[]> {
  const vulnerabilities: Vulnerability[] = []

  // Mock reentrancy detection
  if (code.includes('call.value') && !code.includes('Checks-Effects-Interactions')) {
    vulnerabilities.push({
      id: 'reentrancy-001',
      title: 'Potential Reentrancy Vulnerability',
      description: 'External call with value transfer detected without following Checks-Effects-Interactions pattern.',
      severity: VulnerabilitySeverity.HIGH,
      category: VulnerabilityCategory.REENTRANCY,
      location: {
        line: code.includes('call.value') ? findLineNumber(code, 'call.value') : 1,
        column: 1
      },
      recommendation: 'Follow the Checks-Effects-Interactions pattern: check conditions first, then update state, finally make external calls.',
      confidence: 85,
      references: ['https://docs.soliditylang.org/en/latest/security-considerations.html#reentrancy']
    })
  }

  // Mock integer overflow detection
  if (code.includes('uint') && code.includes('+') && !code.includes('SafeMath') && !code.includes('using SafeMath')) {
    vulnerabilities.push({
      id: 'overflow-001',
      title: 'Potential Integer Overflow',
      description: 'Arithmetic operations on uint types without overflow protection detected.',
      severity: VulnerabilitySeverity.MEDIUM,
      category: VulnerabilityCategory.INTEGER_OVERFLOW,
      location: {
        line: findLineNumber(code, '+'),
        column: 1
      },
      recommendation: 'Use SafeMath library or Solidity 0.8+ with built-in overflow checks.',
      confidence: 75,
      references: ['https://docs.soliditylang.org/en/latest/security-considerations.html#integer-overflow']
    })
  }

  // Mock access control detection
  if (code.includes('function') && code.includes('public') && !code.includes('onlyOwner') && !code.includes('modifier onlyOwner')) {
    vulnerabilities.push({
      id: 'access-control-001',
      title: 'Missing Access Control',
      description: 'Public functions detected without proper access control modifiers.',
      severity: VulnerabilitySeverity.MEDIUM,
      category: VulnerabilityCategory.ACCESS_CONTROL,
      location: {
        line: findLineNumber(code, 'function'),
        column: 1
      },
      recommendation: 'Add access control modifiers like onlyOwner to sensitive functions.',
      confidence: 70
    })
  }

  return vulnerabilities
}

/**
 * Find line number of first occurrence of a pattern
 */
function findLineNumber(code: string, pattern: string): number {
  const lines = code.split('\n')
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(pattern)) {
      return i + 1
    }
  }
  return 1
}

/**
 * Calculate vulnerability summary statistics
 */
function calculateVulnerabilitySummary(vulnerabilities: Vulnerability[]): VulnerabilitySummary {
  const summary = {
    total: vulnerabilities.length,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    info: 0,
    riskScore: 0
  }

  vulnerabilities.forEach(vuln => {
    switch (vuln.severity) {
      case VulnerabilitySeverity.CRITICAL:
        summary.critical++
        break
      case VulnerabilitySeverity.HIGH:
        summary.high++
        break
      case VulnerabilitySeverity.MEDIUM:
        summary.medium++
        break
      case VulnerabilitySeverity.LOW:
        summary.low++
        break
      case VulnerabilitySeverity.INFO:
        summary.info++
        break
    }
  })

  // Calculate risk score (0-100)
  const weights = { critical: 25, high: 15, medium: 8, low: 3, info: 1 }
  summary.riskScore = Math.min(100,
    (summary.critical * weights.critical) +
    (summary.high * weights.high) +
    (summary.medium * weights.medium) +
    (summary.low * weights.low) +
    (summary.info * weights.info)
  )

  return summary
}

/**
 * Generate security recommendations based on findings
 */
function generateSecurityRecommendations(vulnerabilities: Vulnerability[]): string[] {
  const recommendations = new Set<string>()

  vulnerabilities.forEach(vuln => {
    if (vuln.recommendation) {
      recommendations.add(vuln.recommendation)
    }
  })

  // Add general recommendations
  if (vulnerabilities.length === 0) {
    recommendations.add('Contract passed all security checks. Continue with regular security audits.')
  }

  if (vulnerabilities.some(v => v.category === VulnerabilityCategory.REENTRANCY)) {
    recommendations.add('Always follow the Checks-Effects-Interactions pattern for external calls.')
  }

  if (vulnerabilities.some(v => v.category === VulnerabilityCategory.INTEGER_OVERFLOW)) {
    recommendations.add('Use SafeMath library or Solidity 0.8+ for arithmetic operations.')
  }

  recommendations.add('Regular security audits and code reviews are recommended.')
  recommendations.add('Consider using automated security tools in your CI/CD pipeline.')

  return Array.from(recommendations)
}

/**
 * Calculate basic code quality metrics
 */
function calculateCodeQuality(code: string, vulnerabilities: Vulnerability[]): CodeQualityMetrics {
  const lines = code.split('\n').length
  const complexity = Math.floor(lines / 10)

  // Calculate maintainability index (simplified)
  const maintainabilityIndex = Math.max(0, 100 - (complexity / 2) - (vulnerabilities.length * 5))

  return {
    complexity,
    maintainabilityIndex: Math.round(maintainabilityIndex),
    documentation: code.includes('//') || code.includes('/*') ? 60 : 30,
    gasEfficiency: 75 // Placeholder - would need actual gas analysis
  }
}
