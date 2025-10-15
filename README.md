# SafeSolidity Lite 🛡️

> **Web-based frontend application for rapid Solidity smart contract auditing using WebAssembly**

SafeSolidity Lite is a modern, browser-based tool that enables developers to quickly audit Solidity smart contracts directly in their browser. Using WebAssembly for local static analysis, it ensures complete privacy and security while delivering professional-grade vulnerability detection.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18-green.svg)
![React](https://img.shields.io/badge/react-18.3.1-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.6.2-blue.svg)
![Pages](https://img.shields.io/badge/GitHub%20Pages-auto--deploy-success)

## 🚀 MVP Quick Start

- npm ci
- npm run dev
- Open the local URL shown by Vite (e.g., http://localhost:5173)

Build & Deploy (auto on main):
- npm run build (locally, optional)
- Push to main → GitHub Actions builds and deploys to GitHub Pages automatically

> Tip: In repo Settings → Pages, set Source to “GitHub Actions” (one-time).

## 🎯 MVP Capabilities

- In-browser rule-based analysis for common vulnerabilities:
  - Reentrancy, tx.origin misuse, timestamp dependence, unchecked external calls
- Minimal UI: textarea editor, “Rulează analiza”, results with severity badges, Export JSON
- No backend, fully static, ready for GitHub Pages

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
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## 🚀 Deployment

- Deploy Static Build workflow uploads dist as artifact on each push to main
- Deploy to GitHub Pages workflow publishes dist to Pages automatically
- After a successful run, the live URL is visible under Environments → github-pages

## 📝 License

MIT
