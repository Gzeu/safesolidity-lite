# SafeSolidity Lite

Aplicație web front-end pentru audit rapid de smart contracts Solidity folosind WebAssembly.

## ✨ Features

- Editor Monaco integrat cu syntax highlighting pentru Solidity
- Analiză statică locală folosind Slither în WebAssembly
- Detectarea vulnerabilităților comune (reentrancy, overflow, etc.)
- Export rapoarte în format Markdown și JSON
- Complet front-end, fără backend necesar

## 🚀 Quick Start

### Instalare

```bash
npm install
cp .env.example .env
```

### Development

```bash
npm run dev       # Pornește serverul de development
npm run build     # Build pentru producție
npm run preview   # Preview build-ul local
npm test          # Rulează testele
```

### Build WASM

```bash
./scripts/build-wasm.sh  # Compilează modulele WASM
```

## 📁 Structură Proiect

- `src/components/` - Componente React modulare (editor, audit, export)
- `src/wasm/` - Module WebAssembly pentru analiză statică
- `src/hooks/` - Custom React hooks pentru logica de business
- `src/types/` - Definițiile TypeScript centralizate
- `public/examples/` - Contracte Solidity de test și demonstrație

## 🔧 Convenții

- Cod TypeScript strict cu toate tipurile definite
- Componente React funcționale cu hooks
- Teste pentru fiecare modul critic
- Build optimizat pentru încărcare rapidă WASM
- Export rapoarte locale fără upload server

## 🌐 Deploy

Aplicația poate fi deployed pe orice platformă static hosting:

```bash
npm run build
# Deploy folder dist/ pe Vercel, Netlify, GitHub Pages
```

## 🛠️ Extinderi

- Integrare cu mai multe tools de audit (Mythril, Securify)
- Support pentru alte limbaje (Vyper, Cairo)
- Plugin sistem pentru reguli custom de audit
- Integrare cu GitHub pentru audit automat
