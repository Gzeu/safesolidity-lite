# SafeSolidity Lite 🛡️

> **Web-based frontend application for rapid Solidity smart contract auditing using WebAssembly**

SafeSolidity Lite is a modern, browser-based tool that enables developers to quickly audit Solidity smart contracts directly in their browser. Using WebAssembly for local static analysis, it ensures complete privacy and security while delivering professional-grade vulnerability detection.

[![CI/CD Pipeline](https://github.com/Gzeu/safesolidity-lite/actions/workflows/main.yml/badge.svg)](https://github.com/Gzeu/safesolidity-lite/actions/workflows/main.yml)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18-green.svg)
![React](https://img.shields.io/badge/react-18.3.1-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.6.2-blue.svg)
![Pages](https://img.shields.io/badge/GitHub%20Pages-auto--deploy-success)

## 🌐 Live Demo

**Try SafeSolidity Lite now:** [https://gzeu.github.io/safesolidity-lite](https://gzeu.github.io/safesolidity-lite)

*Auto-deployed from main branch via GitHub Actions*

## 🚀 MVP Quick Start

**Local Development:**
```bash
npm ci
npm run dev
```
Open the local URL shown by Vite (e.g., http://localhost:5173)

**Build & Deploy (auto on main):**
```bash
npm run build    # locally, optional
git push origin main    # → GitHub Actions builds and deploys to GitHub Pages
```

> **Tip**: In repo Settings → Pages, set Source to "GitHub Actions" (one-time).

## 🎯 MVP Capabilities

- **In-browser rule-based analysis** for common vulnerabilities:
  - Reentrancy, tx.origin misuse, timestamp dependence, unchecked external calls
- **Minimal UI**: textarea editor, "Rulează analiza", results with severity badges, Export JSON
- **No backend**, fully static, ready for GitHub Pages
- **Instant feedback**: analyze contracts without server uploads

---

## 🔧 Features (Planned/PRs)

- Monaco Editor integration (PR #3)
- WASM analysis engine (PR #2)
- CI pipeline & build optimizations (PR #5)
- Comprehensive docs & Solidity examples (PR #4)

## 🏗️ Architecture

```
src/
├── components/           # React UI components
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
├── utils/                # Rule-based analysis utilities (MVP)
├── wasm/                 # WebAssembly integration (PR)
└── constants/            # Patterns & rules (PR)
```

## 📋 Scripts

| Command | Description |
|---------|-----------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run type-check` | TypeScript type checking |
| `npm run lint` | Lint code |
| `npm test` | Run tests |

## 🚀 Deployment

- **Unified CI/CD Pipeline**: build & test on all branches, deploy to Pages only on main
- **GitHub Actions**: automatic build verification and deployment
- **Live URL**: available under Environments → github-pages after successful deploy

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request (auto-tested by CI)

## 📝 License

MIT
