# SafeSolidity Lite 🛡️

> **Web-based frontend application for rapid Solidity smart contract auditing using WebAssembly**

SafeSolidity Lite is a modern, browser-based tool that enables developers to quickly audit Solidity smart contracts directly in their browser. Using WebAssembly for local static analysis, it ensures complete privacy and security while delivering professional-grade vulnerability detection.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18-green.svg)
![React](https://img.shields.io/badge/react-18.3.1-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.6.2-blue.svg)

## 🚀 Features

- **🎯 Local Analysis**: Complete privacy with browser-based WebAssembly execution
- **⚡ Real-time Results**: Instant vulnerability detection as you type
- **🎨 Monaco Editor**: Professional Solidity editor with syntax highlighting
- **📊 Comprehensive Reports**: Export results in Markdown and JSON formats
- **🔍 Multiple Detections**: Identifies common vulnerabilities like reentrancy, tx.origin usage, arithmetic overflow
- **🌙 Dark Theme**: Optimized interface for developer productivity
- **📱 Responsive Design**: Works seamlessly across desktop and mobile devices
- **🔧 Zero Configuration**: No backend required, runs entirely in the browser

## 🏗️ Architecture

SafeSolidity Lite follows a modular architecture designed for extensibility and maintainability:

```
src/
├── components/           # React UI components
│   ├── editor/          # Monaco Editor integration
│   ├── audit/           # Audit panel and vulnerability display
│   └── export/          # Report generation and export
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
├── utils/               # Core analysis utilities
├── wasm/                # WebAssembly integration
└── constants/           # Vulnerability patterns and rules
```

## 🛠️ Quick Start

### Prerequisites

- **Node.js**: >= 18.0.0
- **npm**: >= 8.0.0

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Gzeu/safesolidity-lite.git
   cd safesolidity-lite
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment (optional)**
   ```bash
   cp .env.example .env
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run unit tests |
| `npm run test:ui` | Run tests with UI |
| `npm run lint` | Lint code |
| `npm run lint:fix` | Fix linting issues |
| `npm run type-check` | TypeScript type checking |

## 🎯 Usage

### Basic Analysis

1. **Load Contract**: Paste your Solidity contract in the editor
2. **Run Analysis**: Click "Rulează Analiza" to start vulnerability detection
3. **Review Results**: Examine detected vulnerabilities in the audit panel
4. **Export Report**: Download results in Markdown or JSON format

### Supported Vulnerabilities

- **Reentrancy**: Detects potential reentrancy attacks
- **tx.origin Usage**: Identifies dangerous tx.origin authentication
- **Timestamp Dependence**: Finds block.timestamp manipulations
- **Unchecked Calls**: Locates unchecked external calls
- **Arithmetic Overflow**: Identifies potential overflow/underflow issues

### Example Contracts

The project includes example contracts in `public/examples/`:

- `vulnerable-contract.sol`: Contract with common vulnerabilities
- `secure-contract.sol`: Hardened version with security fixes

## 🔧 Development

### Project Structure

```
safesolidity-lite/
├── src/                    # Source code
│   ├── components/         # React components
│   │   ├── editor/         # Monaco Editor components
│   │   ├── audit/          # Audit panel components
│   │   └── export/         # Export functionality
│   ├── hooks/              # Custom React hooks
│   │   ├── useWasmLoader.ts     # WASM loading logic
│   │   ├── useCodeAnalysis.ts   # Analysis orchestration
│   │   └── useReportExport.ts   # Report generation
│   ├── types/              # TypeScript definitions
│   ├── utils/              # Core utilities
│   │   ├── solidity-parser.ts   # Lightweight parser
│   │   ├── vulnerability-matcher.ts  # Pattern matching
│   │   └── report-formatter.ts      # Report formatting
│   ├── wasm/               # WebAssembly integration
│   │   ├── wasm-loader.ts       # WASM module loader
│   │   └── analysis-engine.ts   # Analysis orchestration
│   └── constants/          # Configuration
│       ├── vulnerability-patterns.ts  # Detection patterns
│       └── audit-rules.ts            # Analysis rules
├── public/                 # Static assets
│   ├── examples/           # Sample Solidity contracts
│   └── wasm/               # WASM binaries
├── tests/                  # Test suites
├── docs/                   # Documentation
└── scripts/                # Build scripts
```

### Adding New Vulnerability Patterns

1. **Define Pattern**: Add regex pattern in `src/constants/vulnerability-patterns.ts`
2. **Create Rule**: Add rule configuration in `src/constants/audit-rules.ts`
3. **Update Matcher**: Extend matching logic in `src/utils/vulnerability-matcher.ts`
4. **Add Tests**: Create test cases for the new pattern

### WebAssembly Integration

The application supports WebAssembly modules for advanced static analysis:

```typescript
// Future WASM integration
import { loadWasm } from './wasm/wasm-loader';
import { analyzeSource } from './wasm/analysis-engine';

const result = await analyzeSource(solidityCode);
```

## 🚀 Deployment

### Static Hosting

Build and deploy to any static hosting platform:

```bash
npm run build
# Deploy the 'dist' folder to Vercel, Netlify, or GitHub Pages
```

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Vercel will automatically build and deploy on push to main
3. Environment variables can be configured in Vercel dashboard

### GitHub Pages

```bash
npm run build
# Push 'dist' contents to 'gh-pages' branch
```

## 📈 Performance Considerations

- **WASM Loading**: Lazy loading prevents UI blocking
- **Code Analysis**: Runs in Web Workers for optimal performance
- **Caching**: Results cached locally for repeated analysis
- **Bundle Size**: Optimized build with code splitting

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Development Guidelines

- Follow TypeScript strict mode
- Use functional React components with hooks
- Write tests for critical functionality
- Maintain clear separation of concerns
- Document complex logic and algorithms

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Slither](https://github.com/crytic/slither) - Static analysis framework
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Code editor
- [React](https://reactjs.org/) - UI framework
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - Styling

## 🔗 Links

- **Repository**: [github.com/Gzeu/safesolidity-lite](https://github.com/Gzeu/safesolidity-lite)
- **Issues**: [github.com/Gzeu/safesolidity-lite/issues](https://github.com/Gzeu/safesolidity-lite/issues)
- **Documentation**: Coming soon

---

**Made with ❤️ by [George Pricop](https://github.com/Gzeu)**