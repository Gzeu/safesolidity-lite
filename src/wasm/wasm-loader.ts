import { WasmStatus, WasmConfig, BrowserCompatibility } from '@/types/wasm.types'

let wasmModule: any = null
let wasmStatus: WasmStatus = WasmStatus.LOADING
let initializationPromise: Promise<boolean> | null = null

/**
 * Check browser compatibility for required WASM features
 */
export function checkBrowserCompatibility(): BrowserCompatibility {
  return {
    webAssembly: typeof WebAssembly === 'object' && typeof WebAssembly.instantiate === 'function',
    sharedArrayBuffer: typeof SharedArrayBuffer !== 'undefined',
    bigInt: typeof BigInt !== 'undefined',
    webWorkers: typeof Worker !== 'undefined',
    corsHeaders: true // Will be verified during fetch
  }
}

/**
 * Load WASM module with configuration options
 */
export async function loadWasm(config: Partial<WasmConfig> = {}): Promise<boolean> {
  // Return cached promise if already initializing
  if (initializationPromise) {
    return initializationPromise
  }

  // Return immediately if already loaded
  if (wasmStatus === WasmStatus.READY && wasmModule) {
    return true
  }

  const defaultConfig: WasmConfig = {
    modulePath: '/wasm/slither-wasm.wasm',
    memoryPages: 256, // 16MB
    stackSize: 1024 * 1024, // 1MB
    timeout: 30000, // 30 seconds
    enableOptimizations: true,
    ...config
  }

  initializationPromise = initializeWasm(defaultConfig)
  return initializationPromise
}

/**
 * Internal initialization function
 */
async function initializeWasm(config: WasmConfig): Promise<boolean> {
  try {
    wasmStatus = WasmStatus.LOADING
    
    // Check browser compatibility first
    const compatibility = checkBrowserCompatibility()
    
    if (!compatibility.webAssembly) {
      console.warn('WebAssembly not supported, falling back to JavaScript analysis')
      wasmStatus = WasmStatus.NOT_SUPPORTED
      return false
    }

    // Try to fetch the WASM module
    const wasmUrl = config.modulePath
    
    try {
      const response = await fetch(wasmUrl, {
        cache: 'force-cache',
        mode: 'cors'
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch WASM module: ${response.status} ${response.statusText}`)
      }
      
      const wasmBytes = await response.arrayBuffer()
      
      // Configure WASM memory
      const memory = new WebAssembly.Memory({
        initial: config.memoryPages || 256,
        maximum: (config.memoryPages || 256) * 4
      })
      
      // Import object for WASM module
      const importObject = {
        env: {
          memory,
          abort: (msg: number, file: number, line: number, column: number) => {
            console.error('WASM abort:', { msg, file, line, column })
            throw new Error('WASM execution aborted')
          },
          console_log: (ptr: number, len: number) => {
            // Implementation for console logging from WASM
            console.log('WASM log:', ptr, len)
          }
        },
        wasi_snapshot_preview1: {
          // WASI stubs if needed
          proc_exit: () => {},
          fd_write: () => 0
        }
      }
      
      // Instantiate WASM module
      const wasmInstance = await WebAssembly.instantiate(wasmBytes, importObject)
      
      wasmModule = {
        instance: wasmInstance.instance,
        memory,
        exports: wasmInstance.instance.exports
      }
      
      // Initialize the module if it has an init function
      if (wasmModule.exports.init && typeof wasmModule.exports.init === 'function') {
        wasmModule.exports.init()
      }
      
      wasmStatus = WasmStatus.READY
      console.log('WASM module loaded successfully')
      return true
      
    } catch (fetchError) {
      // WASM file not found or network error - this is expected in development
      console.warn('WASM module not available, using JavaScript fallback:', fetchError)
      wasmStatus = WasmStatus.NOT_SUPPORTED
      return false
    }
    
  } catch (error) {
    console.error('WASM initialization failed:', error)
    wasmStatus = WasmStatus.ERROR
    wasmModule = null
    throw error
  }
}

/**
 * Get current WASM status
 */
export function getWasmStatus(): WasmStatus {
  return wasmStatus
}

/**
 * Get loaded WASM module instance
 */
export function getWasmModule(): any | null {
  return wasmModule
}

/**
 * Check if WASM is ready for use
 */
export function isWasmReady(): boolean {
  return wasmStatus === WasmStatus.READY && wasmModule !== null
}

/**
 * Cleanup WASM resources
 */
export function cleanupWasm(): void {
  if (wasmModule?.exports?.cleanup && typeof wasmModule.exports.cleanup === 'function') {
    try {
      wasmModule.exports.cleanup()
    } catch (error) {
      console.warn('WASM cleanup failed:', error)
    }
  }
  
  wasmModule = null
  wasmStatus = WasmStatus.LOADING
  initializationPromise = null
}

/**
 * Get memory usage statistics
 */
export function getWasmMemoryStats() {
  if (!wasmModule?.memory) {
    return null
  }
  
  const memory = wasmModule.memory
  const buffer = memory.buffer
  
  return {
    used: buffer.byteLength,
    total: memory.buffer.byteLength,
    growth: memory.grow ? memory.grow.length : 0,
    maximum: 1024 * 1024 * 1024 // 1GB theoretical max
  }
}

/**
 * Force reload WASM module
 */
export async function reloadWasm(config: Partial<WasmConfig> = {}): Promise<boolean> {
  cleanupWasm()
  return loadWasm(config)
}
