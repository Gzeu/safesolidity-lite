# SafeSolidity Lite

**🛡️ Web-based rapid Solidity smart contract auditing using WebAssembly for local static analysis**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![WebAssembly](https://img.shields.io/badge/WebAssembly-654FF0?style=flat&logo=webassembly&logoColor=white)](https://webassembly.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

SafeSolidity Lite este o aplicație web completă pentru auditarea rapidă a smart contracts-urilor Solidity direct în browser, fără necesitatea unui backend. Folosește WebAssembly pentru analiză statică locală și oferă o experiență de dezvoltare modernă cu React și TypeScript.

## ✨ Features Principale

### 🎯 Core Functionality
- **Monaco Editor**: Editor de cod integrat cu syntax highlighting complet pentru Solidity
- **Vulnerability Detection**: Detectarea automată a 10+ tipuri comune de vulnerabilități
- **Real-time Analysis**: Analiză în timp real cu feedback vizual
- **Export Reports**: Generarea rapoartelor în format Markdown, JSON și CSV
- **Offline-First**: Funcționare completă fără conexiune la internet

### 🔍 Vulnerability Detection Engine

| Vulnerabilitate | Severitate | Descriere |
|-----------------|------------|----------|
| **Reentrancy** | CRITICAL | Detectează pattern-uri de reentrancy în funcții payable |
| **tx.origin Usage** | HIGH | Identifică folosirea nesigură a tx.origin pentru autorizare |
| **Timestamp Dependence** | MEDIUM | Găsește dependențe manipulabile de block.timestamp |
| **Unchecked External Calls** | HIGH | Verifică call-uri externe fără validarea rezultatului |
| **Arithmetic Overflow** | HIGH | Detectează overflow/underflow în versiuni Solidity < 0.8 |
| **Uninitialized Storage** | HIGH | Identifică pointeri storage neinitialiazți |
| **Weak Randomness** | MEDIUM | Detectează surse slabe de entropie |
| **Access Control** | HIGH | Verifică funcții publice fără modificatori de access |
| **Gas Limit Issues** | MEDIUM | Identifică dependențe de gas limit |
| **Denial of Service** | MEDIUM | Detectează potențiale atacuri DoS |

### 🚀 Technology Stack

- **Frontend**: React 18 + TypeScript 5.0
- **Editor**: Monaco Editor cu custom Solidity language support
- **Build Tool**: Vite cu optimizări pentru WebAssembly
- **Styling**: Tailwind CSS cu tema custom pentru blockchain development
- **Analysis**: WebAssembly (Slither) + pattern-based fallback
- **Testing**: Vitest pentru unit testing rapid
- **CI/CD**: GitHub Actions cu deploy automat

## 🚀 Quick Start

### Prerequisite
- Node.js 18+ 
- npm 9+ sau yarn
- Git

### Instalare și Configurare

```bash
# Clone repository
git clone https://github.com/Gzeu/safesolidity-lite.git
cd safesolidity-lite

# Instalare dependințe
npm install

# Configurare environment (opțional)
cp .env.example .env

# Start development server
npm run dev
```

### Comenzi Disponibile

```bash
# Development
npm run dev          # Pornește dev server pe http://localhost:3000
npm run preview      # Preview build-ul de producție local

# Build și Deploy
npm run build        # Build optimizat pentru producție
npm run typecheck    # Verificare TypeScript fără compilare
npm run lint         # Linting cu ESLint
npm run lint:fix     # Fix automat pentru probleme de linting

# Testing
npm test             # Rulează testele o dată
npm run test:watch   # Rulează testele în watch mode
npm run test:ui      # Deschide UI-ul Vitest pentru testing

# Utility
npm run clean        # Curățare cache și build files
npm run build:wasm   # Build module WebAssembly (experimental)
```

## 📁 Structură Proiect

```
safesolidity-lite/
├── src/
│   ├── components/          # Componente React modulare
│   │   ├── editor/         # Monaco Editor cu Solidity support
│   │   ├── audit/          # Componente pentru audit results
│   │   ├── export/         # Export și report generation
│   │   └── ui/             # Componente UI reutilizabile
│   ├── hooks/              # Custom React hooks
│   │   ├── useWasmLoader.ts
│   │   ├── useCodeAnalysis.ts
│   │   └── useReportExport.ts
│   ├── utils/              # Utilities și engine logic
│   │   ├── vulnerability-matcher.ts
│   │   ├── solidity-parser.ts
│   │   └── report-formatter.ts
│   ├── wasm/               # WebAssembly integration
│   │   ├── wasm-loader.ts
│   │   └── analysis-engine.ts
│   ├── constants/          # Configurații și pattern definitions
│   ├── types/              # TypeScript type definitions
│   └── App.tsx             # Main application component
├── public/
│   ├── examples/           # Contracte Solidity exemplu
│   │   ├── vulnerable-contract.sol
│   │   └── secure-contract.sol
│   └── wasm/               # WebAssembly modules
├── docs/                   # Documentație tehnică
│   ├── architecture.md
│   ├── vulnerability-detection.md
│   └── deployment.md
├── .github/workflows/      # CI/CD pipelines
└── scripts/                # Build și automation scripts
```

## 🎯 Cum Funcționează

### 1. **Editor Integration**
- Monaco Editor cu syntax highlighting custom pentru Solidity
- Autocompletare și validare în timp real
- Teme optimizate pentru blockchain development

### 2. **Analysis Pipeline**
```
Solidity Code → Parser → Pattern Matching → WASM Analysis → Results → Export
```

### 3. **Vulnerability Detection**
- **Rule-based**: Pattern matching cu regex optimizat
- **AST Analysis**: Analiză pe Abstract Syntax Tree
- **WASM Integration**: Slither engine în WebAssembly (viitor)

### 4. **Report Generation**
- Export automat în Markdown cu vulnerabilități organizate
- JSON structured data pentru integrări
- CSV pentru analiză în Excel/Sheets

## 🔧 Configurare Avansată

### Environment Variables

```bash
# .env.local
VITE_APP_NAME="SafeSolidity Lite"
VITE_WASM_PATH="/wasm"
VITE_ENABLE_WASM=true
VITE_ENABLE_ANALYTICS=false
```

### Custom Vulnerability Rules

```typescript
// src/constants/audit-rules.ts
export const auditRules = {
  CUSTOM_RULE: {
    id: 'CUSTOM_RULE',
    enabled: true,
    severity: 'HIGH',
    pattern: /your-custom-pattern/g
  }
};
```

## 🌐 Deployment

### Vercel (Recomandat)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify

```bash
# Build settings
Build command: npm run build
Publish directory: dist
```

### GitHub Pages

```yaml
# .github/workflows/deploy.yml sunt deja configurate
# Push pe main branch va face deploy automat
```

### Docker (Self-hosted)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ .
EXPOSE 3000
CMD ["npx", "serve", "-s", ".", "-l", "3000"]
```

## 🧪 Example Usage

### 1. **Basic Vulnerability Detection**

```solidity
// Paste în editor - va detecta tx.origin vulnerability
pragma solidity ^0.8.19;

contract Example {
    address owner;
    
    modifier onlyOwner() {
        require(tx.origin == owner, "Not owner"); // ⚠️ VULNERABILITY
        _;
    }
}
```

### 2. **Reentrancy Detection**

```solidity
// Va detecta reentrancy vulnerability
function withdraw() external {
    uint amount = balances[msg.sender];
    (bool success,) = msg.sender.call{value: amount}("");
    require(success);
    balances[msg.sender] = 0; // ⚠️ State change after external call
}
```

## 📊 Performance & Metrics

- **Bundle Size**: < 2MB gzipped (Monaco Editor excluded din initial bundle)
- **Analysis Speed**: < 500ms pentru contracte până la 1000 linii
- **Memory Usage**: < 50MB RAM pentru operații normale
- **Browser Support**: Chrome 90+, Firefox 88+, Safari 14+

## 🤝 Contributing

### Development Workflow

```bash
# Fork repository
git fork https://github.com/Gzeu/safesolidity-lite.git

# Create feature branch
git checkout -b feature/your-feature-name

# Make changes și commit
git commit -m "feat: add your feature"

# Push și create Pull Request
git push origin feature/your-feature-name
```

### Code Quality Standards

- **TypeScript strict mode** activat
- **ESLint + Prettier** pentru code formatting
- **Conventional Commits** pentru commit messages
- **Unit tests** pentru funcții critice
- **E2E tests** pentru workflow principal

## 📝 Roadmap

### v0.2.0 - Q4 2025
- [ ] **WASM Integration**: Slither complet în WebAssembly
- [ ] **Custom Rules**: Editor pentru reguli personalizate
- [ ] **Batch Analysis**: Analizarea mai multor contracte simultan
- [ ] **GitHub Integration**: Plugin pentru code review automat

### v0.3.0 - Q1 2026
- [ ] **Multi-language Support**: Vyper și Cairo support
- [ ] **Advanced Reporting**: Statistici și trends
- [ ] **Team Features**: Sharing și colaborare
- [ ] **API Integration**: Webhook-uri pentru CI/CD

### v1.0.0 - Q2 2026
- [ ] **Production Ready**: Performance optimization
- [ ] **Enterprise Features**: SSO, audit trails
- [ ] **Plugin Ecosystem**: Third-party extensions
- [ ] **Mobile Support**: Progressive Web App

## 📄 License

MIT License - vezi [LICENSE](LICENSE) pentru detalii.

## 🙏 Acknowledgments

- **Slither** - Static analysis framework by Trail of Bits
- **Monaco Editor** - Code editor by Microsoft
- **React Ecosystem** - Pentru tooling și development experience
- **Solidity Community** - Pentru feedback și vulnerability research

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/Gzeu/safesolidity-lite/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Gzeu/safesolidity-lite/discussions)
- **Email**: contact@georgepricop.com
- **LinkedIn**: [@georgepricop](https://linkedin.com/in/georgepricop)

---

<div align="center">
  <strong>🛡️ SafeSolidity Lite - Making Smart Contract Auditing Accessible</strong><br>
  <em>Built with ❤️ for the Blockchain Community</em>
</div>
