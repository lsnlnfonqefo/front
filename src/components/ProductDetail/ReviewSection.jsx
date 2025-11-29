import { useState, useEffect } from "react";
import styled from "styled-components";
import reviewService from "../../api/reviewService";

const Container = styled.div`
  margin-top: 40px;
  padding: 30px 0;
  border-top: 2px solid #e0e0e0;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px;
`;

const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ReviewItem = styled.div`
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const ReviewerName = styled.span`
  font-weight: 600;
  font-size: 14px;
`;

const ReviewDate = styled.span`
  font-size: 12px;
  color: #999;
`;

const Rating = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 10px;
`;

const Star = styled.span`
  color: ${(props) => (props.filled ? "#f39c12" : "#ddd")};
  font-size: 16px;
`;

const ReviewContent = styled.p`
  font-size: 14px;
  color: #333;
  line-height: 1.6;
`;

const EmptyReviews = styled.p`
  text-align: center;
  padding: 40px 0;
  color: #999;
`;

export default function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await reviewService.getReviews(productId);
      setReviews(data);
    } catch (error) {
      console.error("Failed to load reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star key={index} filled={index < rating}>
        ★
      </Star>
    ));
  };

  if (loading) {
    return (
      <Container>
        <EmptyReviews>후기를 불러오는 중...</EmptyReviews>
      </Container>
    );
  }

  return (
    <Container>
      <Title>고객 후기 ({reviews.length})</Title>
      {reviews.length === 0 ? (
        <EmptyReviews>아직 작성된 후기가 없습니다.</EmptyReviews>
      ) : (
        <ReviewList>
          {reviews.map((review) => (
            <ReviewItem key={review.id}>
              <ReviewHeader>
                <ReviewerName>{review.userName}</ReviewerName>
                <ReviewDate>
                  {new Date(review.createdAt).toLocaleDateString()}
                </ReviewDate>
              </ReviewHeader>
              <Rating>{renderStars(review.rating)}</Rating>
              <ReviewContent>{review.content}</ReviewContent>
            </ReviewItem>
          ))}
        </ReviewList>
      )}
    </Container>
  );
}
