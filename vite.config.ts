import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  
  build: {
    // Don't inline WASM files - serve them as separate assets
    assetsInlineLimit: 0,
    
    rollupOptions: {
      output: {
        // Split Monaco Editor into separate chunk for better caching
        manualChunks: {
          'monaco': ['@monaco-editor/react', 'monaco-editor']
        }
      }
    },
    
    // Optimize for production
    minify: 'terser',
    sourcemap: process.env.NODE_ENV === 'development'
  },
  
  // Optimize dependencies for faster dev server startup
  optimizeDeps: {
    include: [
      '@monaco-editor/react',
      'monaco-editor'
    ]
  },
  
  // Ensure public directory is correctly served
  publicDir: 'public',
  
  // Configure server for development
  server: {
    port: 3000,
    open: true,
    cors: true
  },
  
  // Preview server configuration
  preview: {
    port: 4173,
    open: true
  },
  
  // Define global constants for the application
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
  }
});
