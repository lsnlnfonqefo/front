import axios from 'axios';

// 개발 환경에서는 Vite 프록시를 사용 (같은 도메인으로 요청)
// 프로덕션에서는 환경 변수 사용
const isDevelopment = import.meta.env.DEV;
const baseURL = isDevelopment
  ? '/api' // Vite 프록시가 /api로 시작하는 요청을 자동으로 프록시
  : `${import.meta.env.VITE_API_BASE_URL || 'http://54.180.130.171'}/api`;

const api = axios.create({
  baseURL,
  withCredentials: true, // 쿠키를 포함한 요청
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: 쿠키 디버깅용 (개발 환경에서만)
if (isDevelopment) {
  api.interceptors.request.use(
    (config) => {
      console.log('[Axios Request]', {
        url: config.url,
        baseURL: config.baseURL,
        withCredentials: config.withCredentials,
        headers: config.headers,
      });
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 응답 인터셉터: 쿠키 확인용
  api.interceptors.response.use(
    (response) => {
      const setCookieHeader = response.headers['set-cookie'];
      if (setCookieHeader) {
        console.log('[Axios Response] Set-Cookie:', setCookieHeader);
      }
      return response;
    },
    (error) => {
      console.error('[Axios Error]', error.response?.status, error.message);
      return Promise.reject(error);
    }
  );
}

export default api;
