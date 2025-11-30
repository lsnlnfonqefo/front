// 관리자 페이지 메인 컴포넌트
// 인증 상태를 확인하고 로그인되지 않았으면 로그인 페이지를 표시
import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import AdminLogin from '../components/admin/AdminLogin';
import { checkAdminAuth, setUnauthorizedHandler } from '../api/adminApi';

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // 401 에러 발생 시 로그인 페이지로 이동하는 핸들러 설정
    setUnauthorizedHandler(() => {
      setIsAuthenticated(false);
    });

    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      console.log('🔍 Checking authentication...');
      const response = await checkAdminAuth();
      console.log('🔍 Auth check response:', response);
      if (response.success) {
        console.log('✅ Authentication confirmed');
        setIsAuthenticated(true);
      } else {
        console.log('❌ Authentication failed:', response);
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.log('❌ Auth check error:', {
        status: err.response?.status,
        message: err.message,
        data: err.response?.data,
      });
      // 401 에러는 정상적인 경우 (로그인되지 않음)
      // 다른 에러도 로그인 페이지로 이동
      setIsAuthenticated(false);
    } finally {
      setIsChecking(false);
    }
  };

  const handleLoginSuccess = async () => {
    console.log('🔄 Login success, setting authenticated state...');
    // 로그인 성공 시 서버에서 success: true를 반환했으므로
    // 즉시 인증 상태를 true로 설정하고 관리자 페이지로 이동
    // 실제 인증 확인은 나중에 API 호출 시 자연스럽게 이루어짐
    setIsAuthenticated(true);
    setIsChecking(false);
    
    // 백그라운드에서 인증 확인 (실패해도 무시)
    // 세션 쿠키가 설정될 시간을 주고 확인
    setTimeout(async () => {
      try {
        const response = await checkAdminAuth();
        if (response.success) {
          console.log('✅ Background auth check: confirmed');
        } else {
          console.log('⚠️ Background auth check: failed (but staying logged in)');
        }
      } catch (err) {
        console.log('⚠️ Background auth check: error (but staying logged in)', err.response?.status);
        // 에러가 나도 인증 상태는 유지 (실제 API 호출 시 401이 나면 그때 처리)
      }
    }, 1000);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (isChecking) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        fontSize: '16px',
        color: '#666'
      }}>
        로딩 중...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return <AdminLayout onLogout={handleLogout} />;
};

export default AdminPage;


