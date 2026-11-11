import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import githubPagesFallback from './scripts/githubPagesFallback.js'

export default defineConfig({
  base: '/mellow-bake/',
  plugins: [react(), githubPagesFallback()],
})
