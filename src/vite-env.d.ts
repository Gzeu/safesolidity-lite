/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_WASM_BASE_URL: string
  readonly VITE_ENABLE_WASM_CACHE: string
  readonly VITE_MAX_CONTRACT_SIZE: string
  readonly VITE_ANALYSIS_TIMEOUT: string
  readonly VITE_ENABLE_EXPORT: string
  readonly VITE_ENABLE_EXAMPLES: string
  readonly VITE_DEBUG_MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Extend with number parsing for numeric environment variables
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      VITE_MAX_CONTRACT_SIZE?: string
      VITE_ANALYSIS_TIMEOUT?: string
    }
  }
}
