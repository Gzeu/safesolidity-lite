/**
 * WebAssembly module loading status
 */
export enum WasmStatus {
  LOADING = 'loading',
  READY = 'ready',
  ERROR = 'error',
  NOT_SUPPORTED = 'not-supported'
}

/**
 * WASM module configuration
 */
export interface WasmConfig {
  modulePath: string
  memoryPages?: number
  stackSize?: number
  timeout?: number
  enableOptimizations?: boolean
}

/**
 * Slither WASM interface
 */
export interface SlitherWasm {
  analyze: (code: string, options?: AnalysisOptions) => Promise<SlitherResults>
  getVersion: () => string
  getSupportedDetectors: () => string[]
  cleanup: () => void
}

/**
 * Analysis options for WASM engines
 */
export interface AnalysisOptions {
  detectors?: string[]
  excludeDetectors?: string[]
  timeout?: number
  optimizations?: boolean
  includePaths?: string[]
  solcVersion?: string
}

/**
 * Raw results from Slither WASM
 */
export interface SlitherResults {
  success: boolean
  results?: {
    detectors: Array<{
      check: string
      impact: 'High' | 'Medium' | 'Low' | 'Informational'
      confidence: 'High' | 'Medium' | 'Low'
      description: string
      elements: Array<{
        type: string
        name: string
        source_mapping: {
          start: number
          length: number
          filename_relative: string
          filename_absolute: string
          filename_short: string
          is_dependency: boolean
          lines: number[]
          starting_column: number
          ending_column: number
        }
      }>
    }>
  }
  error?: string
  compilation_error?: string
  analysis_time?: number
}

/**
 * WASM worker message types
 */
export interface WasmWorkerMessage {
  id: string
  type: 'analyze' | 'initialize' | 'cleanup'
  payload: any
}

/**
 * WASM worker response
 */
export interface WasmWorkerResponse {
  id: string
  success: boolean
  result?: any
  error?: string
  progress?: number
}

/**
 * Memory usage statistics
 */
export interface WasmMemoryStats {
  used: number
  total: number
  growth: number
  maximum: number
}

/**
 * Performance metrics for WASM operations
 */
export interface WasmPerformanceMetrics {
  initializationTime: number
  analysisTime: number
  memoryUsage: WasmMemoryStats
  wasmSize: number
  compressionRatio?: number
}

/**
 * Browser compatibility info
 */
export interface BrowserCompatibility {
  webAssembly: boolean
  sharedArrayBuffer: boolean
  bigInt: boolean
  webWorkers: boolean
  corsHeaders: boolean
}
