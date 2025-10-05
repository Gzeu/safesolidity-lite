/**
 * Monaco Editor theme configuration
 */
export interface EditorTheme {
  base: 'vs' | 'vs-dark' | 'hc-black'
  inherit: boolean
  rules: Array<{
    token: string
    foreground?: string
    background?: string
    fontStyle?: string
  }>
  colors: Record<string, string>
}

/**
 * Editor configuration options
 */
export interface EditorConfig {
  language: string
  theme: string
  fontSize: number
  fontFamily: string
  lineNumbers: 'on' | 'off' | 'relative' | 'interval'
  minimap: boolean
  wordWrap: 'on' | 'off' | 'wordWrapColumn' | 'bounded'
  tabSize: number
  insertSpaces: boolean
  readOnly: boolean
  formatOnType: boolean
  formatOnPaste: boolean
  autoClosingBrackets: 'always' | 'languageDefined' | 'beforeWhitespace' | 'never'
  autoClosingQuotes: 'always' | 'languageDefined' | 'beforeWhitespace' | 'never'
  folding: boolean
  showFoldingControls: 'always' | 'mouseover'
}

/**
 * Editor validation and diagnostics
 */
export interface EditorDiagnostic {
  severity: 'error' | 'warning' | 'info' | 'hint'
  message: string
  startLine: number
  startColumn: number
  endLine: number
  endColumn: number
  code?: string
  source: string
}

/**
 * Solidity language features
 */
export interface SolidityLanguageFeatures {
  hover: boolean
  completion: boolean
  diagnostics: boolean
  formatting: boolean
  signatureHelp: boolean
  documentHighlight: boolean
  definition: boolean
  references: boolean
  rename: boolean
}

/**
 * Editor marker for highlighting vulnerabilities
 */
export interface VulnerabilityMarker {
  id: string
  startLine: number
  startColumn: number
  endLine: number
  endColumn: number
  message: string
  severity: 'error' | 'warning' | 'info'
  source: string
}

/**
 * Code completion item
 */
export interface CompletionItem {
  label: string
  kind: number
  detail?: string
  documentation?: string
  insertText: string
  range?: {
    startLine: number
    startColumn: number
    endLine: number
    endColumn: number
  }
}

/**
 * Editor state and content
 */
export interface EditorState {
  content: string
  language: string
  isDirty: boolean
  canUndo: boolean
  canRedo: boolean
  selection?: {
    startLine: number
    startColumn: number
    endLine: number
    endColumn: number
  }
  cursor?: {
    line: number
    column: number
  }
}
