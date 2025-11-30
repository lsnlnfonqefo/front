// 판매 현황 화면: 기간별 판매수량 및 매출 조회
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getSalesSummary } from '../../api/adminApi';

const Section = styled.section`
  background-color: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
`;

const DateInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2980b9;
  }

  &:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const Th = styled.th`
  background-color: #f8f9fa;
  padding: 12px;
  text-align: left;
  border-bottom: 2px solid #dee2e6;
  font-weight: 600;
  color: #333;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #dee2e6;
`;

const ErrorMessage = styled.div`
  background-color: #fee;
  color: #c33;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  border: 1px solid #fcc;
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
`;

const AdminSalesDashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // 기본값으로 이번 달 설정
  useEffect(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    setFromDate(firstDay.toISOString().split('T')[0]);
    setToDate(lastDay.toISOString().split('T')[0]);
  }, []);

  const handleSearch = async () => {
    if (!fromDate || !toDate) {
      setError('시작일과 종료일을 모두 입력해주세요.');
      return;
    }

    if (new Date(toDate) < new Date(fromDate)) {
      setError('종료일은 시작일보다 늦어야 합니다.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = { from: fromDate, to: toDate };
      const response = await getSalesSummary(params);
      
      if (response.success) {
        setSalesData(response.data.items || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || '판매 현황을 불러오는데 실패했습니다.');
      setSalesData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fromDate && toDate) {
      handleSearch();
    }
  }, []); // 초기 로드 시에는 실행하지 않음

  return (
    <Section>
      <h2>판매 현황</h2>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}

      <FilterContainer>
        <label>
          시작일:
          <DateInput
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </label>
        <label>
          종료일:
          <DateInput
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </label>
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? '조회 중...' : '조회'}
        </Button>
      </FilterContainer>

      {loading ? (
        <LoadingText>로딩 중...</LoadingText>
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                <Th>상품 ID</Th>
                <Th>상품명</Th>
                <Th>판매수량</Th>
                <Th>매출</Th>
              </tr>
            </thead>
            <tbody>
              {salesData.map((item) => (
                <tr key={item.productId}>
                  <Td>{item.productId}</Td>
                  <Td>{item.name}</Td>
                  <Td>{item.totalQuantity}</Td>
                  <Td>{item.totalRevenue?.toLocaleString()}원</Td>
                </tr>
              ))}
            </tbody>
          </Table>

          {salesData.length === 0 && !loading && (
            <EmptyMessage>해당 기간의 판매 데이터가 없습니다.</EmptyMessage>
          )}
        </>
      )}
    </Section>
  );
};

export default AdminSalesDashboard;



