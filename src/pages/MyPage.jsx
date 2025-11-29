import { useState, useEffect } from "react";
import styled from "styled-components";
import orderService from "../api/orderService";
import OrderItem from "../components/MyPage/OrderItem";

const Container = styled.div`
  max-width: 1000px;
  margin: 40px auto;
  padding: 0 20px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 30px;
`;

const Section = styled.section`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #000;
`;

const EmptyOrders = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #999;
`;

export default function MyPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getOrders();
      setOrders(
        data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
      );
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <EmptyOrders>주문 내역을 불러오는 중...</EmptyOrders>
      </Container>
    );
  }

  return (
    <Container>
      <Title>마이페이지</Title>
      <Section>
        <SectionTitle>지난 주문 내역</SectionTitle>
        {orders.length === 0 ? (
          <EmptyOrders>주문 내역이 없습니다.</EmptyOrders>
        ) : (
          orders.map((order) => <OrderItem key={order.id} order={order} />)
        )}
      </Section>
    </Container>
  );
}
