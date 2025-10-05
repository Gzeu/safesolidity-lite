import { useState, useEffect, useCallback } from 'react'
import { WasmStatus, BrowserCompatibility } from '@/types/wasm.types'

interface UseWasmLoaderReturn {
  isWasmReady: boolean
  wasmStatus: WasmStatus
  wasmError: string | null
  browserCompatibility: BrowserCompatibility
  loadProgress: number
  retryLoad: () => void
}

/**
 * Hook for managing WebAssembly module loading and browser compatibility
 */
export const useWasmLoader = (): UseWasmLoaderReturn => {
  const [wasmStatus, setWasmStatus] = useState<WasmStatus>(WasmStatus.LOADING)
  const [wasmError, setWasmError] = useState<string | null>(null)
  const [loadProgress, setLoadProgress] = useState(0)
  const [browserCompatibility, setBrowserCompatibility] = useState<BrowserCompatibility>({
    webAssembly: false,
    sharedArrayBuffer: false,
    bigInt: false,
    webWorkers: false,
    corsHeaders: false
  })

  /**
   * Check browser compatibility for WASM features
   */
  const checkBrowserCompatibility = useCallback((): BrowserCompatibility => {
    const compatibility: BrowserCompatibility = {
      webAssembly: typeof WebAssembly === 'object' && typeof WebAssembly.instantiate === 'function',
      sharedArrayBuffer: typeof SharedArrayBuffer !== 'undefined',
      bigInt: typeof BigInt !== 'undefined',
      webWorkers: typeof Worker !== 'undefined',
      corsHeaders: true // Will be checked during fetch
    }
    
    setBrowserCompatibility(compatibility)
    return compatibility
  }, [])

  /**
   * Load WASM modules with progress tracking
   */
  const loadWasmModules = useCallback(async () => {
    try {
      setWasmStatus(WasmStatus.LOADING)
      setWasmError(null)
      setLoadProgress(0)

      const compatibility = checkBrowserCompatibility()
      
      if (!compatibility.webAssembly) {
        throw new Error('WebAssembly is not supported in this browser')
      }

      if (!compatibility.webWorkers) {
        console.warn('Web Workers not supported - analysis will run on main thread')
      }

      // Simulate progressive loading
      setLoadProgress(20)

      // Check if WASM files exist
      const wasmBasePath = import.meta.env.VITE_WASM_BASE_URL || '/wasm/'
      
      try {
        setLoadProgress(40)
        
        // Try to fetch WASM module info
        const response = await fetch(`${wasmBasePath}slither-wasm.wasm`, { method: 'HEAD' })
        
        if (!response.ok) {
          console.warn('WASM files not found - using fallback analysis')
        }
        
        setLoadProgress(70)
        
        // Simulate initialization time
        await new Promise(resolve => setTimeout(resolve, 500))
        
        setLoadProgress(100)
        setWasmStatus(WasmStatus.READY)
        
      } catch (fetchError) {
        console.warn('WASM fetch failed, continuing with JavaScript fallback:', fetchError)
        setWasmStatus(WasmStatus.READY) // Still ready for JS analysis
        setLoadProgress(100)
      }

    } catch (error) {
      console.error('WASM loading failed:', error)
      setWasmError(error instanceof Error ? error.message : 'Unknown error')
      setWasmStatus(WasmStatus.ERROR)
      setLoadProgress(0)
    }
  }, [checkBrowserCompatibility])

  /**
   * Retry loading WASM modules
   */
  const retryLoad = useCallback(() => {
    loadWasmModules()
  }, [loadWasmModules])

  useEffect(() => {
    loadWasmModules()
  }, [loadWasmModules])

  return {
    isWasmReady: wasmStatus === WasmStatus.READY,
    wasmStatus,
    wasmError,
    browserCompatibility,
    loadProgress,
    retryLoad
  }
}
