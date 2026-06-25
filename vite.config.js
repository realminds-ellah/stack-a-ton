import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// During `npm run dev`, the React app runs on :5173 and the generation proxy
// (which holds the API key) runs on :8787. Forward /api calls to it so the
// key never reaches the browser.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8787',
    },
  },
})
