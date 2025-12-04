import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styled from 'styled-components';

// 인증 필요 라우트 가드
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <LoadingWrapper>
        <Spinner />
        <LoadingText>로딩 중...</LoadingText>
      </LoadingWrapper>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// 관리자 전용 라우트 가드
export const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <LoadingWrapper>
        <Spinner />
        <LoadingText>로딩 중...</LoadingText>
      </LoadingWrapper>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// 비로그인 사용자만 접근 가능 (로그인/회원가입 페이지)
export const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <LoadingWrapper>
        <Spinner />
        <LoadingText>로딩 중...</LoadingText>
      </LoadingWrapper>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #e0e0e0;
  border-top-color: #212121;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  margin-top: 16px;
  color: #757575;
  font-size: 14px;
`;
