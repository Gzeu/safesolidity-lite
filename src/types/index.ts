// Re-export all types for easier imports
export * from './vulnerability.types'
export * from './audit.types'
export * from './editor.types'
export * from './wasm.types'

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  timestamp: Date
}

/**
 * Error types for the application
 */
export enum ErrorType {
  WASM_LOAD_ERROR = 'wasm-load-error',
  ANALYSIS_ERROR = 'analysis-error',
  PARSING_ERROR = 'parsing-error',
  EXPORT_ERROR = 'export-error',
  NETWORK_ERROR = 'network-error',
  BROWSER_COMPATIBILITY = 'browser-compatibility'
}

/**
 * Application error structure
 */
export interface AppError {
  type: ErrorType
  message: string
  details?: string
  timestamp: Date
  recoverable: boolean
  suggestions?: string[]
}

/**
 * Application state management
 */
export interface AppState {
  editor: {
    code: string
    isDirty: boolean
    language: string
  }
  audit: {
    results: any
    isAnalyzing: boolean
    progress: number
  }
  wasm: {
    isReady: boolean
    error?: string
    engines: string[]
  }
  ui: {
    theme: 'light' | 'dark'
    sidebarCollapsed: boolean
    notifications: any[]
  }
}
