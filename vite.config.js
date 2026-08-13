import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const proxy = {
  '/kakao-local-api': {
    target: 'https://dapi.kakao.com',
    changeOrigin: true,
    secure: true,
    rewrite: (path) => path.replace(/^\/kakao-local-api/, '')
  }
}

export default defineConfig({
  plugins: [vue()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  server: { proxy },
  preview: { proxy }
})
