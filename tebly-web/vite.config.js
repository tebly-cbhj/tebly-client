import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  build: {
    // 방 커버 등 svg를 순수 import로 가져와 imageUrl로 백엔드에 저장하는 곳이 있어서,
    // 기본 인라인 임계값(4KB)에 걸려 base64 data URI로 치환되면 저장 실패(500) 원인이 된다.
    assetsInlineLimit: 0,
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    watch: {
      usePolling: true,
      interval: 300,
    },
  },
})
