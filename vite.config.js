import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        // 로컬 개발: localhost:3000, 배포: EC2 서버
        target: process.env.VITE_API_URL || 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: '',
        cookiePathRewrite: '/',
        // 쿠키를 제대로 전달하기 위한 설정
        configure: (proxy, _options) => {
          proxy.on('proxyRes', (proxyRes, req, res) => {
            // Set-Cookie 헤더가 있으면 로그
            const setCookie = proxyRes.headers['set-cookie'];
            if (setCookie) {
              console.log('🍪 Proxy received Set-Cookie:', setCookie);
            }
          });
        },
      }
    }
  }
})



