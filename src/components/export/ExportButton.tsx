import React from 'react'
import { AuditResults, ExportFormat } from '@/types/audit.types'
import { useReportExport } from '@/hooks/useReportExport'
import { Download, FileText, Code, Loader2 } from 'lucide-react'

interface ExportButtonProps {
  results: AuditResults | null
  className?: string
}

/**
 * Component for exporting audit results in various formats
 */
const ExportButton: React.FC<ExportButtonProps> = ({
  results,
  className = ''
}) => {
  const { 
    isExporting, 
    exportError, 
    exportProgress,
    exportReport,
    clearExportError 
  } = useReportExport()

  if (!results || results.vulnerabilities.length === 0) {
    return null
  }

  const handleExport = async (format: ExportFormat) => {
    if (exportError) {
      clearExportError()
    }

    const options = {
      format,
      includeCode: true,
      includeRecommendations: true,
      includeMetadata: true,
      timestamp: true,
      branding: true
    }

    await exportReport(results, options)
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Export buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleExport(ExportFormat.MARKDOWN)}
          disabled={isExporting}
          className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-colors"
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileText className="h-4 w-4" />
          )}
          Export Markdown
        </button>
        
        <button
          onClick={() => handleExport(ExportFormat.JSON)}
          disabled={isExporting}
          className="flex items-center gap-2 px-3 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-colors"
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Code className="h-4 w-4" />
          )}
          Export JSON
        </button>
        
        <button
          onClick={() => handleExport(ExportFormat.HTML)}
          disabled={isExporting}
          className="flex items-center gap-2 px-3 py-2 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-colors"
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Export HTML
        </button>
      </div>

      {/* Progress bar during export */}
      {isExporting && exportProgress > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Generating report...</span>
            <span className="font-mono text-primary">{Math.round(exportProgress)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-200"
              style={{ width: `${Math.min(100, Math.max(0, exportProgress))}%` }}
            />
          </div>
        </div>
      )}

      {/* Error display */}
      {exportError && (
        <div className="bg-destructive/10 border border-destructive/20 rounded p-3">
          <p className="text-sm text-destructive">
            <strong>Export failed:</strong> {exportError}
          </p>
          <button
            onClick={clearExportError}
            className="text-xs text-destructive hover:underline mt-1"
          >
            Clear error
          </button>
        </div>
      )}

      {/* Export info */}
      <div className="text-xs text-muted-foreground">
        <p>
          Report includes {results.vulnerabilities.length} findings 
          • Analysis completed in {results.metadata.duration}ms
        </p>
      </div>
    </div>
  )
}

export { ExportButton }
export default ExportButton
