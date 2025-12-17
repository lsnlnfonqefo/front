import { useState } from "react";
import styled from "styled-components";
import reviewService from "../../api/reviewService";

const Container = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 15px;
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
`;

const OrderDate = styled.span`
  font-size: 14px;
  color: #666;
`;

const OrderAmount = styled.span`
  font-size: 16px;
  font-weight: 600;
`;

const ProductItem = styled.div`
  display: flex;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }
`;

const ProductImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
`;

const ProductInfo = styled.div`
  flex: 1;
`;

const ProductName = styled.h3`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 5px;
`;

const ProductDetails = styled.p`
  font-size: 13px;
  color: #666;
  margin-bottom: 5px;
`;

const ReviewButton = styled.button`
  margin-top: 10px;
  padding: 6px 12px;
  background: white;
  border: 1px solid #000;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #000;
    color: white;
  }
`;

const ReviewModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px;
`;

const StarRating = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
`;

const StarButton = styled.button`
  background: none;
  border: none;
  font-size: 32px;
  cursor: pointer;
  color: ${(props) => (props.filled ? "#f39c12" : "#ddd")};
  transition: color 0.2s;

  &:hover {
    color: #f39c12;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  margin-bottom: 15px;

  &:focus {
    outline: none;
    border-color: #000;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const SubmitButton = styled.button`
  flex: 1;
  padding: 12px;
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

const CancelButton = styled.button`
  flex: 1;
  padding: 12px;
  background: white;
  color: #000;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    border-color: #000;
  }
`;

export default function OrderItem({ order }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");

  const handleReviewClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!content.trim()) {
      alert("후기 내용을 입력해주세요.");
      return;
    }

    try {
      await reviewService.createReview(
        selectedProduct.productId,
        selectedProduct.id,
        rating,
        content
      );
      alert("후기가 작성되었습니다!");
      setIsModalOpen(false);
      setContent("");
      setRating(5);
    } catch (error) {
      alert("후기 작성에 실패했습니다.");
    }
  };

  return (
    <>
      <Container>
        <OrderHeader>
          <OrderDate>
            결제일:{" "}
            {new Date(order.orderDate || order.createdAt).toLocaleDateString()}
          </OrderDate>
          <OrderAmount>
            ₩{Number(order.totalAmount || order.totalPrice || 0).toLocaleString()}
          </OrderAmount>
        </OrderHeader>

        {(order.items || order.orderItems || []).map((item, index) => (
          <ProductItem key={index}>
            <ProductImage
              src={item.productImage || item.imageUrl}
              alt={item.productName || item.name}
            />
            <ProductInfo>
              <ProductName>{item.productName || item.name}</ProductName>
              <ProductDetails>사이즈: {item.size}</ProductDetails>
              <ProductDetails>수량: {item.quantity}개</ProductDetails>
              <ProductDetails>
                결제금액: ₩
                {(
                  Number(item.finalPrice || item.price || item.unitPrice || 0) * Number(item.quantity || 1)
                ).toLocaleString()}
              </ProductDetails>
              <ReviewButton onClick={() => handleReviewClick(item)}>
                후기작성
              </ReviewButton>
            </ProductInfo>
          </ProductItem>
        ))}
      </Container>

      <ReviewModal isOpen={isModalOpen} onClick={() => setIsModalOpen(false)}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalTitle>후기 작성</ModalTitle>
          <StarRating>
            {[1, 2, 3, 4, 5].map((star) => (
              <StarButton
                key={star}
                filled={star <= rating}
                onClick={() => setRating(star)}
              >
                ★
              </StarButton>
            ))}
          </StarRating>
          <TextArea
            placeholder="상품에 대한 솔직한 후기를 작성해주세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <ButtonGroup>
            <CancelButton onClick={() => setIsModalOpen(false)}>
              취소
            </CancelButton>
            <SubmitButton onClick={handleSubmitReview}>후기 등록</SubmitButton>
          </ButtonGroup>
        </ModalContent>
      </ReviewModal>
    </>
  );
}
