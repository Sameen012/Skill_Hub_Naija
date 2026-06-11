import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        host: true
    },
    build: {
        // Optimize for mobile
        minify: 'terser',
        sourcemap: false, // Disable sourcemaps in production
        rollupOptions: {
            output: {
                manualChunks: {
                    // Split vendor libraries into separate chunks
                    'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                    'axios-vendor': ['axios'],
                }
            }
        },
        chunkSizeWarningLimit: 500,
        terserOptions: {
            compress: {
                drop_console: true, // Remove console.logs in production
            }
        }
    }
})