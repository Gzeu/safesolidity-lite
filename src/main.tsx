import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Error boundary for WASM loading issues
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {children}
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
