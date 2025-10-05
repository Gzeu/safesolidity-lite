import { useState } from 'react'
import { AlertTriangle, Shield, Code, FileText, Github } from 'lucide-react'
import SolidityEditor from './components/editor/SolidityEditor'
import AuditPanel from './components/audit/AuditPanel'
import { useWasmLoader } from './hooks/useWasmLoader'
import { useCodeAnalysis } from './hooks/useCodeAnalysis'

function App() {
  const [code, setCode] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const { isWasmReady, wasmError } = useWasmLoader()
  const { analyzeCode, results, error } = useCodeAnalysis()

  const handleCodeChange = (newCode: string) => {
    setCode(newCode)
  }

  const handleAnalyze = async () => {
    if (!code.trim() || !isWasmReady) return
    
    setIsAnalyzing(true)
    try {
      await analyzeCode(code)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">SafeSolidity Lite</h1>
                <p className="text-sm text-muted-foreground">
                  Rapid Smart Contract Auditing
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {wasmError && (
                <div className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm">WASM Loading Failed</span>
                </div>
              )}
              
              {!isWasmReady && !wasmError && (
                <div className="text-sm text-muted-foreground">
                  Loading Analysis Engine...
                </div>
              )}
              
              <a
                href="https://github.com/Gzeu/safesolidity-lite"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {/* Editor Panel */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Solidity Editor</h2>
              </div>
              
              <button
                onClick={handleAnalyze}
                disabled={!code.trim() || !isWasmReady || isAnalyzing}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isAnalyzing && (
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                )}
                {isAnalyzing ? 'Analyzing...' : 'Analyze Contract'}
              </button>
            </div>
            
            <div className="h-full border border-border rounded-md overflow-hidden">
              <SolidityEditor 
                value={code}
                onChange={handleCodeChange}
                isReadOnly={isAnalyzing}
              />
            </div>
          </div>

          {/* Audit Panel */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Audit Results</h2>
            </div>
            
            <div className="h-full border border-border rounded-md overflow-hidden">
              <AuditPanel 
                results={results}
                isAnalyzing={isAnalyzing}
                error={error || wasmError}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-auto">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          <p>
            Built with ❤️ by{' '}
            <a 
              href="https://github.com/Gzeu" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              George Pricop
            </a>
            {' '} • Powered by WebAssembly & Slither
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
