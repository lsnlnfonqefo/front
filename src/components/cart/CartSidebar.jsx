import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { orderAPI } from '../../api';

const CartSidebar = () => {
  const { cart, isOpen, closeCart, updateItem, removeItem, fetchCart } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateItem(itemId, newQuantity);
    } catch (error) {
      console.error('수량 변경 실패:', error);
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await removeItem(itemId);
    } catch (error) {
      console.error('삭제 실패:', error);
    }
  };

  const handleCheckout = async () => {
    if (cart.items.length === 0) {
      alert('장바구니가 비어있습니다.');
      return;
    }

    try {
      await orderAPI.createOrder('CARD');
      await fetchCart();
      closeCart();
      alert('주문이 완료되었습니다!');
      navigate('/mypage');
    } catch (error) {
      alert('주문 처리 중 오류가 발생했습니다.');
    }
  };

  const formatPrice = (price) => price?.toLocaleString() || 0;

  return (
    <>
      <Overlay $isOpen={isOpen} onClick={closeCart} />
      <SidebarWrapper $isOpen={isOpen}>
        <SidebarHeader>
          <CloseButton onClick={closeCart}>✕</CloseButton>
          <Title>장바구니 ({cart.items?.length || 0})</Title>
          <Subtitle>(구매예약 수량 합산 불가)</Subtitle>
        </SidebarHeader>

        <FreeShippingBanner>
          🎉 축하합니다! 무료 배송 혜택을 받으셨습니다.
        </FreeShippingBanner>

        <SidebarContent>
          {cart.items?.length === 0 ? (
            <EmptyCart>
              <EmptyIcon>🛒</EmptyIcon>
              <EmptyText>장바구니가 비어있습니다</EmptyText>
            </EmptyCart>
          ) : (
            <CartItems>
              {cart.items?.map((item) => (
                <CartItem key={item.id}>
                  <ItemImage>
                    {item.product?.images?.[0] || item.imageUrl ? (
                      <img 
                        src={item.product?.images?.[0] || item.imageUrl} 
                        alt={item.product?.name || item.productName} 
                      />
                    ) : (
                      <PlaceholderImage>🖼️</PlaceholderImage>
                    )}
                  </ItemImage>
                  <ItemInfo>
                    <ItemName>{item.product?.name || item.productName}</ItemName>
                    <ItemDetails>사이즈: {item.size}</ItemDetails>
                    <QuantityControl>
                      <QuantityButton onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</QuantityButton>
                      <Quantity>{item.quantity}</Quantity>
                      <QuantityButton onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</QuantityButton>
                    </QuantityControl>
                  </ItemInfo>
                  <ItemRight>
                    <RemoveButton onClick={() => handleRemove(item.id)}>✕</RemoveButton>
                    <ItemPrice>₩{formatPrice(item.finalPrice * item.quantity)}</ItemPrice>
                  </ItemRight>
                </CartItem>
              ))}
            </CartItems>
          )}
        </SidebarContent>

        {cart.items?.length > 0 && (
          <SidebarFooter>
            <TotalRow>
              <TotalLabel>합계</TotalLabel>
              <TotalPrice>₩{formatPrice(cart.total)}</TotalPrice>
            </TotalRow>
            <CheckoutButton onClick={handleCheckout}>결제하기</CheckoutButton>
            <ContinueButton onClick={closeCart}>쇼핑 계속하기</ContinueButton>
          </SidebarFooter>
        )}
      </SidebarWrapper>
    </>
  );
};

export default CartSidebar;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
  transition: opacity 0.3s, visibility 0.3s;
  z-index: 1100;
`;

const SidebarWrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 420px;
  height: 100vh;
  background: #fff;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
  transform: translateX(${({ $isOpen }) => ($isOpen ? '0' : '100%')});
  transition: transform 0.3s ease;
  z-index: 1200;
  display: flex;
  flex-direction: column;
`;

const SidebarHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #e0e0e0;
`;

const CloseButton = styled.button`
  font-size: 20px;
  color: #757575;
  margin-bottom: 12px;
  &:hover { color: #212121; }
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
`;

const Subtitle = styled.p`
  font-size: 12px;
  color: #757575;
  margin-top: 4px;
`;

const FreeShippingBanner = styled.div`
  background: #E8F5E9;
  color: #2E7D32;
  text-align: center;
  padding: 12px;
  font-size: 13px;
`;

const SidebarContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
`;

const EmptyCart = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #757575;
`;

const EmptyIcon = styled.span`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const EmptyText = styled.p`
  font-size: 16px;
`;

const CartItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CartItem = styled.div`
  display: flex;
  gap: 16px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
`;

const ItemImage = styled.div`
  width: 100px;
  height: 100px;
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  img { width: 100%; height: 100%; object-fit: cover; }
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.h3`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
`;

const ItemDetails = styled.div`
  font-size: 12px;
  color: #757575;
  margin-bottom: 12px;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const QuantityButton = styled.button`
  width: 28px;
  height: 28px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 16px;
  &:hover { background: #f5f5f5; }
`;

const Quantity = styled.span`
  font-size: 14px;
  min-width: 20px;
  text-align: center;
`;

const ItemRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
`;

const RemoveButton = styled.button`
  font-size: 14px;
  color: #757575;
  &:hover { color: #212121; }
`;

const ItemPrice = styled.span`
  font-size: 14px;
  font-weight: 600;
`;

const SidebarFooter = styled.div`
  padding: 20px 24px;
  border-top: 1px solid #e0e0e0;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const TotalLabel = styled.span`
  font-size: 16px;
  font-weight: 500;
`;

const TotalPrice = styled.span`
  font-size: 20px;
  font-weight: 700;
`;

const CheckoutButton = styled.button`
  width: 100%;
  padding: 16px;
  background: #212121;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  border-radius: 4px;
  margin-bottom: 12px;
  &:hover { background: #424242; }
`;

const ContinueButton = styled.button`
  width: 100%;
  padding: 16px;
  border: 1px solid #212121;
  font-size: 16px;
  font-weight: 600;
  border-radius: 4px;
  &:hover { background: #f5f5f5; }
`;
