# Deployment Guide

## Vercel Deployment

### Setup
1. Connect GitHub repository to Vercel
2. Configure build settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm ci`

### Environment Variables
```bash
# .env.example
VITE_APP_NAME=SafeSolidity Lite
VITE_API_URL=# Not needed for local-only app
```

### Static File Handling
Ensure WASM files are served with correct MIME types:

```javascript
// vercel.json
{
  "headers": [
    {
      "source": "/wasm/(.*).wasm",
      "headers": [
        {
          "key": "Content-Type",
          "value": "application/wasm"
        }
      ]
    }
  ]
}
```

## Netlify Deployment

### Build Settings
- **Build command**: `npm run build`
- **Publish directory**: `dist`

### Headers Configuration
```toml
# netlify.toml
[[headers]]
  for = "/wasm/*"
  [headers.values]
    Content-Type = "application/wasm"
```

## GitHub Pages

### GitHub Actions Workflow
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## Performance Optimization

### Build Optimization
- **Code Splitting**: Monaco Editor în chunk separat
- **WASM Caching**: Aggressive caching pentru WASM files
- **Asset Optimization**: Minimizare bundle size

### Runtime Optimization
- **Lazy Loading**: WASM și Monaco se încarcă on-demand
- **Web Workers**: Analysis în background threads
- **Local Storage**: Cache rezultate pentru contracte analizate anterior
