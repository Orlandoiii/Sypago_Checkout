import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    // base: '/',

    base: '/bitmercado/checkout/',

    server: {
        host: true,
        port: 5173,

    },
    preview: {
        host: true,
        port: 5173,
    },
    build: {
        outDir: "./server/ui/dist/",
    }
})