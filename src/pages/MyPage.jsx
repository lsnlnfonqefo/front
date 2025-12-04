import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { orderAPI, reviewAPI } from '../api';
import { useAuth } from '../context/AuthContext';

const MyPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  
  // PPT slide10: 후기 작성 모달
  const [reviewModal, setReviewModal] = useState({ open: false, productId: null, productName: '' });
  const [reviewForm, setReviewForm] = useState({ rating: 5, content: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const orderList = await orderAPI.getOrders();
      setOrders(Array.isArray(orderList) ? orderList : []);
    } catch (error) {
      console.error('주문 내역 조회 실패:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // PPT slide10: 후기 입력 (1~5점 별점과 텍스트)
  const openReviewModal = (productId, productName) => {
    setReviewModal({ open: true, productId, productName });
    setReviewForm({ rating: 5, content: '' });
  };

  const closeReviewModal = () => {
    setReviewModal({ open: false, productId: null, productName: '' });
  };

  const handleReviewSubmit = async () => {
    if (!reviewForm.content.trim()) {
      alert('리뷰 내용을 입력해주세요.');
      return;
    }

    setSubmittingReview(true);
    try {
      await reviewAPI.createReview(reviewModal.productId, reviewForm.rating, reviewForm.content);
      alert('리뷰가 등록되었습니다.');
      closeReviewModal();
    } catch (error) {
      alert('리뷰 등록에 실패했습니다.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const formatPrice = (price) => price?.toLocaleString() || 0;
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  // PPT slide10: 1~5점 별점
  const renderStars = (rating, interactive = false) => (
    <StarsWrapper>
      {[1, 2, 3, 4, 5].map((star) => (
        <StarButton
          key={star}
          type="button"
          $filled={star <= rating}
          $interactive={interactive}
          onClick={() => interactive && setReviewForm((prev) => ({ ...prev, rating: star }))}
        >
          ★
        </StarButton>
      ))}
    </StarsWrapper>
  );

  return (
    <PageWrapper>
      {/* PPT slide9: 마이페이지 좌측 메뉴 */}
      <Sidebar>
        <SidebarTitle>마이페이지</SidebarTitle>
        <SidebarMenu>
          <SidebarItem $active={activeTab === 'info'} onClick={() => setActiveTab('info')}>
            회원 정보
          </SidebarItem>
          <SidebarItem $active={activeTab === 'orders'} onClick={() => setActiveTab('orders')}>
            지난 주문 내역
          </SidebarItem>
          <SidebarItem>주문 정보 등록</SidebarItem>
          <SidebarItem>올멤버스 혜택</SidebarItem>
        </SidebarMenu>
        <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
      </Sidebar>

      {/* PPT slide9: 지난 주문 내역 */}
      <ContentSection>
        <ContentTitle>지난 주문 내역</ContentTitle>

        {loading ? (
          <LoadingWrapper><Spinner /></LoadingWrapper>
        ) : orders.length === 0 ? (
          <EmptyState>주문 내역이 없습니다.</EmptyState>
        ) : (
          <OrderTable>
            <thead>
              <tr>
                <th>제품명</th>
                <th>수량</th>
                <th>결제금액</th>
                <th>결제일</th>
                <th>후기</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                (order.items || order.orderItems || []).map((item, index) => (
                  <tr key={`${order.id}-${index}`}>
                    {/* PPT slide9: 제품명 */}
                    <td>
                      <ProductCell>
                        제품명: {item.product?.name || item.productName}
                      </ProductCell>
                    </td>
                    {/* PPT slide9: 수량 */}
                    <td>수량: {item.quantity}개</td>
                    {/* PPT slide9: 결제금액 */}
                    <td>결제금액: {formatPrice(item.price * item.quantity)}원</td>
                    {/* PPT slide9: 결제일 */}
                    <td>결제일: {formatDate(order.createdAt)}</td>
                    {/* PPT slide9: 후기작성 버튼 */}
                    <td>
                      <ReviewButton
                        onClick={() => openReviewModal(
                          item.product?.id || item.productId,
                          item.product?.name || item.productName
                        )}
                      >
                        후기작성
                      </ReviewButton>
                    </td>
                  </tr>
                ))
              ))}
            </tbody>
          </OrderTable>
        )}
      </ContentSection>

      {/* PPT slide10: 후기 입력 모달 */}
      {reviewModal.open && (
        <>
          <ModalOverlay onClick={closeReviewModal} />
          <ReviewModal>
            <ModalHeader>
              <ModalTitle>후기 작성</ModalTitle>
              <ModalClose onClick={closeReviewModal}>✕</ModalClose>
            </ModalHeader>
            <ModalContent>
              <ProductNameDisplay>{reviewModal.productName}</ProductNameDisplay>
              
              {/* PPT slide10: 1~5점 별점 */}
              <RatingSection>
                <RatingLabel>별점</RatingLabel>
                {renderStars(reviewForm.rating, true)}
              </RatingSection>
              
              {/* PPT slide10: 텍스트 후기 */}
              <TextareaSection>
                <TextareaLabel>리뷰 내용</TextareaLabel>
                <Textarea
                  value={reviewForm.content}
                  onChange={(e) => setReviewForm((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="제품에 대한 솔직한 후기를 남겨주세요."
                  rows={5}
                />
              </TextareaSection>
            </ModalContent>
            <ModalFooter>
              <CancelButton onClick={closeReviewModal}>취소</CancelButton>
              <SubmitButton onClick={handleReviewSubmit} disabled={submittingReview}>
                {submittingReview ? '등록 중...' : '등록하기'}
              </SubmitButton>
            </ModalFooter>
          </ReviewModal>
        </>
      )}
    </PageWrapper>
  );
};

export default MyPage;

// Styled Components
const PageWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px;
  display: flex;
  gap: 60px;
`;

/* PPT slide9: 좌측 사이드바 */
const Sidebar = styled.aside`
  width: 200px;
  flex-shrink: 0;
`;

const SidebarTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #212121;
`;

const SidebarMenu = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
`;

const SidebarItem = styled.li`
  padding: 12px 0;
  font-size: 14px;
  color: ${({ $active }) => ($active ? '#212121' : '#757575')};
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  cursor: pointer;
  border-bottom: 1px solid #e0e0e0;

  &:hover {
    color: #212121;
  }
`;

const LogoutButton = styled.button`
  font-size: 13px;
  color: #757575;
  text-decoration: underline;

  &:hover {
    color: #212121;
  }
`;

const ContentSection = styled.main`
  flex: 1;
`;

const ContentTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 24px;
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 60px;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #e0e0e0;
  border-top-color: #212121;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px;
  color: #757575;
  background: #f5f5f5;
  border-radius: 8px;
`;

/* PPT slide9: 주문 내역 테이블 */
const OrderTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 16px;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
    font-size: 14px;
  }

  th {
    font-weight: 600;
    background: #f5f5f5;
  }
`;

const ProductCell = styled.div`
  font-weight: 500;
`;

const ReviewButton = styled.button`
  padding: 8px 16px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 13px;

  &:hover {
    background: #212121;
    color: #fff;
  }
`;

/* 모달 */
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const ReviewModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 480px;
  background: #fff;
  border-radius: 12px;
  z-index: 1001;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e0e0e0;
`;

const ModalTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
`;

const ModalClose = styled.button`
  font-size: 20px;
  color: #757575;

  &:hover {
    color: #212121;
  }
`;

const ModalContent = styled.div`
  padding: 24px;
`;

const ProductNameDisplay = styled.p`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e0e0e0;
`;

const RatingSection = styled.div`
  margin-bottom: 24px;
`;

const RatingLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 12px;
`;

const StarsWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

const StarButton = styled.button`
  font-size: 28px;
  color: ${({ $filled }) => ($filled ? '#FFB300' : '#e0e0e0')};
  cursor: ${({ $interactive }) => ($interactive ? 'pointer' : 'default')};
  transition: color 0.2s;
`;

const TextareaSection = styled.div``;

const TextareaLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 12px;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 15px;
  resize: none;

  &:focus {
    outline: none;
    border-color: #212121;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #e0e0e0;
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 14px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;

  &:hover {
    background: #f5f5f5;
  }
`;

const SubmitButton = styled.button`
  flex: 1;
  padding: 14px;
  background: #212121;
  color: #fff;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;

  &:hover:not(:disabled) {
    background: #424242;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;
