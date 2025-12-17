import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { productAPI } from '../api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  // PPT slide7: 아코디언 UI
  const [openAccordion, setOpenAccordion] = useState('details');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const productData = await productAPI.getProduct(id);
      console.log('상품 데이터:', productData);
      setProduct(productData);
    } catch (error) {
      console.error('상품 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // PPT slide8: 장바구니 담기
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    if (!selectedSize) {
      alert('사이즈를 선택해주세요.');
      return;
    }

    try {
      await addItem(product.id, selectedSize, quantity);
    } catch (error) {
      alert('장바구니 담기에 실패했습니다.');
    }
  };

  const formatPrice = (price) => (Number(price) || 0).toLocaleString();

  // 백엔드에서 price=할인가(현재가), originalPrice=정가로 내려주므로
  // 상세페이지에서는 그 값을 그대로 사용한다.
  const getPrices = () => {
    const current = Number(product?.finalPrice ?? product?.price ?? 0);
    const original = Number(product?.originalPrice ?? product?.price ?? 0);
    return {
      current,
      original,
      hasDiscount: Number(product?.discountRate) > 0 && current < original,
    };
  };

  // 리뷰 별점
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} $filled={i < rating}>★</Star>
    ));
  };

  if (loading) {
    return <LoadingWrapper><Spinner /><LoadingText>상품 정보를 불러오는 중...</LoadingText></LoadingWrapper>;
  }

  if (!product) {
    return <ErrorWrapper><ErrorText>상품을 찾을 수 없습니다.</ErrorText></ErrorWrapper>;
  }

  const images = product.images || [];
  const sizes = product.sizes || [];
  const reviews = product.reviews || [];
  const { current: currentPrice, original: originalPrice, hasDiscount } = getPrices();

  return (
    <PageWrapper>
      <Breadcrumb>
        <span>Home</span> &gt; <span>남성 전체 제품</span>
      </Breadcrumb>

      <ProductContainer>
        {/* PPT slide7: 슬라이더 없음, 클릭한 이미지 표시 */}
        <ImageSection>
          <ThumbnailList>
            {images.map((image, index) => (
              <Thumbnail
                key={index}
                $active={selectedImage === index}
                onClick={() => setSelectedImage(index)}
              >
                <ThumbnailImage src={image} alt={`${product.name} ${index + 1}`} />
              </Thumbnail>
            ))}
          </ThumbnailList>
          <MainImage>
            {images[selectedImage] ? (
              <img src={images[selectedImage]} alt={product.name} />
            ) : (
              <PlaceholderImage>🖼️</PlaceholderImage>
            )}
          </MainImage>
        </ImageSection>

        {/* PPT slide7: 상세페이지 좌측 요소만 */}
        <InfoSection>
          <ProductName>{product.name}</ProductName>
          
          <PriceSection>
            {hasDiscount ? (
              <>
                <DiscountBadge>{Math.round(Number(product.discountRate) * 100)}%</DiscountBadge>
                <CurrentPrice>₩{formatPrice(currentPrice)}</CurrentPrice>
                <OriginalPrice>₩{formatPrice(originalPrice)}</OriginalPrice>
              </>
            ) : (
              <CurrentPrice>₩{formatPrice(currentPrice)}</CurrentPrice>
            )}
          </PriceSection>

          <Description>{product.description}</Description>

          {/* PPT slide7: 색상 정보 없음, 이미지만 보이기 */}
          <ColorSection>
            <ColorLabel>색상</ColorLabel>
            <ColorImages>
              {images.slice(0, 4).map((image, index) => (
                <ColorImage 
                  key={index} 
                  src={image} 
                  alt={`색상 ${index + 1}`}
                  onClick={() => setSelectedImage(index)}
                  $active={selectedImage === index}
                />
              ))}
            </ColorImages>
          </ColorSection>

          {/* PPT slide8: 사이즈 선택 */}
          <SizeSection>
            <SizeHeader>
              <SizeLabel>사이즈</SizeLabel>
            </SizeHeader>
            <SizeGrid>
              {sizes.map((size) => (
                <SizeButton
                  key={size}
                  $selected={selectedSize === size}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </SizeButton>
              ))}
            </SizeGrid>
          </SizeSection>

          {/* PPT slide8: 사이즈 선택시 장바구니 담기 버튼 표시 */}
          {selectedSize && (
            <CartSection>
              <QuantityControl>
                <QuantityButton onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</QuantityButton>
                <QuantityValue>{quantity}</QuantityValue>
                <QuantityButton onClick={() => setQuantity(q => q + 1)}>+</QuantityButton>
              </QuantityControl>
              <AddToCartButton onClick={handleAddToCart}>
                장바구니 담기 · ₩{formatPrice(currentPrice * quantity)}
              </AddToCartButton>
            </CartSection>
          )}

          {/* PPT slide7: 아코디언 UI - 상세 정보, 배송 정보, 관리 방법 (내용 고정) */}
          <AccordionSection>
            <AccordionItem>
              <AccordionHeader 
                $open={openAccordion === 'details'}
                onClick={() => setOpenAccordion(openAccordion === 'details' ? null : 'details')}
              >
                <span>상세 정보</span>
                <AccordionIcon>{openAccordion === 'details' ? '−' : '+'}</AccordionIcon>
              </AccordionHeader>
              {openAccordion === 'details' && (
                <AccordionContent>
                  <p>• 가볍고 편안한 착화감</p>
                  <p>• 천연 소재로 제작</p>
                  <p>• 탄소 발자국 감소를 위한 지속 가능한 생산</p>
                  <p>• 기계 세탁 가능</p>
                </AccordionContent>
              )}
            </AccordionItem>

            <AccordionItem>
              <AccordionHeader 
                $open={openAccordion === 'shipping'}
                onClick={() => setOpenAccordion(openAccordion === 'shipping' ? null : 'shipping')}
              >
                <span>배송 정보</span>
                <AccordionIcon>{openAccordion === 'shipping' ? '−' : '+'}</AccordionIcon>
              </AccordionHeader>
              {openAccordion === 'shipping' && (
                <AccordionContent>
                  <p>• 무료 배송 (3-5 영업일 소요)</p>
                  <p>• 60일 무료 반품</p>
                  <p>• 제주 및 도서산간 지역 추가 배송비 발생</p>
                </AccordionContent>
              )}
            </AccordionItem>

            <AccordionItem>
              <AccordionHeader 
                $open={openAccordion === 'care'}
                onClick={() => setOpenAccordion(openAccordion === 'care' ? null : 'care')}
              >
                <span>관리 방법</span>
                <AccordionIcon>{openAccordion === 'care' ? '−' : '+'}</AccordionIcon>
              </AccordionHeader>
              {openAccordion === 'care' && (
                <AccordionContent>
                  <p>• 찬물에 울 세제로 손세탁 또는 기계 세탁</p>
                  <p>• 자연 건조 권장</p>
                  <p>• 직사광선 피하기</p>
                  <p>• 인솔은 분리하여 세탁</p>
                </AccordionContent>
              )}
            </AccordionItem>
          </AccordionSection>
        </InfoSection>
      </ProductContainer>

      {/* PPT slide10: 리뷰 섹션 */}
      <ReviewSection>
        <ReviewTitle>리뷰 ({reviews.length})</ReviewTitle>
        {reviews.length === 0 ? (
          <EmptyReview>아직 리뷰가 없습니다.</EmptyReview>
        ) : (
          <ReviewList>
            {reviews.map((review, index) => (
              <ReviewItem key={index}>
                <ReviewHeader>
                  <ReviewStars>{renderStars(review.rating)}</ReviewStars>
                  <ReviewMeta>
                    <ReviewAuthor>{review.author || review.userName || '익명'}</ReviewAuthor>
                    <ReviewDate>{new Date(review.createdAt).toLocaleDateString('ko-KR')}</ReviewDate>
                  </ReviewMeta>
                </ReviewHeader>
                <ReviewContent>{review.content}</ReviewContent>
              </ReviewItem>
            ))}
          </ReviewList>
        )}
      </ReviewSection>
    </PageWrapper>
  );
};

