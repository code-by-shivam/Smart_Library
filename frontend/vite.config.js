import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// Use relative base so builds work when deployed to subpaths/static hosts.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
