// 상품 관리 화면: 상품 목록 조회 및 사이즈/할인 정책 수정
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getAdminProducts, updateProductSizes, updateProductDiscount } from '../../api/adminApi';

const Section = styled.section`
  background-color: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ErrorMessage = styled.div`
  background-color: #fee;
  color: #c33;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  border: 1px solid #fcc;
`;

const SuccessMessage = styled.div`
  background-color: #efe;
  color: #3c3;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  border: 1px solid #cfc;
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
`;

const FilterContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
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
  vertical-align: middle;
`;

const Input = styled.input`
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-right: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2980b9;
  }

  &:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }
`;

const UpdateButton = styled(Button)`
  background-color: #27ae60;

  &:hover {
    background-color: #229954;
  }
`;

const AdminProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [editingStates, setEditingStates] = useState({});

  useEffect(() => {
    // 컴포넌트가 마운트될 때만 실행 (인증이 완료된 후)
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, page]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit: 20 };
      if (category) params.category = category;
      const response = await getAdminProducts(params);
      if (response.success) {
        setProducts(response.data.items || []);
        // 각 상품의 편집 상태 초기화
        const states = {};
        response.data.items?.forEach(product => {
          states[product.id] = {
            sizes: product.sizes?.join(',') || '',
            discountRate: product.discountRate || 0,
            saleStart: product.saleStart || '',
            saleEnd: product.saleEnd || '',
          };
        });
        setEditingStates(states);
      }
    } catch (err) {
      // 401 에러는 인증 문제이므로 상위 컴포넌트에서 처리
      if (err.response?.status === 401) {
        console.error('❌ Unauthorized - redirecting to login');
        // 에러 메시지는 표시하지 않고 상위에서 처리
        setError('인증이 필요합니다. 다시 로그인해주세요.');
      } else {
        setError(err.response?.data?.message || '상품 목록을 불러오는데 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSizesChange = (productId, value) => {
    setEditingStates(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        sizes: value,
      },
    }));
  };

  const handleDiscountChange = (productId, field, value) => {
    setEditingStates(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      },
    }));
  };

  const handleUpdate = async (productId) => {
    setError(null);
    setSuccess(null);
    const state = editingStates[productId];
    
    try {
      // 사이즈 업데이트
      const sizesArray = state.sizes
        .split(',')
        .map(s => parseInt(s.trim()))
        .filter(s => !isNaN(s));
      
      await updateProductSizes(productId, sizesArray);

      // 할인 정책 업데이트
      const discountPayload = {
        discountRate: parseFloat(state.discountRate),
        saleStart: state.saleStart || null,
        saleEnd: state.saleEnd || null,
      };

      if (discountPayload.discountRate < 0 || discountPayload.discountRate > 1) {
        throw new Error('할인율은 0과 1 사이의 값이어야 합니다.');
      }

      if (discountPayload.saleStart && discountPayload.saleEnd) {
        if (new Date(discountPayload.saleEnd) < new Date(discountPayload.saleStart)) {
          throw new Error('종료일은 시작일보다 늦어야 합니다.');
        }
      }

      await updateProductDiscount(productId, discountPayload);
      
      setSuccess('상품 정보가 성공적으로 업데이트되었습니다.');
      await fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || err.message || '업데이트에 실패했습니다.');
    }
  };

  if (loading && products.length === 0) {
    return (
      <Section>
        <LoadingText>로딩 중...</LoadingText>
      </Section>
    );
  }

  return (
    <Section>
      <h2>상품 관리</h2>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      <FilterContainer>
        <label>
          카테고리:
          <Select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
            <option value="">전체</option>
            <option value="lifestyle">Lifestyle</option>
            <option value="slipon">Slipon</option>
            <option value="sneakers">Sneakers</option>
          </Select>
        </label>
        <Button onClick={fetchProducts}>새로고침</Button>
      </FilterContainer>

      <Table>
        <thead>
          <tr>
            <Th>ID</Th>
            <Th>이름</Th>
            <Th>가격</Th>
            <Th>할인율</Th>
            <Th>카테고리</Th>
            <Th>사이즈</Th>
            <Th>소재</Th>
            <Th>신제품</Th>
            <Th>세일</Th>
            <Th>사이즈 수정</Th>
            <Th>할인 정책</Th>
            <Th>액션</Th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <Td>{product.id}</Td>
              <Td>{product.name}</Td>
              <Td>{product.price?.toLocaleString()}원</Td>
              <Td>{(product.discountRate * 100).toFixed(0)}%</Td>
              <Td>{product.categories?.join(', ') || '-'}</Td>
              <Td>{product.sizes?.join(', ') || '-'}</Td>
              <Td>{product.material || '-'}</Td>
              <Td>{product.isNew ? '✓' : '-'}</Td>
              <Td>{product.isOnSale ? '✓' : '-'}</Td>
              <Td>
                <Input
                  type="text"
                  value={editingStates[product.id]?.sizes || ''}
                  onChange={(e) => handleSizesChange(product.id, e.target.value)}
                  placeholder="250,255,260"
                />
              </Td>
              <Td>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Input
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={editingStates[product.id]?.discountRate || 0}
                    onChange={(e) => handleDiscountChange(product.id, 'discountRate', e.target.value)}
                    placeholder="할인율"
                    style={{ width: '80px' }}
                  />
                  <Input
                    type="date"
                    value={editingStates[product.id]?.saleStart || ''}
                    onChange={(e) => handleDiscountChange(product.id, 'saleStart', e.target.value)}
                    style={{ fontSize: '12px' }}
                  />
                  <Input
                    type="date"
                    value={editingStates[product.id]?.saleEnd || ''}
                    onChange={(e) => handleDiscountChange(product.id, 'saleEnd', e.target.value)}
                    style={{ fontSize: '12px' }}
                  />
                </div>
              </Td>
              <Td>
                <UpdateButton onClick={() => handleUpdate(product.id)}>
                  업데이트
                </UpdateButton>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      {products.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          등록된 상품이 없습니다.
        </div>
      )}
    </Section>
  );
};

export default AdminProductList;