export default ProductDetailPage;

// Styled Components
const PageWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 40px;
`;

const Breadcrumb = styled.div`
  font-size: 12px;
  color: #757575;
  margin-bottom: 24px;
`;

const ProductContainer = styled.div`
  display: flex;
  gap: 60px;
  margin-bottom: 60px;
`;

/* PPT slide7: 이미지 섹션 - 슬라이더 없음 */
const ImageSection = styled.div`
  display: flex;
  gap: 16px;
  flex: 1;
`;

const ThumbnailList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 80px;
`;

const Thumbnail = styled.button`
  width: 80px;
  height: 80px;
  border: 2px solid ${({ $active }) => ($active ? '#212121' : '#e0e0e0')};
  border-radius: 4px;
  overflow: hidden;
  padding: 0;
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const MainImage = styled.div`
  flex: 1;
  aspect-ratio: 1;
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 64px;
`;

const InfoSection = styled.div`
  width: 400px;
`;

const ProductName = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
`;

const PriceSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const DiscountBadge = styled.span`
  background: #c62828;
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
`;

const CurrentPrice = styled.span`
  font-size: 24px;
  font-weight: 700;
`;

const OriginalPrice = styled.span`
  font-size: 16px;
  color: #757575;
  text-decoration: line-through;
`;

