import { useState } from "react";
import { Navigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../hooks/useAuth";
import ProductManagement from "../components/Admin/ProductManagement";
import SalesStatistics from "../components/Admin/SalesStatistics";
import ProductForm from "../components/Admin/ProductForm";

const Container = styled.div`
  max-width: 1400px;
  margin: 40px auto;
  padding: 0 20px;
`;

const Header = styled.div`
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #666;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  border-bottom: 2px solid #e0e0e0;
`;

const Tab = styled.button`
  padding: 12px 24px;
  background: none;
  border: none;
  border-bottom: 3px solid ${(props) => (props.active ? "#000" : "transparent")};
  font-size: 16px;
  font-weight: ${(props) => (props.active ? "600" : "400")};
  color: ${(props) => (props.active ? "#000" : "#666")};
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: -2px;

  &:hover {
    color: #000;
  }
`;

const Content = styled.div``;

export default function AdminPage() {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState("products");
  const [showProductForm, setShowProductForm] = useState(false);

  // 관리자가 아니면 로그인 페이지로 리다이렉트
  if (!user || !isAdmin()) {
    return <Navigate to="/login" replace />;
  }

  const handleAddProduct = () => {
    setShowProductForm(true);
  };

  const handleFormSuccess = () => {
    setShowProductForm(false);
    setActiveTab("products");
  };

  const handleFormCancel = () => {
    setShowProductForm(false);
  };

  return (
    <Container>
      <Header>
        <Title>관리자 페이지</Title>
        <Subtitle>{user.name}님 환영합니다</Subtitle>
      </Header>

      {!showProductForm && (
        <TabContainer>
          <Tab
            active={activeTab === "products"}
            onClick={() => setActiveTab("products")}
          >
            상품 관리
          </Tab>
          <Tab
            active={activeTab === "sales"}
            onClick={() => setActiveTab("sales")}
          >
            판매 현황
          </Tab>
        </TabContainer>
      )}

      <Content>
        {showProductForm ? (
          <ProductForm
            onCancel={handleFormCancel}
            onSuccess={handleFormSuccess}
          />
        ) : activeTab === "products" ? (
          <ProductManagement onAddProduct={handleAddProduct} />
        ) : (
          <SalesStatistics />
        )}
      </Content>
    </Container>
  );
}
