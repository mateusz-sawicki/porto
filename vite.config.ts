import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import svgLoader from 'vite-svg-loader'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    svgLoader({
      // Configure SVGO to preserve IDs and other important attributes
      svgoConfig: {
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                // Disable ID cleanup to preserve path IDs
                cleanupIds: false,
                // Keep other potentially useful optimizations disabled
                removeUselessDefs: false,
                removeUnknownsAndDefaults: false,
                // Preserve viewBox and other important attributes
                removeViewBox: false,
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
