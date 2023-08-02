import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    testTimeout: 20000,
  },
  define: {
    'import.meta.env.USERNAME': JSON.stringify(process.env.USERNAME),
  },
})
