import { AuditResults, AuditStatus, AnalysisOptions } from '@/types/audit.types'
import { isWasmReady, getWasmModule } from './wasm-loader'
import { matchVulnerabilities } from '@/utils/vulnerability-matcher'
import { parseSolidityLight } from '@/utils/solidity-parser'

/**
 * Main analysis function that routes to WASM or JavaScript fallback
 */
export async function analyzeContract(
  sourceCode: string, 
  options: AnalysisOptions = {}
): Promise<AuditResults> {
  const startTime = performance.now()
  
  try {
    // Validate input
    if (!sourceCode || sourceCode.trim().length === 0) {
      throw new Error('Source code cannot be empty')
    }
    
    // Check contract size limits
    const maxSize = options.timeout ? 2 * 1024 * 1024 : 1024 * 1024 // 2MB if timeout extended
    if (sourceCode.length > maxSize) {
      throw new Error(`Contract size exceeds maximum limit (${Math.round(maxSize / 1024)}KB)`)
    }
    
    let results: AuditResults
    
    // Try WASM analysis first if available
    if (isWasmReady()) {
      console.log('Using WASM analysis engine')
      results = await analyzeWithWasm(sourceCode, options)
    } else {
      console.log('Using JavaScript fallback analysis')
      results = await analyzeWithJavaScript(sourceCode, options)
    }
    
    // Add timing information
    const endTime = performance.now()
    results.metadata.duration = Math.round(endTime - startTime)
    results.metadata.analysisTimestamp = new Date()
    
    return results
    
  } catch (error) {
    const endTime = performance.now()
    
    return {
      status: AuditStatus.FAILED,
      vulnerabilities: [],
      summary: {
        total: 0,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        info: 0,
        riskScore: 0
      },
      metadata: {
        size: sourceCode.length,
        linesOfCode: sourceCode.split('\n').length,
        functions: 0,
        duration: Math.round(endTime - startTime),
        analysisTimestamp: new Date()
      },
      recommendations: [],
      engines: [{
        name: 'Error Handler',
        version: '1.0.0',
        enabled: true
      }],
      error: error instanceof Error ? error.message : 'Unknown analysis error'
    }
  }
}

/**
 * WASM-based analysis (when available)
 */
async function analyzeWithWasm(
  sourceCode: string, 
  options: AnalysisOptions
): Promise<AuditResults> {
  const wasmModule = getWasmModule()
  
  if (!wasmModule || !wasmModule.exports.analyze) {
    throw new Error('WASM module not properly initialized')
  }
  
  try {
    // Convert JavaScript string to WASM memory
    const encoder = new TextEncoder()
    const sourceBytes = encoder.encode(sourceCode)
    
    // Allocate memory in WASM
    const sourcePtr = wasmModule.exports.malloc(sourceBytes.length)
    if (!sourcePtr) {
      throw new Error('Failed to allocate WASM memory')
    }
    
    // Copy source code to WASM memory
    const memory = new Uint8Array(wasmModule.memory.buffer)
    memory.set(sourceBytes, sourcePtr)
    
    // Call WASM analysis function
    const resultPtr = wasmModule.exports.analyze(
      sourcePtr, 
      sourceBytes.length,
      JSON.stringify(options)
    )
    
    if (!resultPtr) {
      throw new Error('WASM analysis returned null')
    }
    
    // Read result from WASM memory
    const resultLength = wasmModule.exports.get_result_length(resultPtr)
    const resultBytes = new Uint8Array(wasmModule.memory.buffer, resultPtr, resultLength)
    
    // Decode result
    const decoder = new TextDecoder()
    const resultJson = decoder.decode(resultBytes)
    const wasmResult = JSON.parse(resultJson)
    
    // Cleanup WASM memory
    wasmModule.exports.free(sourcePtr)
    wasmModule.exports.free(resultPtr)
    
    // Convert WASM result to our format
    return convertWasmResult(wasmResult, sourceCode)
    
  } catch (error) {
    console.warn('WASM analysis failed, falling back to JavaScript:', error)
    return analyzeWithJavaScript(sourceCode, options)
  }
}

/**
 * JavaScript-based fallback analysis
 */
