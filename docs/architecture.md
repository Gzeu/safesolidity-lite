# SafeSolidity Lite - Architecture Documentation

## System Overview

SafeSolidity Lite este o aplicație web front-end construită cu React și TypeScript pentru auditarea rapidă a smart contracts-urilor Solidity. Aplicația folosește WebAssembly pentru a rula analize statice direct în browser, eliminând nevoia unui backend.

## Component Architecture

### Core Components

#### Editor Layer
- **SolidityEditor**: Monaco Editor integrat cu syntax highlighting
- **EditorTheme**: Tema dark personalizată pentru dezvoltatori blockchain

#### Analysis Layer
- **WASM Engine**: WebAssembly module pentru Slither
- **Rule Engine**: Pattern matching pentru vulnerabilități cunoscute
- **Analysis Engine**: Orchestrează între WASM și rule-based analysis

#### UI Layer
- **AuditPanel**: Afișarea rezultatelor de audit
- **VulnerabilityList**: Lista vulnerabilităților detectate
- **ExportButton**: Export rapoarte în MD/JSON

### Data Flow

1. **Input**: Utilizatorul editează codul Solidity în Monaco Editor
2. **Trigger**: Click pe "Rulează Analiza"
3. **Processing**: Analysis Engine procesează codul prin WASM sau rule-based
4. **Output**: Rezultatele sunt afișate în AuditPanel
5. **Export**: Utilizatorul poate exporta raportul în format dorit

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Editor**: Monaco Editor cu custom Solidity language support
- **Build**: Vite pentru bundling și development
- **Styling**: Tailwind CSS pentru UI components
- **Analysis**: WebAssembly (Slither) + pattern matching fallback
