import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('@mantine')) return 'mantine'
          if (id.includes('@tiptap') || id.includes('prosemirror')) return 'editor'
          if (id.includes('@editorjs') || id.includes('react-editor-js')) return 'editorjs'
          if (id.includes('framer-motion')) return 'motion'
          if (id.includes('@smth/shared') || id.includes('zod')) return 'shared'
        },
      },
    },
  },
  server: {
    allowedHosts: ['all'],
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  }
})