async function analyzeWithJavaScript(
  sourceCode: string, 
  options: AnalysisOptions
): Promise<AuditResults> {
  // Parse the source code
  const parsed = parseSolidityLight(sourceCode)
  
  // Run vulnerability pattern matching
  const vulnerabilities = matchVulnerabilities(sourceCode)
  
  // Calculate summary statistics
  const summary = {
    total: vulnerabilities.length,
    critical: vulnerabilities.filter(v => v.severity === 'CRITICAL').length,
    high: vulnerabilities.filter(v => v.severity === 'HIGH').length,
    medium: vulnerabilities.filter(v => v.severity === 'MEDIUM').length,
    low: vulnerabilities.filter(v => v.severity === 'LOW').length,
    info: vulnerabilities.filter(v => v.severity === 'INFO').length,
    riskScore: calculateRiskScore(vulnerabilities)
  }
  
  // Extract metadata from parsed code
  const metadata = {
    size: sourceCode.length,
    linesOfCode: parsed.lines.length,
    functions: countFunctions(sourceCode),
    complexity: calculateComplexity(sourceCode),
    duration: 0, // Will be set by caller
    analysisTimestamp: new Date()
  }
  
  // Generate recommendations
  const recommendations = generateRecommendations(vulnerabilities)
  
  return {
    status: AuditStatus.COMPLETED,
    vulnerabilities,
    summary,
    metadata,
    recommendations,
    engines: [{
      name: 'SafeSolidity Rule Engine',
      version: '0.1.0',
      enabled: true
    }]
  }
}

/**
 * Convert WASM analysis result to our format
 */
function convertWasmResult(wasmResult: any, sourceCode: string): AuditResults {
  // This would convert Slither's output format to our internal format
  // For now, return a placeholder structure
  
  return {
    status: AuditStatus.COMPLETED,
    vulnerabilities: wasmResult.vulnerabilities || [],
    summary: wasmResult.summary || {
      total: 0,
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      info: 0,
      riskScore: 0
    },
    metadata: {
      size: sourceCode.length,
      linesOfCode: sourceCode.split('\n').length,
      functions: wasmResult.metadata?.functions || 0,
      duration: 0,
      analysisTimestamp: new Date()
    },
    recommendations: wasmResult.recommendations || [],
    engines: [{
      name: 'Slither WASM',
      version: wasmResult.version || '0.9.0',
      enabled: true,
      wasmPath: '/wasm/slither-wasm.wasm'
    }]
  }
}

/**
 * Calculate risk score based on vulnerabilities
 */
function calculateRiskScore(vulnerabilities: any[]): number {
  if (vulnerabilities.length === 0) return 0
  
  const weights = {
    CRITICAL: 25,
    HIGH: 10,
    MEDIUM: 5,
    LOW: 2,
    INFO: 1
  }
  
  const totalScore = vulnerabilities.reduce((score, vuln) => {
    return score + (weights[vuln.severity as keyof typeof weights] || 1)
  }, 0)
  
  // Normalize to 0-100 scale
  return Math.min(100, Math.round(totalScore))
}

/**
 * Count functions in source code
 */
function countFunctions(sourceCode: string): number {
  const functionRegex = /function\s+\w+\s*\(/g
  const matches = sourceCode.match(functionRegex)
  return matches ? matches.length : 0
}

/**
 * Calculate code complexity score
 */
function calculateComplexity(sourceCode: string): number {
  // Simple cyclomatic complexity approximation
  const controlStructures = [
    /\bif\s*\(/g,
    /\belse\b/g,
    /\bfor\s*\(/g,
    /\bwhile\s*\(/g,
    /\bdo\s*\{/g,
    /\?.*:/g, // ternary
    /\&\&/g,
    /\|\|/g
  ]
  
  let complexity = 1 // base complexity
  
  controlStructures.forEach(regex => {
    const matches = sourceCode.match(regex)
    if (matches) {
      complexity += matches.length
    }
  })
  
  return complexity
}

/**
 * Generate recommendations based on found vulnerabilities
 */
function generateRecommendations(vulnerabilities: any[]): string[] {
  const recommendations = new Set<string>()
  
  // Add general recommendations based on vulnerability types
  const categories = new Set(vulnerabilities.map(v => v.category))
  
  if (categories.has('REENTRANCY')) {
    recommendations.add('Implement reentrancy guards using OpenZeppelin\'s ReentrancyGuard')
    recommendations.add('Follow the checks-effects-interactions pattern')
  }
  
  if (categories.has('ACCESS_CONTROL')) {
    recommendations.add('Use OpenZeppelin\'s AccessControl or Ownable contracts')
    recommendations.add('Replace tx.origin with msg.sender for authorization')
  }
  
  if (categories.has('UNCHECKED_EXTERNAL_CALLS')) {
    recommendations.add('Always check the return value of external calls')
    recommendations.add('Consider using SafeERC20 for token interactions')
  }
  
  if (categories.has('INTEGER_OVERFLOW')) {
    recommendations.add('Use Solidity ^0.8.0 for automatic overflow protection')
    recommendations.add('Consider using OpenZeppelin\'s SafeMath for older versions')
  }
  
  // Add general security recommendations
  recommendations.add('Conduct thorough testing including edge cases')
  recommendations.add('Consider getting a professional security audit')
  recommendations.add('Implement proper event logging for important state changes')
  
  return Array.from(recommendations)
}
