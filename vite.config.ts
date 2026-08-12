import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages *project* page: the site is served from
  // https://zagamer95.github.io/tefoma/ , not the domain root.
  // Without this, asset URLs resolve to /assets/... and the page renders blank.
  base: '/tefoma/',
  plugins: [react()],
})
