// axios 인스턴스 및 관리자 관련 API 함수들
import axios from 'axios';

// axios 기본 설정
// Vite 프록시를 사용하므로 baseURL은 빈 문자열 (상대 경로 사용)
// 프록시가 /api 요청을 http://54.180.130.171로 전달
const adminApi = axios.create({
  baseURL: '', // 프록시 사용 시 빈 문자열 또는 '/api' 제거
  withCredentials: true,
});

// 요청 interceptor: 디버깅용 로그
adminApi.interceptors.request.use(
  (config) => {
    const cookies = document.cookie;
    const fullURL = config.baseURL ? `${config.baseURL}${config.url}` : config.url;
    const hasSessionCookie = cookies.includes('sessionId');
    
    console.log('🚀 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      fullURL: fullURL,
      data: config.data,
      withCredentials: config.withCredentials,
      cookies: cookies || 'none',
      hasSessionCookie: hasSessionCookie,
    });
    
    // 세션이 필요한 요청인데 쿠키가 없으면 경고
    if (!hasSessionCookie && !config.url?.includes('/api/auth/login')) {
      console.warn('⚠️ Request without session cookie:', config.url);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// 401 에러 발생 시 로그인 페이지로 리다이렉트하는 콜백 함수
let onUnauthorized = null;

export const setUnauthorizedHandler = (handler) => {
  onUnauthorized = handler;
};

// 응답 interceptor: 401 에러 처리 및 디버깅 로그
adminApi.interceptors.response.use(
  (response) => {
    // 쿠키 관련 헤더 확인 (여러 방법 시도)
    const setCookieHeader1 = response.headers['set-cookie'];
    const setCookieHeader2 = response.headers['Set-Cookie'];
    const setCookieHeader3 = response.headers.getSetCookie ? response.headers.getSetCookie() : null;
    const allHeaders = {};
    try {
      // 모든 헤더 확인
      response.headers.forEach && response.headers.forEach((value, key) => {
        allHeaders[key] = value;
      });
    } catch (e) {
      // forEach가 없을 수 있음
    }
    const cookies = document.cookie;
    
    // 로그인 응답인 경우 쿠키 정보를 더 자세히 로그
    const isLoginResponse = response.config.url?.includes('/api/auth/login');
    
    console.log('✅ API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data,
      setCookieHeader1: setCookieHeader1 || 'none',
      setCookieHeader2: setCookieHeader2 || 'none',
      setCookieHeader3: setCookieHeader3 || 'none',
      currentCookies: cookies || 'none',
      allHeaders: Object.keys(allHeaders).length > 0 ? allHeaders : 'use responseHeaders object',
      responseHeadersKeys: Object.keys(response.headers || {}),
    });
    
    // 로그인 성공 시 쿠키 확인
    if (isLoginResponse && response.data?.success) {
      console.log('🍪 Login Response - Cookie Check:', {
        hasSetCookie: !!(setCookieHeader1 || setCookieHeader2 || setCookieHeader3),
        setCookieValue: setCookieHeader1 || setCookieHeader2 || setCookieHeader3,
        documentCookies: document.cookie,
        allResponseHeaders: response.headers,
      });
      
      // 쿠키가 설정되지 않았다면 경고
      if (!setCookieHeader1 && !setCookieHeader2 && !setCookieHeader3) {
        console.warn('⚠️ WARNING: Set-Cookie header not found in login response!');
      }
    }
    
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      fullURL: error.config ? (error.config.baseURL ? `${error.config.baseURL}${error.config.url}` : error.config.url) : 'N/A',
      data: error.response?.data,
      message: error.message,
    });
    
    // 500 에러인 경우 상세 정보 출력
    if (error.response?.status === 500) {
      console.error('🔴 500 Internal Server Error Details:', {
        message: error.response?.data?.message,
        code: error.response?.data?.code,
        error: error.response?.data?.error,
        fullResponse: JSON.stringify(error.response?.data, null, 2),
      });
    }
    
    if (error.response?.status === 401) {
      // 로그인 API는 401 에러를 그대로 전달
      if (error.config?.url?.includes('/api/auth/login')) {
        return Promise.reject(error);
      }
      // 다른 API의 401 에러는 인증 실패로 처리
      if (onUnauthorized) {
        onUnauthorized();
      }
    }
    return Promise.reject(error);
  }
);

/**
 * 관리자용 상품 목록 조회
 * @param {Object} params - { category, page, limit }
 * @returns {Promise}
 */
export const getAdminProducts = async (params = {}) => {
  const response = await adminApi.get('/api/admin/products', { params });
  return response.data;
};

/**
 * 가용 사이즈 변경
 * @param {number} productId - 상품 ID
 * @param {Array<number>} sizes - 사이즈 배열
 * @returns {Promise}
 */
export const updateProductSizes = async (productId, sizes) => {
  const response = await adminApi.patch(`/api/admin/products/${productId}/sizes`, { sizes });
  return response.data;
};

/**
 * 할인 정책 변경
 * @param {number} productId - 상품 ID
 * @param {Object} payload - { discountRate, saleStart, saleEnd }
 * @returns {Promise}
 */
export const updateProductDiscount = async (productId, payload) => {
  console.log('updateProductDiscount 호출:', { productId, payload });
  const response = await adminApi.patch(`/api/admin/products/${productId}/discount`, payload);
  console.log('updateProductDiscount 응답:', response.data);
  return response.data;
};

/**
 * 상품 등록
 * @param {Object} payload - 상품 정보 객체
 * @returns {Promise}
 */
export const createProduct = async (payload) => {
  console.log('📦 createProduct payload:', {
    ...payload,
    imageUrls: payload.imageUrls?.map(url => url.substring(0, 50) + '...'),
  });
  
  try {
    const response = await adminApi.post('/api/admin/products', payload);
    console.log('✅ createProduct success:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ createProduct error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};

/**
 * 판매 현황 조회
 * @param {Object} params - { from, to }
 * @returns {Promise}
 */
export const getSalesSummary = async (params = {}) => {
  const response = await adminApi.get('/api/admin/sales', { params });
  return response.data;
};

/**
 * 관리자 로그인
 * @param {Object} credentials - { username, password } 또는 { email, password }
 * @returns {Promise}
 */
export const adminLogin = async (credentials) => {
  console.log('🔐 Login Attempt:', {
    credentials: {
      ...credentials,
      password: '***' // 비밀번호는 마스킹
    },
    passwordType: typeof credentials.password,
    usernameType: typeof credentials.username,
    emailType: typeof credentials.email,
  });
  
  const response = await adminApi.post('/api/auth/login', credentials);
  console.log('✅ Login Success:', response.data);
  return response.data;
};

/**
 * 관리자 로그아웃
 * @returns {Promise}
 */
export const adminLogout = async () => {
  const response = await adminApi.post('/api/auth/logout');
  return response.data;
};

/**
 * 관리자 인증 상태 확인
 * @returns {Promise}
 */
export const checkAdminAuth = async () => {
  const response = await adminApi.get('/api/auth/me');
  return response.data;
};


