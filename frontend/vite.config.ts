import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

export default defineConfig({
    server: {
        host: '0.0.0.0', // Это позволяет слушать все интерфейсы, включая внешний доступ
        port: 5173,
    },
    plugins: [
        tanstackRouter({
            routesDirectory: './src/app/routes',
            generatedRouteTree: './src/app/routeTree.gen.ts',
            target: 'react',
            autoCodeSplitting: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
})
