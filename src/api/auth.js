import api from './axios';

export const authAPI = {
  // POST /api/auth/login - 로그인
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // POST /api/auth/logout - 로그아웃
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // GET /api/auth/me - 내 정보 조회
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};
