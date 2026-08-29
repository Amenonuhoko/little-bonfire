import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages serves this from a /little-bonfire/ subpath; Vercel (and
// local dev) serve it from the domain root. GITHUB_PAGES is set only by
// .github/workflows/deploy.yml's build step.
const base = process.env.GITHUB_PAGES ? '/little-bonfire/' : '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
})
