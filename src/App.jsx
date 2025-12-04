import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import styled from 'styled-components';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import GlobalStyle from './styles/GlobalStyle';
import theme from './styles/theme';
import Layout from './components/layout/Layout';
import { ProtectedRoute, AdminRoute, GuestRoute } from './components/common/AuthGuard';

// Pages
import MainPage from './pages/MainPage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import MyPage from './pages/MyPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <AuthProvider>
          <CartProvider>
            <Layout>
              <Routes>
                {/* 공개 라우트 */}
                <Route path="/" element={<MainPage />} />
                <Route path="/products" element={<ProductListPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />

                {/* 비로그인 사용자 전용 */}
                <Route
                  path="/login"
                  element={
                    <GuestRoute>
                      <LoginPage />
                    </GuestRoute>
                  }
                />

                {/* 로그인 사용자 전용 */}
                <Route
                  path="/mypage"
                  element={
                    <ProtectedRoute>
                      <MyPage />
                    </ProtectedRoute>
                  }
                />

                {/* 관리자 전용 */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminPage />
                    </AdminRoute>
                  }
                />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </CartProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

// 404 페이지
const NotFound = () => {
  return (
    <NotFoundWrapper>
      <h1>404</h1>
      <p>페이지를 찾을 수 없습니다.</p>
    </NotFoundWrapper>
  );
};

const NotFoundWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;

  h1 {
    font-size: 80px;
    font-weight: 700;
    color: #212121;
    margin-bottom: 16px;
  }

  p {
    font-size: 18px;
    color: #757575;
  }
`;

export default App;
