import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 환경 변수 로드
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://54.180.130.171',
          changeOrigin: true,
          secure: false,
          // 쿠키와 인증 헤더를 포함한 요청을 위해 필요
          configure: (proxy, _options) => {
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              // 쿠키가 있으면 전달
              if (req.headers.cookie) {
                proxyReq.setHeader('Cookie', req.headers.cookie);
              }
            });
            
            // 응답에서 Set-Cookie 헤더를 클라이언트로 전달
            proxy.on('proxyRes', (proxyRes, req, res) => {
              const setCookie = proxyRes.headers['set-cookie'];
              if (setCookie) {
                res.setHeader('Set-Cookie', setCookie);
              }
            });
          },
        },
      },
    },
  }
})
