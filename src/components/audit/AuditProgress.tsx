import React from 'react'
import { Loader2, Shield } from 'lucide-react'

interface AuditProgressProps {
  progress?: number
  message?: string
  className?: string
}

/**
 * Progress component for audit analysis
 */
const AuditProgress: React.FC<AuditProgressProps> = ({
  progress = 0,
  message = 'Analyzing contract...',
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center h-full text-center p-8 ${className}`}>
      {/* Animated Shield Icon */}
      <div className="relative mb-6">
        <Shield className="h-16 w-16 text-primary animate-pulse" />
        <div className="absolute inset-0 h-16 w-16 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-xs mb-4">
        <div className="bg-muted rounded-full h-2 mb-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {Math.round(progress)}% Complete
        </div>
      </div>

      {/* Progress Message */}
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>{message}</span>
      </div>

      {/* Analysis Steps */}
      <div className="mt-6 text-sm text-muted-foreground space-y-1">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${progress >= 25 ? 'bg-green-400' : 'bg-muted'}`} />
          <span>Parsing Solidity code</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${progress >= 50 ? 'bg-green-400' : 'bg-muted'}`} />
          <span>Running security analysis</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${progress >= 75 ? 'bg-green-400' : 'bg-muted'}`} />
          <span>Generating report</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${progress >= 100 ? 'bg-green-400' : 'bg-muted'}`} />
          <span>Complete</span>
        </div>
      </div>
    </div>
  )
}

export default AuditProgress
