import { Vulnerability, VulnerabilitySummary } from './vulnerability.types'

/**
 * Audit process status
 */
export enum AuditStatus {
  IDLE = 'idle',
  INITIALIZING = 'initializing',
  ANALYZING = 'analyzing',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

/**
 * Analysis engine information
 */
export interface AnalysisEngine {
  name: string
  version: string
  enabled: boolean
  wasmPath?: string
}

/**
 * Contract analysis metadata
 */
export interface ContractMetadata {
  name?: string
  version?: string
  compiler?: string
  size: number // bytes
  linesOfCode: number
  functions: number
  complexity?: number
  analysisTimestamp: Date
  duration: number // milliseconds
}

/**
 * Code quality metrics
 */
export interface CodeQualityMetrics {
  complexity: number
  maintainabilityIndex: number
  testCoverage?: number
  documentation?: number
  gasEfficiency?: number
}

/**
 * Complete audit results
 */
export interface AuditResults {
  status: AuditStatus
  vulnerabilities: Vulnerability[]
  summary: VulnerabilitySummary
  metadata: ContractMetadata
  quality?: CodeQualityMetrics
  recommendations: string[]
  engines: AnalysisEngine[]
  error?: string
}

/**
 * Export format options
 */
export enum ExportFormat {
  MARKDOWN = 'markdown',
  JSON = 'json',
  HTML = 'html',
  PDF = 'pdf'
}

/**
 * Report generation options
 */
export interface ReportOptions {
  format: ExportFormat
  includeCode: boolean
  includeRecommendations: boolean
  includeMetadata: boolean
  severityFilter?: string[]
  timestamp: boolean
  branding: boolean
}

/**
 * Generated report structure
 */
export interface AuditReport {
  title: string
  timestamp: Date
  results: AuditResults
  content: string
  filename: string
  mimeType: string
}

/**
 * Analysis progress information
 */
export interface AnalysisProgress {
  step: string
  progress: number // 0-100
  message: string
  estimatedTime?: number
}
