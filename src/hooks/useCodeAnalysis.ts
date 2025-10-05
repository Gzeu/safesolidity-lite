import { useState, useCallback, useRef } from 'react'
import { AuditResults, AuditStatus, AnalysisProgress } from '@/types/audit.types'
import { analyzeContract } from '@/wasm/analysis-engine'

interface UseCodeAnalysisReturn {
  results: AuditResults | null
  isAnalyzing: boolean
  progress: AnalysisProgress | null
  error: string | null
  analyzeCode: (code: string) => Promise<void>
  cancelAnalysis: () => void
  clearResults: () => void
}

/**
 * Hook for managing smart contract code analysis
 */
export const useCodeAnalysis = (): UseCodeAnalysisReturn => {
  const [results, setResults] = useState<AuditResults | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState<AnalysisProgress | null>(null)
  const [error, setError] = useState<string | null>(null)
  const abortController = useRef<AbortController | null>(null)

  /**
   * Update analysis progress
   */
  const updateProgress = useCallback((step: string, progressValue: number, message: string) => {
    setProgress({
      step,
      progress: Math.min(100, Math.max(0, progressValue)),
      message,
      estimatedTime: progressValue > 0 ? Math.round((100 - progressValue) * 0.5) : undefined
    })
  }, [])

  /**
   * Analyze smart contract code
   */
  const analyzeCode = useCallback(async (code: string) => {
    if (!code.trim()) {
      setError('No code provided for analysis')
      return
    }

    // Cancel any existing analysis
    if (abortController.current) {
      abortController.current.abort()
    }

    abortController.current = new AbortController()
    
    try {
      setIsAnalyzing(true)
      setError(null)
      setResults(null)
      
      updateProgress('Initializing', 0, 'Starting analysis engine...')
      
      // Basic code validation
      if (code.length > (import.meta.env.VITE_MAX_CONTRACT_SIZE || 1048576)) {
        throw new Error('Contract size exceeds maximum limit (1MB)')
      }

      updateProgress('Parsing', 20, 'Parsing Solidity code...')
      
      // Simulate parsing delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      if (abortController.current.signal.aborted) {
        throw new Error('Analysis cancelled')
      }

      updateProgress('Analyzing', 50, 'Running security analysis...')
      
      // Perform actual analysis
      const analysisResults = await analyzeContract(code, {
        timeout: import.meta.env.VITE_ANALYSIS_TIMEOUT || 30000,
        detectors: [], // Use all available detectors
        optimizations: true
      })
      
      if (abortController.current.signal.aborted) {
        throw new Error('Analysis cancelled')
      }

      updateProgress('Finalizing', 90, 'Generating report...')
      
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 300))
      
      updateProgress('Complete', 100, 'Analysis completed successfully')
      
      setResults(analysisResults)
      
      // Clear progress after a brief delay
      setTimeout(() => setProgress(null), 2000)
      
    } catch (analysisError) {
      console.error('Analysis failed:', analysisError)
      
      const errorMessage = analysisError instanceof Error 
        ? analysisError.message 
        : 'Unknown analysis error'
      
      setError(errorMessage)
      setProgress(null)
      
    } finally {
      setIsAnalyzing(false)
      abortController.current = null
    }
  }, [updateProgress])

  /**
   * Cancel ongoing analysis
   */
  const cancelAnalysis = useCallback(() => {
    if (abortController.current) {
      abortController.current.abort()
      abortController.current = null
    }
    
    setIsAnalyzing(false)
    setProgress(null)
    setError('Analysis cancelled by user')
  }, [])

  /**
   * Clear analysis results and state
   */
  const clearResults = useCallback(() => {
    setResults(null)
    setError(null)
    setProgress(null)
    
    if (isAnalyzing) {
      cancelAnalysis()
    }
  }, [isAnalyzing, cancelAnalysis])

  return {
    results,
    isAnalyzing,
    progress,
    error,
    analyzeCode,
    cancelAnalysis,
    clearResults
  }
}
