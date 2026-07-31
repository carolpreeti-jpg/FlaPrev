import { defineConfig } from 'vite'

// Serve apenas a LP do FlaPrev (index.html).
// A pasta nbf/ é um site espelhado de referência e deve ser ignorada
// pelo scanner de dependências do Vite.
export default defineConfig({
  optimizeDeps: {
    entries: ['index.html'],
  },
  server: {
    open: true,
  },
})
