// 관리자 페이지의 기본 레이아웃 컴포넌트
// 상단 제목과 탭/버튼으로 각 기능 화면을 전환
import React, { useState } from 'react';
import styled from 'styled-components';
import AdminProductList from './AdminProductList';
import AdminProductForm from './AdminProductForm';
import AdminSalesDashboard from './AdminSalesDashboard';
import { adminLogout } from '../../api/adminApi';

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const Header = styled.header`
  background-color: #2c3e50;
  color: white;
  padding: 20px 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
`;

const LogoutButton = styled.button`
  padding: 8px 16px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: background-color 0.2s;

  &:hover {
    background-color: #c0392b;
  }
`;

const TabContainer = styled.div`
  background-color: white;
  border-bottom: 2px solid #e0e0e0;
  padding: 0 30px;
  display: flex;
  gap: 0;
`;

const TabButton = styled.button`
  padding: 15px 30px;
  background-color: ${props => props.$active ? '#3498db' : 'transparent'};
  color: ${props => props.$active ? 'white' : '#333'};
  border: none;
  border-bottom: 3px solid ${props => props.$active ? '#2980b9' : 'transparent'};
  cursor: pointer;
  font-size: 16px;
  font-weight: ${props => props.$active ? '600' : '400'};
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.$active ? '#3498db' : '#f0f0f0'};
  }
`;

const ContentArea = styled.div`
  padding: 30px;
`;

const AdminLayout = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('products');

  const handleLogout = async () => {
    try {
      await adminLogout();
      onLogout();
    } catch (err) {
      console.error('로그아웃 실패:', err);
      onLogout(); // 에러가 나도 로그아웃 처리
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return <AdminProductList />;
      case 'register':
        return <AdminProductForm />;
      case 'sales':
        return <AdminSalesDashboard />;
      default:
        return <AdminProductList />;
    }
  };

  return (
    <Container>
      <Header>
        <Title>관리자 페이지</Title>
        <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
      </Header>
      <TabContainer>
        <TabButton 
          $active={activeTab === 'products'} 
          onClick={() => setActiveTab('products')}
        >
          상품 관리
        </TabButton>
        <TabButton 
          $active={activeTab === 'register'} 
          onClick={() => setActiveTab('register')}
        >
          상품 등록
        </TabButton>
        <TabButton 
          $active={activeTab === 'sales'} 
          onClick={() => setActiveTab('sales')}
        >
          판매 현황
        </TabButton>
      </TabContainer>
      <ContentArea>
        {renderContent()}
      </ContentArea>
    </Container>
  );
};

export default AdminLayout;


