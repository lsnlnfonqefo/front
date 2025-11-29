import { useCart } from "../../hooks/useCart";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import orderService from "../../api/orderService";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: ${(props) => (props.$isOpen ? "block" : "none")};
`;

const Sidebar = styled.div`
  position: fixed;
  top: 0;
  right: ${(props) => (props.$isOpen ? "0" : "-400px")};
  width: 400px;
  height: 100vh;
  background: white;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: right 0.3s ease;
  display: flex;
  flex-direction: column;
`;
const Header = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;

  &:hover {
    color: #000;
  }
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
`;

const CartItem = styled.div`
  display: flex;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
`;

const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.h3`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 5px;
`;

const ItemSize = styled.p`
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
`;

const ItemPrice = styled.p`
  font-size: 14px;
  font-weight: 600;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
`;

const QuantityButton = styled.button`
  width: 24px;
  height: 24px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    border-color: #000;
  }
`;

const Quantity = styled.span`
  font-size: 14px;
  min-width: 20px;
  text-align: center;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 12px;
  margin-top: 5px;

  &:hover {
    color: #e74c3c;
  }
`;

const Footer = styled.div`
  padding: 20px;
  border-top: 1px solid #e0e0e0;
`;

const TotalSection = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const TotalLabel = styled.span`
  font-size: 16px;
  font-weight: 600;
`;

const TotalPrice = styled.span`
  font-size: 18px;
  font-weight: 700;
`;

const CheckoutButton = styled.button`
  width: 100%;
  padding: 15px;
  background: #000;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #333;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #999;
`;

export default function CartSidebar() {
  const {
    cartItems,
    isOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    getTotalPrice,
    refreshCart,
  } = useCart();

  const navigate = useNavigate();

  const handleQuantityChange = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    await updateQuantity(cartItemId, newQuantity);
  };

  const handleRemove = async (cartItemId) => {
    await removeFromCart(cartItemId);
  };

  const handleCheckout = async () => {
    try {
      await orderService.createOrder("CARD");
      await refreshCart();
      closeCart();
      navigate("/mypage");
      alert("주문이 완료되었습니다!");
    } catch (error) {
      alert("주문 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      {/* ✅ $isOpen으로 변경 */}
      <Overlay $isOpen={isOpen} onClick={closeCart} />
      <Sidebar $isOpen={isOpen}>
        <Header>
          <Title>장바구니 ({cartItems.length})</Title>
          <CloseButton onClick={closeCart}>×</CloseButton>
        </Header>

        <Content>
          {cartItems.length === 0 ? (
            <EmptyCart>장바구니가 비어있습니다</EmptyCart>
          ) : (
            cartItems.map((item) => (
              <CartItem key={item.id}>
                <ItemImage src={item.productImage} alt={item.productName} />
                <ItemInfo>
                  <ItemName>{item.productName}</ItemName>
                  <ItemSize>사이즈: {item.size}</ItemSize>
                  <ItemPrice>
                    ₩{(item.price * item.quantity).toLocaleString()}
                  </ItemPrice>
                  <QuantityControl>
                    <QuantityButton
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity - 1)
                      }
                    >
                      -
                    </QuantityButton>
                    <Quantity>{item.quantity}</Quantity>
                    <QuantityButton
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity + 1)
                      }
                    >
                      +
                    </QuantityButton>
                  </QuantityControl>
                  <RemoveButton onClick={() => handleRemove(item.id)}>
                    삭제
                  </RemoveButton>
                </ItemInfo>
              </CartItem>
            ))
          )}
        </Content>

        {cartItems.length > 0 && (
          <Footer>
            <TotalSection>
              <TotalLabel>총 금액</TotalLabel>
              <TotalPrice>₩{getTotalPrice().toLocaleString()}</TotalPrice>
            </TotalSection>
            <CheckoutButton onClick={handleCheckout}>결제하기</CheckoutButton>
          </Footer>
        )}
      </Sidebar>
    </>
  );
}
