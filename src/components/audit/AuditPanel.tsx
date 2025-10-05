import React from 'react'
import { AuditResults } from '@/types/audit.types'
import VulnerabilityList from './VulnerabilityList'
import AuditProgress from './AuditProgress'
import { ExportButton } from '../export/ExportButton'
import { AlertCircle, Shield, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react'

interface AuditPanelProps {
  results: AuditResults | null
  isAnalyzing: boolean
  error: string | null
}

/**
 * Main audit results panel component
 */
const AuditPanel: React.FC<AuditPanelProps> = ({
  results,
  isAnalyzing,
  error
}) => {
  /**
   * Render empty state when no results
   */
  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <Shield className="h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">No Analysis Results</h3>
      <p className="text-muted-foreground mb-4">
        Enter Solidity code in the editor and click "Analyze Contract" to begin security analysis.
      </p>
      <div className="text-sm text-muted-foreground space-y-1">
        <p>• Detects common vulnerabilities (reentrancy, overflow, etc.)</p>
        <p>• Provides security recommendations</p>
        <p>• Exports results in multiple formats</p>
      </div>
    </div>
  )

  /**
   * Render error state
   */
  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <XCircle className="h-16 w-16 text-destructive mb-4" />
      <h3 className="text-lg font-semibold mb-2">Analysis Failed</h3>
      <p className="text-destructive mb-4">{error}</p>
      <div className="text-sm text-muted-foreground">
        <p>Common solutions:</p>
        <ul className="mt-2 space-y-1 text-left">
          <li>• Check that the Solidity code is valid</li>
          <li>• Ensure the contract size is within limits</li>
          <li>• Try refreshing the page to reload WASM modules</li>
        </ul>
      </div>
    </div>
  )

  /**
   * Render vulnerability summary statistics
   */
  const renderSummaryStats = () => {
    if (!results?.summary) return null

    const { summary } = results
    const riskLevel = getRiskLevel(summary.riskScore)

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Issues</p>
              <p className="text-2xl font-bold">{summary.total}</p>
            </div>
            <AlertCircle className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
        
        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Risk Score</p>
              <p className="text-2xl font-bold">{summary.riskScore}</p>
            </div>
            <TrendingUp className={`h-5 w-5 ${getRiskColor(riskLevel)}`} />
          </div>
          <p className={`text-xs mt-1 ${getRiskColor(riskLevel)}`}>
            {riskLevel.toUpperCase()} RISK
          </p>
        </div>
        
        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Critical</p>
              <p className="text-2xl font-bold text-red-400">{summary.critical}</p>
            </div>
            <div className="h-3 w-3 bg-red-500 rounded-full" />
          </div>
        </div>
        
        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Duration</p>
              <p className="text-2xl font-bold">{formatDuration(results.metadata.duration)}</p>
            </div>
            <Clock className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </div>
    )
  }

  /**
   * Render successful analysis results
   */
  const renderResults = () => {
    if (!results) return null

    const hasVulnerabilities = results.vulnerabilities.length > 0

    return (
      <div className="h-full flex flex-col">
        {/* Header with export button */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <span className="font-medium">Analysis Complete</span>
            <span className="text-sm text-muted-foreground">
              ({results.metadata.linesOfCode} lines analyzed)
            </span>
          </div>
          
          <ExportButton results={results} />
        </div>

        {/* Summary statistics */}
        {renderSummaryStats()}

        {/* Vulnerability list or success message */}
        <div className="flex-1 min-h-0">
          {hasVulnerabilities ? (
            <VulnerabilityList vulnerabilities={results.vulnerabilities} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <CheckCircle className="h-16 w-16 text-green-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Vulnerabilities Found</h3>
              <p className="text-muted-foreground">
                Great! Your smart contract passed all security checks.
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  /**
   * Get risk level based on risk score
   */
  const getRiskLevel = (score: number): string => {
    if (score >= 80) return 'critical'
    if (score >= 60) return 'high'
    if (score >= 40) return 'medium'
    if (score >= 20) return 'low'
    return 'minimal'
  }

  /**
   * Get color class for risk level
   */
  const getRiskColor = (level: string): string => {
    switch (level) {
      case 'critical': return 'text-red-400'
      case 'high': return 'text-orange-400'
      case 'medium': return 'text-yellow-400'
      case 'low': return 'text-blue-400'
      default: return 'text-green-400'
    }
  }

  /**
   * Format duration in milliseconds to readable string
   */
  const formatDuration = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`
    const seconds = Math.round(ms / 100) / 10
    return `${seconds}s`
  }

  // Main render logic
  if (isAnalyzing) {
    return (
      <div className="h-full p-4">
        <AuditProgress />
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full p-4">
        {renderErrorState()}
      </div>
    )
  }

  if (!results) {
    return (
      <div className="h-full p-4">
        {renderEmptyState()}
      </div>
    )
  }

  return (
    <div className="h-full p-4">
      {renderResults()}
    </div>
  )
}

export default AuditPanel
