import { useState } from "react";
import styled from "styled-components";
import SizeSelector from "./SizeSelector";
import { useCart } from "../../hooks/useCart";

const Container = styled.div`
  padding: 20px;
`;

const Category = styled.p`
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  margin-bottom: 10px;
`;

const ProductName = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 10px;
`;

const Description = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
`;

const PriceSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const CurrentPrice = styled.span`
  font-size: 24px;
  font-weight: 700;
`;

const OriginalPrice = styled.span`
  font-size: 18px;
  color: #999;
  text-decoration: line-through;
`;

const DiscountBadge = styled.span`
  background: #e74c3c;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
`;

const AddToCartButton = styled.button`
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
  margin-top: 20px;

  &:hover {
    background: #333;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const Accordion = styled.div`
  margin-top: 30px;
  border-top: 1px solid #e0e0e0;
`;

const AccordionItem = styled.div`
  border-bottom: 1px solid #e0e0e0;
`;

const AccordionHeader = styled.button`
  width: 100%;
  padding: 15px 0;
  background: none;
  border: none;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AccordionContent = styled.div`
  padding: 0 0 15px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  display: ${(props) => (props.isOpen ? "block" : "none")};
`;

export default function ProductInfo({ product }) {
  const [selectedSize, setSelectedSize] = useState(null);
  const [openAccordion, setOpenAccordion] = useState(null);
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert("사이즈를 선택해주세요.");
      return;
    }

    try {
      await addToCart(product, selectedSize);
    } catch (error) {
      alert("장바구니 추가에 실패했습니다.");
    }
  };

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  return (
    <Container>
      <Category>{product.categories.join(", ")}</Category>
      <ProductName>{product.name}</ProductName>
      <Description>{product.description}</Description>

      <PriceSection>
        <CurrentPrice>₩{product.price.toLocaleString()}</CurrentPrice>
        {product.isOnSale && (
          <>
            <OriginalPrice>
              ₩{product.originalPrice.toLocaleString()}
            </OriginalPrice>
            <DiscountBadge>-{product.discountPercentage}%</DiscountBadge>
          </>
        )}
      </PriceSection>

      <SizeSelector
        availableSizes={product.sizes}
        selectedSize={selectedSize}
        onSizeSelect={setSelectedSize}
      />

      <AddToCartButton onClick={handleAddToCart} disabled={!selectedSize}>
        {selectedSize ? "장바구니 담기" : "사이즈를 선택해주세요"}
      </AddToCartButton>

      <Accordion>
        <AccordionItem>
          <AccordionHeader onClick={() => toggleAccordion(0)}>
            제품 상세 정보
            <span>{openAccordion === 0 ? "−" : "+"}</span>
          </AccordionHeader>
          <AccordionContent isOpen={openAccordion === 0}>
            소재:{" "}
            {product.material === "troo"
              ? "가볍고 시원한 Tree"
              : "부드럽고 따뜻한 Wool"}
            <br />
            기능: {product.functions.join(", ")}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem>
          <AccordionHeader onClick={() => toggleAccordion(1)}>
            배송 정보
            <span>{openAccordion === 1 ? "−" : "+"}</span>
          </AccordionHeader>
          <AccordionContent isOpen={openAccordion === 1}>
            무료 배송 (3-5일 소요)
            <br />
            주문 후 24시간 이내 취소 가능
          </AccordionContent>
        </AccordionItem>

        <AccordionItem>
          <AccordionHeader onClick={() => toggleAccordion(2)}>
            교환 및 환불
            <span>{openAccordion === 2 ? "−" : "+"}</span>
          </AccordionHeader>
          <AccordionContent isOpen={openAccordion === 2}>
            상품 수령 후 30일 이내 무료 반품 가능
            <br />
            단순 변심으로 인한 반품도 가능합니다
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Container>
  );
}
