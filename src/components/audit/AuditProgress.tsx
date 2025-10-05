import React from 'react'
import { AnalysisProgress } from '@/types/audit.types'
import { Loader2, Clock } from 'lucide-react'

interface AuditProgressProps {
  progress?: AnalysisProgress | null
  isAnalyzing?: boolean
}

/**
 * Component for displaying audit analysis progress
 */
const AuditProgress: React.FC<AuditProgressProps> = ({
  progress,
  isAnalyzing = false
}) => {
  if (!isAnalyzing && !progress) {
    return null
  }

  const progressValue = progress?.progress || 0
  const step = progress?.step || 'Initializing'
  const message = progress?.message || 'Starting analysis...'
  const estimatedTime = progress?.estimatedTime

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span className="font-medium text-foreground">Analyzing Contract</span>
        </div>
        
        {estimatedTime && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>~{estimatedTime}s remaining</span>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">{step}</span>
          <span className="font-mono text-primary">{Math.round(progressValue)}%</span>
        </div>
        
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, progressValue))}%` }}
          />
        </div>
      </div>

      {/* Current step message */}
      <p className="text-sm text-muted-foreground">
        {message}
      </p>

      {/* Progress steps indicator */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className={`flex items-center gap-1 ${
          progressValue >= 20 ? 'text-green-400' : 'text-muted-foreground'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            progressValue >= 20 ? 'bg-green-400' : 'bg-muted-foreground/30'
          }`} />
          <span>Parse</span>
        </div>
        
        <div className={`flex items-center gap-1 ${
          progressValue >= 50 ? 'text-green-400' : 'text-muted-foreground'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            progressValue >= 50 ? 'bg-green-400' : 'bg-muted-foreground/30'
          }`} />
          <span>Analyze</span>
        </div>
        
        <div className={`flex items-center gap-1 ${
          progressValue >= 80 ? 'text-green-400' : 'text-muted-foreground'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            progressValue >= 80 ? 'bg-green-400' : 'bg-muted-foreground/30'
          }`} />
          <span>Report</span>
        </div>
        
        <div className={`flex items-center gap-1 ${
          progressValue >= 100 ? 'text-green-400' : 'text-muted-foreground'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            progressValue >= 100 ? 'bg-green-400' : 'bg-muted-foreground/30'
          }`} />
          <span>Complete</span>
        </div>
      </div>
    </div>
  )
}

export default AuditProgress
