import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'
// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), ...(mode === 'test' ? [] : [mkcert()])],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
}))