const Description = styled.p`
  font-size: 14px;
  color: #757575;
  line-height: 1.6;
  margin-bottom: 24px;
`;

/* PPT slide7: 색상 정보 없음, 이미지만 */
const ColorSection = styled.div`
  margin-bottom: 24px;
`;

const ColorLabel = styled.h3`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const ColorImages = styled.div`
  display: flex;
  gap: 8px;
`;

const ColorImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  border: 2px solid ${({ $active }) => ($active ? '#212121' : '#e0e0e0')};
  cursor: pointer;
`;

/* 사이즈 선택 */
const SizeSection = styled.div`
  margin-bottom: 24px;
`;

const SizeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const SizeLabel = styled.h3`
  font-size: 14px;
  font-weight: 600;
`;

const SizeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
`;

const SizeButton = styled.button`
  padding: 12px;
  border: 1px solid ${({ $selected }) => ($selected ? '#212121' : '#e0e0e0')};
  background: ${({ $selected }) => ($selected ? '#212121' : '#fff')};
  color: ${({ $selected }) => ($selected ? '#fff' : '#212121')};
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.2s;

  &:hover {
    border-color: #212121;
  }
`;

/* PPT slide8: 사이즈 선택시 장바구니 버튼 */
const CartSection = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
`;

const QuantityButton = styled.button`
  width: 40px;
  height: 48px;
  font-size: 18px;

  &:hover {
    background: #f5f5f5;
  }
`;

const QuantityValue = styled.span`
  width: 40px;
  text-align: center;
  font-size: 16px;
`;

const AddToCartButton = styled.button`
  flex: 1;
  padding: 16px;
  background: #212121;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  border-radius: 4px;

  &:hover {
    background: #424242;
  }
`;

/* PPT slide7: 아코디언 UI */
const AccordionSection = styled.div`
  border-top: 1px solid #e0e0e0;
`;

const AccordionItem = styled.div`
  border-bottom: 1px solid #e0e0e0;
`;

const AccordionHeader = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  font-size: 14px;
  font-weight: 500;
`;

const AccordionIcon = styled.span`
  font-size: 18px;
`;

const AccordionContent = styled.div`
  padding: 0 0 16px;
  font-size: 13px;
  color: #757575;
  line-height: 1.8;
`;

/* 리뷰 */
const ReviewSection = styled.section`
  padding-top: 40px;
  border-top: 1px solid #e0e0e0;
`;

const ReviewTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 24px;
`;

const EmptyReview = styled.p`
  text-align: center;
  color: #757575;
  padding: 40px;
`;

const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ReviewItem = styled.div`
  padding-bottom: 24px;
  border-bottom: 1px solid #e0e0e0;
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const ReviewStars = styled.div`
  display: flex;
`;

const Star = styled.span`
  color: ${({ $filled }) => ($filled ? '#FFB300' : '#e0e0e0')};
  font-size: 16px;
`;

const ReviewMeta = styled.div`
  display: flex;
  gap: 12px;
  font-size: 13px;
  color: #757575;
`;

const ReviewAuthor = styled.span``;
const ReviewDate = styled.span``;

const ReviewContent = styled.p`
  font-size: 14px;
  line-height: 1.6;
`;

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
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

const LoadingText = styled.p`
  margin-top: 16px;
  color: #757575;
`;

const ErrorWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
`;

const ErrorText = styled.p`
  font-size: 16px;
  color: #757575;
`;
