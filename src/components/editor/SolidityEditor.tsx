import { useRef, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import { EditorConfig, EditorState, VulnerabilityMarker } from '@/types/editor.types'
import { setupSolidityLanguage } from './EditorTheme'

interface SolidityEditorProps {
  value: string
  onChange: (value: string) => void
  isReadOnly?: boolean
  vulnerabilityMarkers?: VulnerabilityMarker[]
  config?: Partial<EditorConfig>
  onEditorMount?: (editor: any) => void
}

/**
 * Monaco Editor component configured for Solidity development
 */
const SolidityEditor: React.FC<SolidityEditorProps> = ({
  value,
  onChange,
  isReadOnly = false,
  vulnerabilityMarkers = [],
  config = {},
  onEditorMount
}) => {
  const editorRef = useRef<any>(null)
  const monacoRef = useRef<any>(null)

  // Default editor configuration
  const defaultConfig: EditorConfig = {
    language: 'solidity',
    theme: 'solidity-dark',
    fontSize: 14,
    fontFamily: 'JetBrains Mono, Fira Code, Monaco, Consolas, monospace',
    lineNumbers: 'on',
    minimap: true,
    wordWrap: 'on',
    tabSize: 4,
    insertSpaces: true,
    readOnly: isReadOnly,
    formatOnType: true,
    formatOnPaste: true,
    autoClosingBrackets: 'always',
    autoClosingQuotes: 'always',
    folding: true,
    showFoldingControls: 'mouseover',
    ...config
  }

  /**
   * Handle editor mounting and setup
   */
  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor
    monacoRef.current = monaco
    
    // Setup Solidity language support
    setupSolidityLanguage(monaco)
    
    // Configure editor options
    editor.updateOptions({
      fontSize: defaultConfig.fontSize,
      fontFamily: defaultConfig.fontFamily,
      lineNumbers: defaultConfig.lineNumbers,
      minimap: { enabled: defaultConfig.minimap },
      wordWrap: defaultConfig.wordWrap,
      tabSize: defaultConfig.tabSize,
      insertSpaces: defaultConfig.insertSpaces,
      readOnly: defaultConfig.readOnly,
      formatOnType: defaultConfig.formatOnType,
      formatOnPaste: defaultConfig.formatOnPaste,
      autoClosingBrackets: defaultConfig.autoClosingBrackets,
      autoClosingQuotes: defaultConfig.autoClosingQuotes,
      folding: defaultConfig.folding,
      showFoldingControls: defaultConfig.showFoldingControls,
      scrollBeyondLastLine: false,
      renderWhitespace: 'selection',
      renderIndentGuides: true,
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: true
    })

    // Add keyboard shortcuts
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
      () => {
        // Trigger analysis when Ctrl+Enter is pressed
        const analyzeEvent = new CustomEvent('trigger-analysis')
        window.dispatchEvent(analyzeEvent)
      }
    )

    // Call external mount handler
    if (onEditorMount) {
      onEditorMount(editor)
    }
  }

  /**
   * Update vulnerability markers in the editor
   */
  useEffect(() => {
    if (!editorRef.current || !monacoRef.current || !vulnerabilityMarkers.length) {
      return
    }

    const monaco = monacoRef.current
    const editor = editorRef.current
    const model = editor.getModel()
    
    if (!model) return

    // Convert vulnerability markers to Monaco markers
    const markers = vulnerabilityMarkers.map(marker => ({
      startLineNumber: marker.startLine,
      startColumn: marker.startColumn,
      endLineNumber: marker.endLine,
      endColumn: marker.endColumn,
      message: marker.message,
      severity: getSeverityLevel(marker.severity, monaco),
      source: marker.source
    }))

    // Set markers on the model
    monaco.editor.setModelMarkers(model, 'vulnerabilities', markers)

  }, [vulnerabilityMarkers])

  /**
   * Convert severity string to Monaco severity level
   */
  const getSeverityLevel = (severity: string, monaco: any) => {
    switch (severity.toLowerCase()) {
      case 'error':
        return monaco.MarkerSeverity.Error
      case 'warning':
        return monaco.MarkerSeverity.Warning
      case 'info':
        return monaco.MarkerSeverity.Info
      default:
        return monaco.MarkerSeverity.Hint
    }
  }

  return (
    <div className="h-full w-full relative">
      <Editor
        height="100%"
        language={defaultConfig.language}
        theme={defaultConfig.theme}
        value={value}
        onChange={(newValue) => onChange(newValue || '')}
        onMount={handleEditorDidMount}
        options={{
          readOnly: defaultConfig.readOnly,
          minimap: { enabled: defaultConfig.minimap },
          fontSize: defaultConfig.fontSize,
          fontFamily: defaultConfig.fontFamily,
          lineNumbers: defaultConfig.lineNumbers,
          wordWrap: defaultConfig.wordWrap,
          tabSize: defaultConfig.tabSize,
          insertSpaces: defaultConfig.insertSpaces,
          formatOnType: defaultConfig.formatOnType,
          formatOnPaste: defaultConfig.formatOnPaste,
          autoClosingBrackets: defaultConfig.autoClosingBrackets,
          autoClosingQuotes: defaultConfig.autoClosingQuotes,
          folding: defaultConfig.folding,
          showFoldingControls: defaultConfig.showFoldingControls,
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
            verticalScrollbarSize: 12,
            horizontalScrollbarSize: 12
          },
          overviewRulerLanes: 2,
          hideCursorInOverviewRuler: false,
          overviewRulerBorder: false
        }}
        loading={
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
            <span className="ml-2 text-muted-foreground">Loading Editor...</span>
          </div>
        }
      />
      
      {/* Editor overlay for additional UI */}
      {isReadOnly && (
        <div className="absolute top-2 right-2 bg-muted px-2 py-1 rounded text-xs text-muted-foreground">
          Read Only
        </div>
      )}
    </div>
  )
}

export default SolidityEditor
