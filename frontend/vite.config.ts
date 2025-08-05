import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react()
        , tailwindcss()
    ],
    server: {
        watch: {
            usePolling: true,
        },
        host: '0.0.0.0',
        port: 3000,
        hmr: {
            clientPort: 3000,
        },
        allowedHosts: ['v2202508291873369639.ultrasrv.de', '.bards-words.dev'],
    }
})
