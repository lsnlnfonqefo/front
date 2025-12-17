import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // localStorage에서 사용자 정보 복원
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      if (import.meta.env.DEV) {
        console.log('[checkAuth] 세션 확인 시작, 현재 쿠키:', document.cookie);
      }
      
      const response = await authAPI.getMe();
      const userData = response?.data?.user || response?.user || null;
      
      if (import.meta.env.DEV) {
        console.log('[checkAuth] 응답:', response);
        console.log('[checkAuth] 사용자 데이터:', userData);
      }
      
      if (userData) {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (error) {
      // 401은 쿠키 만료 - localStorage 정보는 유지 (UI용)
      if (import.meta.env.DEV) {
        console.warn('[checkAuth] 세션 확인 실패:', error.response?.status, error.message);
        console.warn('[checkAuth] 현재 쿠키:', document.cookie);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      const userData = response?.data?.user || response?.user || null;
      
      if (import.meta.env.DEV) {
        console.log('[Login] 응답:', response);
        console.log('[Login] 사용자 데이터:', userData);
        // 브라우저 쿠키 확인
        console.log('[Login] 현재 쿠키:', document.cookie);
      }
      
      if (userData) {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // 로그인 후 세션 확인 (쿠키가 제대로 설정되었는지 확인)
        setTimeout(async () => {
          try {
            await checkAuth();
          } catch (error) {
            console.error('[Login] 세션 확인 실패:', error);
          }
        }, 100);
      }
      
      return response;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('[Login] 에러:', error);
        console.error('[Login] 응답 데이터:', error.response?.data);
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('로그아웃 에러:', error);
    }
    setUser(null);
    localStorage.removeItem('user');
  };

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'admin';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAdmin,
        isAuthenticated,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
