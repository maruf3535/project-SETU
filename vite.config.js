import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // GitHub Pages serves the site under /project-SETU/, Vercel serves it at the root
  base: process.env.DEPLOY_TARGET === 'gh-pages' ? '/project-SETU/' : '/',
})
