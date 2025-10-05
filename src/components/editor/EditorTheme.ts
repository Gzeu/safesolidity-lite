/**
 * Monaco Editor theme and language configuration for Solidity
 */

/**
 * Setup Solidity language support in Monaco
 */
export const setupSolidityLanguage = (monaco: any) => {
  // Register Solidity language if not already registered
  const languages = monaco.languages.getLanguages()
  const solidityExists = languages.some((lang: any) => lang.id === 'solidity')
  
  if (!solidityExists) {
    // Register the language
    monaco.languages.register({ id: 'solidity' })
    
    // Set language configuration
    monaco.languages.setLanguageConfiguration('solidity', {
      comments: {
        lineComment: '//',
        blockComment: ['/*', '*/']
      },
      brackets: [
        ['{', '}'],
        ['[', ']'],
        ['(', ')']
      ],
      autoClosingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
        { open: "'", close: "'" }
      ],
      surroundingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
        { open: "'", close: "'" }
      ],
      indentationRules: {
        increaseIndentPattern: /^(.*\{[^}"'`]*|.*(\(|\[)[^)\]"'`]*)$/,
        decreaseIndentPattern: /^(.*\}.*|.*\).*|.*\].*)$/
      },
      folding: {
        markers: {
          start: new RegExp('^\\s*//\\s*#region\\b'),
          end: new RegExp('^\\s*//\\s*#endregion\\b')
        }
      }
    })
    
    // Set tokenization rules
    monaco.languages.setMonarchTokenizer('solidity', {
      keywords: [
        'pragma', 'solidity', 'contract', 'library', 'interface', 'abstract',
        'function', 'modifier', 'event', 'struct', 'enum', 'mapping',
        'public', 'private', 'internal', 'external', 'pure', 'view', 'payable',
        'constant', 'override', 'virtual', 'immutable',
        'constructor', 'fallback', 'receive',
        'if', 'else', 'for', 'while', 'do', 'break', 'continue',
        'return', 'throw', 'try', 'catch', 'require', 'assert', 'revert',
        'import', 'using', 'is', 'as',
        'delete', 'new', 'this', 'super',
        'assembly', 'memory', 'storage', 'calldata'
      ],
      
      typeKeywords: [
        'bool', 'string', 'bytes', 'address', 'uint', 'int',
        'uint8', 'uint16', 'uint24', 'uint32', 'uint40', 'uint48', 'uint56', 'uint64',
        'uint72', 'uint80', 'uint88', 'uint96', 'uint104', 'uint112', 'uint120', 'uint128',
        'uint136', 'uint144', 'uint152', 'uint160', 'uint168', 'uint176', 'uint184', 'uint192',
        'uint200', 'uint208', 'uint216', 'uint224', 'uint232', 'uint240', 'uint248', 'uint256',
        'int8', 'int16', 'int24', 'int32', 'int40', 'int48', 'int56', 'int64',
        'int72', 'int80', 'int88', 'int96', 'int104', 'int112', 'int120', 'int128',
        'int136', 'int144', 'int152', 'int160', 'int168', 'int176', 'int184', 'int192',
        'int200', 'int208', 'int216', 'int224', 'int232', 'int240', 'int248', 'int256',
        'bytes1', 'bytes2', 'bytes3', 'bytes4', 'bytes5', 'bytes6', 'bytes7', 'bytes8',
        'bytes9', 'bytes10', 'bytes11', 'bytes12', 'bytes13', 'bytes14', 'bytes15', 'bytes16',
        'bytes17', 'bytes18', 'bytes19', 'bytes20', 'bytes21', 'bytes22', 'bytes23', 'bytes24',
        'bytes25', 'bytes26', 'bytes27', 'bytes28', 'bytes29', 'bytes30', 'bytes31', 'bytes32'
      ],
      
      operators: [
        '=', '>', '<', '!', '~', '?', ':', '==', '<=', '>=', '!=',
        '&&', '||', '++', '--', '+', '-', '*', '/', '&', '|', '^', '%',
        '<<', '>>', '>>>', '+=', '-=', '*=', '/=', '&=', '|=', '^=',
        '%=', '<<=', '>>=', '>>>='  
      ],
      
      symbols: /[=><!~?:&|+\-*\/\^%]+/,
      
      tokenizer: {
        root: [
          [/[a-z_$][\w$]*/, {
            cases: {
              '@typeKeywords': 'type',
              '@keywords': 'keyword',
              '@default': 'identifier'
            }
          }],
          [/[A-Z][\w\$]*/, 'type.identifier'],
          [/[0-9]+/, 'number'],
          [/0x[0-9a-fA-F]+/, 'number.hex'],
          [/"([^"\\]|\\.)*$/, 'string.invalid'],
          [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],
          [/'([^'\\]|\\.)*$/, 'string.invalid'],
          [/'/, { token: 'string.quote', bracket: '@open', next: '@stringSingle' }],
          [/\/\*/, 'comment', '@comment'],
          [/\/\/.*$/, 'comment'],
          [/[{}()\[\]]/, '@brackets'],
          [/[<>](?!@symbols)/, '@brackets'],
          [/@symbols/, {
            cases: {
              '@operators': 'operator',
              '@default': ''
            }
          }],
          [/\s+/, 'white']
        ],
        
        comment: [
          [/[^\/*]+/, 'comment'],
          [/\*\//, 'comment', '@pop'],
          [/[\/*]/, 'comment']
        ],
        
        string: [
          [/[^\\"]+/, 'string'],
          [/\\./, 'string.escape.invalid'],
          [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
        ],
        
        stringSingle: [
          [/[^\\']+/, 'string'],
          [/\\./, 'string.escape.invalid'],
          [/'/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
        ]
      }
    })
  }
  
  // Define the dark theme for Solidity
  monaco.editor.defineTheme('solidity-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
      { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' },
      { token: 'type', foreground: '4EC9B0' },
      { token: 'type.identifier', foreground: '4EC9B0' },
      { token: 'identifier', foreground: '9CDCFE' },
      { token: 'string', foreground: 'CE9178' },
      { token: 'string.quote', foreground: 'CE9178' },
      { token: 'number', foreground: 'B5CEA8' },
      { token: 'number.hex', foreground: 'B5CEA8' },
      { token: 'operator', foreground: 'D4D4D4' }
    ],
    colors: {
      'editor.background': '#0f0f0f',
      'editor.foreground': '#D4D4D4',
      'editor.lineHighlightBackground': '#1e1e1e',
      'editor.selectionBackground': '#264F78',
      'editor.selectionHighlightBackground': '#264F78',
      'editorCursor.foreground': '#AEAFAD',
      'editorWhitespace.foreground': '#3B3A32',
      'editorIndentGuide.background': '#404040',
      'editorLineNumber.foreground': '#858585'
    }
  })
}
