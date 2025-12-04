import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { productAPI } from '../api';

const MainPage = () => {
  const [popularProducts, setPopularProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroSlide, setHeroSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  // PPT slide5: 총 3개의 이미지, 좌우 버튼, 자동 슬라이딩 1->2->3->1->2...
  const heroImages = [
    {
      url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1920',
      title: '가볍고 편안한 신발',
      subtitle: '자연에서 온 소재로 만든 올버즈',
    },
    {
      url: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1920',
      title: '지속 가능한 패션',
      subtitle: '환경을 생각하는 친환경 슈즈',
    },
    {
      url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1920',
      title: '하루 종일 편안함',
      subtitle: '프리미엄 울과 트리 소재',
    },
  ];

  useEffect(() => {
    fetchPopularProducts();
  }, []);

  // PPT slide5: 타이머에 따라 자동 슬라이딩
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const fetchPopularProducts = async () => {
    try {
      const products = await productAPI.getPopular(0, 10);
      // productAPI가 이미 items 배열을 반환
      setPopularProducts(Array.isArray(products) ? products : []);
    } catch (error) {
      console.error('인기 상품 조회 실패:', error);
      setPopularProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // PPT slide5: 좌, 우 버튼 동작
  const handlePrevHero = () => {
    setHeroSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const handleNextHero = () => {
    setHeroSlide((prev) => (prev + 1) % heroImages.length);
  };

  // PPT slide6: 실시간 인기 슬라이드 - 1,2,3,4,5 -> 클릭시 한번씩만 슬라이딩
  // 더 이상 슬라이딩 할 수 없다면 버튼 비활성화
  const visibleCount = 5;
  const canSlideLeft = currentSlide > 0;
  const canSlideRight = currentSlide < popularProducts.length - visibleCount;

  const handlePrevSlide = () => {
    if (canSlideLeft) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const handleNextSlide = () => {
    if (canSlideRight) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const formatPrice = (price) => {
    return price?.toLocaleString() || 0;
  };

  const getDiscountedPrice = (product) => {
    // API가 finalPrice를 이미 제공
    if (product.finalPrice) {
      return Number(product.finalPrice);
    }
    if (product.discountRate > 0) {
      return Math.floor(Number(product.price) * (1 - Number(product.discountRate)));
    }
    return Number(product.price);
  };

  return (
    <MainWrapper>
      {/* PPT slide5: 히어로 슬라이더 - 3개 이미지, 좌우버튼, 자동슬라이딩 */}
      <HeroSection>
        <HeroSlider style={{ transform: `translateX(-${heroSlide * 100}%)` }}>
          {heroImages.map((image, index) => (
            <HeroSlide key={index}>
              <HeroImage src={image.url} alt={image.title} />
              <HeroOverlay />
              <HeroContent>
                <HeroTitle>{image.title}</HeroTitle>
                <HeroSubtitle>{image.subtitle}</HeroSubtitle>
                <HeroButton to="/products">쇼핑하기</HeroButton>
              </HeroContent>
            </HeroSlide>
          ))}
        </HeroSlider>
        <HeroArrow $direction="left" onClick={handlePrevHero}>‹</HeroArrow>
        <HeroArrow $direction="right" onClick={handleNextHero}>›</HeroArrow>
        <HeroDots>
          {heroImages.map((_, index) => (
            <HeroDot
              key={index}
              $active={index === heroSlide}
              onClick={() => setHeroSlide(index)}
            />
          ))}
        </HeroDots>
      </HeroSection>

      {/* PPT slide6: 실시간 인기 슬라이드 */}
      <PopularSection>
        <SectionHeader>
          <SectionTitle>실시간 인기</SectionTitle>
          <SliderControls>
            {/* PPT: 더 이상 슬라이딩 할 수 없다면 버튼 비활성화 */}
            <SliderButton onClick={handlePrevSlide} disabled={!canSlideLeft}>
              ‹
            </SliderButton>
            <SliderButton onClick={handleNextSlide} disabled={!canSlideRight}>
              ›
            </SliderButton>
          </SliderControls>
        </SectionHeader>

        {loading ? (
          <LoadingText>상품을 불러오는 중...</LoadingText>
        ) : popularProducts.length === 0 ? (
          <EmptyText>인기 상품이 없습니다.</EmptyText>
        ) : (
          <ProductSlider>
            <ProductTrack
              style={{ transform: `translateX(-${currentSlide * (100 / visibleCount)}%)` }}
            >
              {popularProducts.map((product, index) => (
                <ProductCard key={product.id || index} to={`/products/${product.id}`}>
                  <ProductRank>{index + 1}</ProductRank>
                  <ProductImageWrapper>
                    {product.images?.[0] ? (
                      <ProductImage 
                        src={product.images[0]} 
                        alt={product.name} 
                      />
                    ) : (
                      <PlaceholderImage>🖼️</PlaceholderImage>
                    )}
                  </ProductImageWrapper>
                  <ProductInfo>
                    <ProductName>{product.name}</ProductName>
                    <ProductPrice>
                      {Number(product.discountRate) > 0 && (
                        <OriginalPrice>{formatPrice(Number(product.price))}원</OriginalPrice>
                      )}
                      <CurrentPrice $sale={Number(product.discountRate) > 0}>
                        {formatPrice(getDiscountedPrice(product))}원
                      </CurrentPrice>
                    </ProductPrice>
                  </ProductInfo>
                </ProductCard>
              ))}
            </ProductTrack>
          </ProductSlider>
        )}
      </PopularSection>

      {/* PPT slide12: 카테고리는 라이프스타일과 슬립온만 존재 */}
      <CategorySection>
        <CategoryCard to="/products?category=lifestyle">
          <CategoryImage
            src="https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800"
            alt="라이프스타일"
          />
          <CategoryOverlay>
            <CategoryTitle>라이프스타일</CategoryTitle>
            <CategoryButton>쇼핑하기</CategoryButton>
          </CategoryOverlay>
        </CategoryCard>
        <CategoryCard to="/products?category=slipon">
          <CategoryImage
            src="https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?w=800"
            alt="슬립온"
          />
          <CategoryOverlay>
            <CategoryTitle>슬립온</CategoryTitle>
            <CategoryButton>쇼핑하기</CategoryButton>
          </CategoryOverlay>
        </CategoryCard>
      </CategorySection>

      {/* 브랜드 스토리 섹션 */}
      <StorySection>
        <StoryContent>
          <StoryTitle>자연에서 온 편안함</StoryTitle>
          <StoryText>
            올버즈는 뉴질랜드 메리노 울과 유칼립투스 나무에서 추출한 친환경 소재로
            신발을 만듭니다. 지속 가능한 방식으로 생산된 우리의 신발은
            하루 종일 편안함을 제공합니다.
          </StoryText>
          <StoryLink to="#">우리의 이야기</StoryLink>
        </StoryContent>
        <StoryImage
          src="https://images.unsplash.com/photo-1518623489648-a173ef7824f3?w=800"
          alt="올버즈 스토리"
        />
      </StorySection>
    </MainWrapper>
  );
};

export default MainPage;

// Styled Components
const MainWrapper = styled.div`
  width: 100%;
`;

const HeroSection = styled.section`
  position: relative;
  width: 100%;
  height: 600px;
  overflow: hidden;
`;

const HeroSlider = styled.div`
  display: flex;
  height: 100%;
  transition: transform 0.5s ease;
`;

const HeroSlide = styled.div`
  flex: 0 0 100%;
  position: relative;
`;

const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const HeroOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
`;

const HeroContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #fff;
  z-index: 10;
`;

const HeroTitle = styled.h1`
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

const HeroSubtitle = styled.p`
  font-size: 20px;
  margin-bottom: 32px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
`;

const HeroButton = styled(Link)`
  display: inline-block;
  padding: 16px 40px;
  background: #fff;
  color: #212121;
  font-size: 16px;
  font-weight: 600;
  border-radius: 4px;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
`;

const HeroArrow = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${({ $direction }) => ($direction === 'left' ? 'left: 20px;' : 'right: 20px;')}
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.9);
  color: #212121;
  font-size: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  z-index: 20;

  &:hover {
    background: #fff;
  }
`;

const HeroDots = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 20;
`;

const HeroDot = styled.button`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ $active }) => ($active ? '#fff' : 'rgba(255, 255, 255, 0.5)')};
  transition: background 0.2s;
`;

const PopularSection = styled.section`
  padding: 60px 40px;
  max-width: 1400px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
`;

const SliderControls = styled.div`
  display: flex;
  gap: 12px;
`;

const SliderButton = styled.button`
  width: 40px;
  height: 40px;
  border: 1px solid #e0e0e0;
  border-radius: 50%;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #212121;
    color: #fff;
    border-color: #212121;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const LoadingText = styled.p`
  text-align: center;
  color: #757575;
  padding: 60px;
`;

const EmptyText = styled.p`
  text-align: center;
  color: #757575;
  padding: 60px;
`;

const ProductSlider = styled.div`
  overflow: hidden;
`;

const ProductTrack = styled.div`
  display: flex;
  gap: 20px;
  transition: transform 0.3s ease;
`;

const ProductCard = styled(Link)`
  flex: 0 0 calc((100% - 80px) / 5);
  position: relative;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
`;

const ProductRank = styled.span`
  position: absolute;
  top: 12px;
  left: 12px;
  background: #212121;
  color: #fff;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
`;

const ProductImageWrapper = styled.div`
  width: 100%;
  aspect-ratio: 1;
  background: #f5f5f5;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  background: #f5f5f5;
`;

const ProductInfo = styled.div`
  padding: 16px;
`;

const ProductName = styled.h3`
  font-size: 14px;
  font-weight: 500;
  color: #212121;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProductPrice = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const OriginalPrice = styled.span`
  font-size: 13px;
  color: #757575;
  text-decoration: line-through;
`;

const CurrentPrice = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: ${({ $sale }) => ($sale ? '#F44336' : '#212121')};
`;

const CategorySection = styled.section`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding: 0 40px 60px;
  max-width: 1400px;
  margin: 0 auto;
`;

const CategoryCard = styled(Link)`
  position: relative;
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
`;

const CategoryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;

  ${CategoryCard}:hover & {
    transform: scale(1.05);
  }
`;

const CategoryOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: #fff;
`;

const CategoryTitle = styled.h3`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 16px;
`;

const CategoryButton = styled.span`
  display: inline-block;
  padding: 12px 24px;
  border: 2px solid #fff;
  font-size: 14px;
  font-weight: 600;
  transition: background 0.2s, color 0.2s;

  ${CategoryCard}:hover & {
    background: #fff;
    color: #212121;
  }
`;

const StorySection = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1400px;
  margin: 0 auto 60px;
  padding: 0 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StoryContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background: #f5f5f5;
`;

const StoryTitle = styled.h2`
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 20px;
`;

const StoryText = styled.p`
  font-size: 16px;
  line-height: 1.8;
  color: #616161;
  margin-bottom: 30px;
`;

const StoryLink = styled(Link)`
  display: inline-block;
  padding: 14px 28px;
  background: #212121;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  border-radius: 4px;
  align-self: flex-start;
  transition: background 0.2s;

  &:hover {
    background: #424242;
  }
`;

const StoryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  min-height: 400px;
`;
