import { useState, useEffect } from "react";
import styled from "styled-components";
import adminService from "../../api/adminService";

const Container = styled.div`
  background: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 15px;
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
`;

const DateInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #000;
  }
`;

const FilterButton = styled.button`
  padding: 8px 20px;
  background: #000;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #333;
  }
`;

const SummaryCards = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
`;

const SummaryCard = styled.div`
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: center;
`;

const CardLabel = styled.p`
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
`;

const CardValue = styled.p`
  font-size: 24px;
  font-weight: 700;
  color: #000;
`;

const SalesTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Thead = styled.thead`
  background: #f8f9fa;
`;

const Th = styled.th`
  padding: 12px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  border-bottom: 2px solid #e0e0e0;
`;

const Tbody = styled.tbody``;

const Tr = styled.tr`
  &:hover {
    background: #f8f9fa;
  }
`;

const Td = styled.td`
  padding: 12px;
  font-size: 14px;
  border-bottom: 1px solid #f0f0f0;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #999;
`;

export default function SalesStatistics() {
  const [statistics, setStatistics] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    setLoading(true);
    try {
      const data = await adminService.getSalesStatistics(startDate, endDate);
      setStatistics(data);
    } catch (error) {
      console.error("Failed to load statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    if (startDate && endDate && startDate > endDate) {
      alert("종료일은 시작일보다 이후여야 합니다.");
      return;
    }
    loadStatistics();
  };

  const getTotalSales = () => {
    return statistics.reduce((sum, item) => sum + item.salesCount, 0);
  };

  const getTotalRevenue = () => {
    return statistics.reduce((sum, item) => sum + item.revenue, 0);
  };

  const getAveragePrice = () => {
    const total = getTotalRevenue();
    const count = getTotalSales();
    return count > 0 ? Math.round(total / count) : 0;
  };

  return (
    <Container>
      <Header>
        <Title>판매 현황</Title>
        <FilterGroup>
          <Label>시작일:</Label>
          <DateInput
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Label>종료일:</Label>
          <DateInput
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <FilterButton onClick={handleFilter}>조회</FilterButton>
        </FilterGroup>
      </Header>

      <SummaryCards>
        <SummaryCard>
          <CardLabel>총 판매 수량</CardLabel>
          <CardValue>{getTotalSales()}개</CardValue>
        </SummaryCard>
        <SummaryCard>
          <CardLabel>총 매출</CardLabel>
          <CardValue>₩{getTotalRevenue().toLocaleString()}</CardValue>
        </SummaryCard>
        <SummaryCard>
          <CardLabel>평균 판매가</CardLabel>
          <CardValue>₩{getAveragePrice().toLocaleString()}</CardValue>
        </SummaryCard>
      </SummaryCards>

      {loading ? (
        <EmptyState>데이터를 불러오는 중...</EmptyState>
      ) : statistics.length === 0 ? (
        <EmptyState>판매 내역이 없습니다.</EmptyState>
      ) : (
        <SalesTable>
          <Thead>
            <Tr>
              <Th>상품명</Th>
              <Th>판매 수량</Th>
              <Th>매출</Th>
            </Tr>
          </Thead>
          <Tbody>
            {statistics.map((item) => (
              <Tr key={item.productId}>
                <Td>{item.productName}</Td>
                <Td>{item.salesCount}개</Td>
                <Td>₩{item.revenue.toLocaleString()}</Td>
              </Tr>
            ))}
          </Tbody>
        </SalesTable>
      )}
    </Container>
  );
}
// ... 기존 코드

const loadStatistics = async () => {
  setLoading(true);
  try {
    // from, to 파라미터로 변경
    const data = await adminService.getSalesStatistics(startDate, endDate);
    setStatistics(data);
  } catch (error) {
    console.error("Failed to load statistics:", error);
  } finally {
    setLoading(false);
  }
};
