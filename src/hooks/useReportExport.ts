import { useState, useCallback } from 'react'
import { AuditResults, ExportFormat, ReportOptions, AuditReport } from '@/types/audit.types'
import { generateReport } from '@/utils/report-formatter'

interface UseReportExportReturn {
  isExporting: boolean
  exportError: string | null
  exportProgress: number
  exportReport: (results: AuditResults, options: ReportOptions) => Promise<void>
  downloadReport: (report: AuditReport) => void
  clearExportError: () => void
}

/**
 * Hook for exporting audit reports in various formats
 */
export const useReportExport = (): UseReportExportReturn => {
  const [isExporting, setIsExporting] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)
  const [exportProgress, setExportProgress] = useState(0)

  /**
   * Update export progress
   */
  const updateExportProgress = useCallback((progress: number) => {
    setExportProgress(Math.min(100, Math.max(0, progress)))
  }, [])

  /**
   * Export audit results as report
   */
  const exportReport = useCallback(async (results: AuditResults, options: ReportOptions) => {
    try {
      setIsExporting(true)
      setExportError(null)
      updateExportProgress(0)

      if (!results || !results.vulnerabilities) {
        throw new Error('No audit results to export')
      }

      updateExportProgress(20)

      // Generate report content
      const report = await generateReport(results, options)
      
      updateExportProgress(70)
      
      // Simulate processing time for complex formats
      if (options.format === ExportFormat.PDF) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      
      updateExportProgress(90)
      
      // Auto-download the report
      downloadReport(report)
      
      updateExportProgress(100)
      
      // Clear progress after success
      setTimeout(() => updateExportProgress(0), 1500)
      
    } catch (error) {
      console.error('Export failed:', error)
      setExportError(error instanceof Error ? error.message : 'Export failed')
      updateExportProgress(0)
    } finally {
      setIsExporting(false)
    }
  }, [updateExportProgress])

  /**
   * Download generated report file
   */
  const downloadReport = useCallback((report: AuditReport) => {
    try {
      let blob: Blob
      
      // Create blob based on format
      switch (report.mimeType) {
        case 'application/json':
          blob = new Blob([report.content], { type: 'application/json' })
          break
        case 'text/markdown':
          blob = new Blob([report.content], { type: 'text/markdown' })
          break
        case 'text/html':
          blob = new Blob([report.content], { type: 'text/html' })
          break
        case 'application/pdf':
          // For PDF, content should be base64 encoded
          const binaryString = atob(report.content)
          const bytes = new Uint8Array(binaryString.length)
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i)
          }
          blob = new Blob([bytes], { type: 'application/pdf' })
          break
        default:
          blob = new Blob([report.content], { type: 'text/plain' })
      }
      
      // Create download link
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = report.filename
      
      // Append to body and click (for browser compatibility)
      document.body.appendChild(link)
      link.click()
      
      // Cleanup
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
    } catch (error) {
      console.error('Download failed:', error)
      setExportError('Failed to download report file')
    }
  }, [])

  /**
   * Clear export error state
   */
  const clearExportError = useCallback(() => {
    setExportError(null)
  }, [])

  return {
    isExporting,
    exportError,
    exportProgress,
    exportReport,
    downloadReport,
    clearExportError
  }
}

/**
 * Hook for sharing reports via various channels
 */
export const useReportSharing = () => {
  const [isSharing, setIsSharing] = useState(false)
  const [shareError, setShareError] = useState<string | null>(null)

  const shareToGitHub = useCallback(async (report: AuditReport) => {
    setIsSharing(true)
    try {
      // Implementation for GitHub gist creation
      // This would require GitHub API integration
      console.log('Sharing to GitHub:', report.title)
      
    } catch (error) {
      setShareError('Failed to share to GitHub')
    } finally {
      setIsSharing(false)
    }
  }, [])

  const shareViaEmail = useCallback((report: AuditReport) => {
    try {
      const subject = encodeURIComponent(`Smart Contract Audit Report: ${report.title}`)
      const body = encodeURIComponent(
        `Please find the audit report attached.\n\nReport generated on: ${report.timestamp}\n\nSummary:\n${report.results.summary}`
      )
      
      window.open(`mailto:?subject=${subject}&body=${body}`)
      
    } catch (error) {
      setShareError('Failed to open email client')
    }
  }, [])

  return {
    isSharing,
    shareError,
    shareToGitHub,
    shareViaEmail,
    clearShareError: () => setShareError(null)
  }
}
