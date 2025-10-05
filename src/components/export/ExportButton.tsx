import React, { useState } from 'react'
import { Download, FileText, ChevronDown } from 'lucide-react'
import { AuditResults } from '@/types/audit.types'
import { generateReport } from '@/utils/report-formatter'
import { ExportFormat } from '@/types/audit.types'

interface ExportButtonProps {
  results: AuditResults
  className?: string
}

/**
 * Export button component for audit reports
 */
export const ExportButton: React.FC<ExportButtonProps> = ({ results, className = '' }) => {
  const [isExporting, setIsExporting] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  /**
   * Handle report export in specified format
   */
  const handleExport = async (format: ExportFormat) => {
    setIsExporting(true)
    setShowDropdown(false)

    try {
      const options = {
        format,
        includeCode: true,
        includeRecommendations: true,
        includeMetadata: true,
        severityFilter: [],
        timestamp: true,
        branding: true
      }

      const report = generateReport(results, options)

      // Create download link
      const blob = new Blob([report.content], { type: report.mimeType })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = report.filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

    } catch (error) {
      console.error('Export failed:', error)
      // Could show a toast notification here
    } finally {
      setIsExporting(false)
    }
  }

  /**
   * Handle dropdown toggle
   */
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown)
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={toggleDropdown}
        disabled={isExporting}
        className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download className="h-4 w-4" />
        <span>{isExporting ? 'Exporting...' : 'Export'}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
      </button>

      {showDropdown && (
        <div className="absolute top-full right-0 mt-1 w-48 bg-card border border-border rounded-md shadow-lg z-10">
          <div className="py-1">
            <button
              onClick={() => handleExport(ExportFormat.MARKDOWN)}
              className="w-full text-left px-4 py-2 hover:bg-muted flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Export as Markdown
            </button>

            <button
              onClick={() => handleExport(ExportFormat.JSON)}
              className="w-full text-left px-4 py-2 hover:bg-muted flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Export as JSON
            </button>

            <button
              onClick={() => handleExport(ExportFormat.HTML)}
              className="w-full text-left px-4 py-2 hover:bg-muted flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Export as HTML
            </button>
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  )
}
