import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { productAPI } from '../api';

const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // PPT slide5: 필터링 - 가용 사이즈, 소재
  const [activeFilters, setActiveFilters] = useState({
    sizes: [],
    materials: [],
  });
  
  // PPT slide6: 정렬
  const [sortBy, setSortBy] = useState('recommended');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // PPT slide4: 신제품, 라이프스타일, 세일, 슬립온만 다룸
  const currentCategory = searchParams.get('category') || 'all';

  // PPT slide5: 가용 사이즈 (250~290)
  const sizeOptions = ['250', '255', '260', '265', '270', '275', '280', '285', '290'];

  // PPT slide5: 소재 - Tree(가볍고 시원한), Wool(부드럽고 따뜻한)
  const materialOptions = [
    { value: 'tree', label: '가볍고 시원한 Tree' },
    { value: 'wool', label: '부드럽고 따뜻한 Wool' },
  ];

  // 정렬 옵션
  const sortOptions = [
    { value: 'recommended', label: '추천순' },
    { value: 'sales', label: '판매순' },
    { value: 'priceAsc', label: '가격 낮은 순' },
    { value: 'priceDesc', label: '가격 높은 순' },
    { value: 'newest', label: '최신 등록 순' },
  ];

  useEffect(() => {
    fetchProducts();
  }, [currentCategory, activeFilters, sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      
      // 카테고리 필터
      if (currentCategory && currentCategory !== 'all') {
        if (currentCategory === 'new') {
          params.isNew = true;
        } else if (currentCategory === 'sale') {
          params.isSale = true;
        } else {
          params.category = currentCategory;
        }
      }
      
      // PPT slide5: 사이즈 필터 (각 항목은 OR)
      if (activeFilters.sizes.length > 0) {
        params.size = activeFilters.sizes.join(',');
      }
      
      // PPT slide5: 소재 필터 (각 항목은 OR)
      if (activeFilters.materials.length > 0) {
        params.material = activeFilters.materials.join(',');
      }

      const productList = await productAPI.getProducts(params);
      const sorted = sortProducts(Array.isArray(productList) ? productList : [], sortBy);
      setProducts(sorted);
    } catch (error) {
      console.error('상품 조회 실패:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const sortProducts = (list, sort) => {
    const sorted = [...list];
    switch (sort) {
      case 'priceAsc':
        return sorted.sort((a, b) => getDiscountedPrice(a) - getDiscountedPrice(b));
      case 'priceDesc':
        return sorted.sort((a, b) => getDiscountedPrice(b) - getDiscountedPrice(a));
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'sales':
        return sorted.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
      default:
        return sorted;
    }
  };

  // PPT slide5: 사이즈 필터 토글
  const toggleSizeFilter = (size) => {
    setActiveFilters(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size],
    }));
  };

  // PPT slide5: 소재 필터 토글
  const toggleMaterialFilter = (material) => {
    setActiveFilters(prev => ({
      ...prev,
      materials: prev.materials.includes(material)
        ? prev.materials.filter(m => m !== material)
        : [...prev.materials, material],
    }));
  };

  // PPT slide5: 개별 필터 제거
  const removeFilter = (type, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [type]: prev[type].filter(v => v !== value),
    }));
  };

  // PPT slide5: 전체 필터 초기화
  const clearAllFilters = () => {
    setActiveFilters({ sizes: [], materials: [] });
  };

  // 카테고리 변경
  const handleCategoryChange = (category) => {
    if (category === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  const getDiscountedPrice = (product) => {
    if (product.finalPrice) return Number(product.finalPrice);
    if (Number(product.discountRate) > 0) {
      return Math.floor(Number(product.price) * (1 - Number(product.discountRate)));
    }
    return Number(product.price);
  };

  const formatPrice = (price) => price?.toLocaleString() || 0;

  const getCategoryTitle = () => {
    switch (currentCategory) {
      case 'new': return '신제품';
      case 'lifestyle': return '라이프스타일';
      case 'sale': return '세일';
      case 'slipon': return '슬립온';
      default: return '남성 신발';
    }
  };

  const hasActiveFilters = activeFilters.sizes.length > 0 || activeFilters.materials.length > 0;

  return (
    <PageWrapper>
      {/* 브레드크럼 */}
      <Breadcrumb>
        <span>Home</span> &gt; <span>남성 전체 제품</span>
      </Breadcrumb>

      {/* PPT slide4: 신제품, 라이프스타일, 세일, 슬립온 탭 */}
      <CategoryTabs>
        <CategoryTab 
          $active={currentCategory === 'all'} 
          onClick={() => handleCategoryChange('all')}
        >
          신발 ×
        </CategoryTab>
        <CategoryTab 
          $active={currentCategory === 'new'} 
          onClick={() => handleCategoryChange('new')}
        >
          신제품
        </CategoryTab>
        <CategoryTab 
          $active={currentCategory === 'lifestyle'} 
          onClick={() => handleCategoryChange('lifestyle')}
        >
          라이프스타일
        </CategoryTab>
        <CategoryTab 
          $active={currentCategory === 'sale'} 
          onClick={() => handleCategoryChange('sale')}
        >
          세일
        </CategoryTab>
        <CategoryTab 
          $active={currentCategory === 'slipon'} 
          onClick={() => handleCategoryChange('slipon')}
        >
          슬립온
        </CategoryTab>
      </CategoryTabs>

      <PageTitle>{getCategoryTitle()}</PageTitle>
      <PageDescription>
        당신의 하루를 함께하는 라이프스타일 신발 컬렉션. 편안한 착화감과 세련된 디자인으로 언제 어디서나 활용할 수 있습니다.
      </PageDescription>

      <ContentWrapper>
        {/* 좌측 필터 */}
        <FilterSection>
          {/* PPT slide5: 적용된 필터 표시 */}
          {hasActiveFilters && (
            <AppliedFilters>
              <AppliedTitle>적용된 필터</AppliedTitle>
              <AppliedList>
                {activeFilters.sizes.map(size => (
                  <AppliedTag key={size} onClick={() => removeFilter('sizes', size)}>
                    {size} ×
                  </AppliedTag>
                ))}
                {activeFilters.materials.map(material => (
                  <AppliedTag key={material} onClick={() => removeFilter('materials', material)}>
                    {materialOptions.find(m => m.value === material)?.label} ×
                  </AppliedTag>
                ))}
              </AppliedList>
              <ClearButton onClick={clearAllFilters}>초기화</ClearButton>
            </AppliedFilters>
          )}

          {/* PPT slide5: 사이즈 필터 */}
          <FilterGroup>
            <FilterTitle>사이즈</FilterTitle>
            <SizeGrid>
              {sizeOptions.map(size => (
                <SizeButton
                  key={size}
                  $active={activeFilters.sizes.includes(size)}
                  onClick={() => toggleSizeFilter(size)}
                >
                  {size}
                </SizeButton>
              ))}
            </SizeGrid>
          </FilterGroup>

          {/* PPT slide5: 소재 필터 */}
          <FilterGroup>
            <FilterTitle>소재</FilterTitle>
            <MaterialList>
              {materialOptions.map(material => (
                <MaterialItem key={material.value}>
                  <Checkbox
                    type="checkbox"
                    checked={activeFilters.materials.includes(material.value)}
                    onChange={() => toggleMaterialFilter(material.value)}
                  />
                  <span>{material.label}</span>
                </MaterialItem>
              ))}
            </MaterialList>
          </FilterGroup>
        </FilterSection>

        {/* 상품 목록 */}
        <ProductSection>
          <ProductHeader>
            <ProductCount>{products.length}개 제품</ProductCount>
            {/* 정렬 드롭다운 */}
            <SortDropdown>
              <SortButton onClick={() => setShowSortDropdown(!showSortDropdown)}>
                {sortOptions.find(o => o.value === sortBy)?.label} ▼
              </SortButton>
              {showSortDropdown && (
                <SortMenu>
                  {sortOptions.map(option => (
                    <SortOption
                      key={option.value}
                      $active={sortBy === option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setShowSortDropdown(false);
                      }}
                    >
                      {option.label}
                    </SortOption>
                  ))}
                </SortMenu>
              )}
            </SortDropdown>
          </ProductHeader>

          {loading ? (
            <LoadingWrapper><Spinner /></LoadingWrapper>
          ) : products.length === 0 ? (
            <EmptyState>조건에 맞는 상품이 없습니다.</EmptyState>
          ) : (
            <ProductGrid>
              {products.map(product => (
                <ProductCard key={product.id} to={`/products/${product.id}`}>
                  <ProductImageWrapper>
                    {product.images?.[0] ? (
                      <ProductImage src={product.images[0]} alt={product.name} />
                    ) : (
                      <PlaceholderImage>🖼️</PlaceholderImage>
                    )}
                    {/* 신제품 배지 (1달 이내) */}
                    {isNewProduct(product.createdAt) && <NewBadge>NEW</NewBadge>}
                    {/* 세일 배지 */}
                    {Number(product.discountRate) > 0 && (
                      <SaleBadge>{Math.round(Number(product.discountRate) * 100)}%</SaleBadge>
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
            </ProductGrid>
          )}
        </ProductSection>
      </ContentWrapper>
    </PageWrapper>
  );
};

// PPT: 신제품 = 등록일 기준 1달 이내
const isNewProduct = (createdAt) => {
  if (!createdAt) return false;
  const created = new Date(createdAt);
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  return created > oneMonthAgo;
};

export default ProductListPage;

// Styled Components
const PageWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 40px;
`;

const Breadcrumb = styled.div`
  font-size: 12px;
  color: #757575;
  margin-bottom: 20px;
`;

/* PPT slide4: 카테고리 탭 */
const CategoryTabs = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const CategoryTab = styled.button`
  padding: 8px 16px;
  border: 1px solid ${({ $active }) => ($active ? '#212121' : '#e0e0e0')};
  background: ${({ $active }) => ($active ? '#212121' : '#fff')};
  color: ${({ $active }) => ($active ? '#fff' : '#212121')};
  border-radius: 20px;
  font-size: 13px;
  transition: all 0.2s;

  &:hover {
    border-color: #212121;
  }
`;

const PageTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 16px;
`;

const PageDescription = styled.p`
  font-size: 14px;
  color: #757575;
  margin-bottom: 32px;
  max-width: 600px;
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: 40px;
`;

/* 좌측 필터 */
const FilterSection = styled.aside`
  width: 220px;
  flex-shrink: 0;
`;

/* PPT slide5: 적용된 필터 */
const AppliedFilters = styled.div`
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e0e0e0;
`;

const AppliedTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const AppliedList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
`;

const AppliedTag = styled.button`
  padding: 6px 12px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background: #e0e0e0;
  }
`;

const ClearButton = styled.button`
  font-size: 12px;
  color: #757575;
  text-decoration: underline;

  &:hover {
    color: #212121;
  }
`;

const FilterGroup = styled.div`
  margin-bottom: 24px;
`;

const FilterTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
`;

/* PPT slide5: 사이즈 그리드 */
const SizeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`;

const SizeButton = styled.button`
  padding: 10px;
  border: 1px solid ${({ $active }) => ($active ? '#212121' : '#e0e0e0')};
  background: ${({ $active }) => ($active ? '#212121' : '#fff')};
  color: ${({ $active }) => ($active ? '#fff' : '#212121')};
  border-radius: 4px;
  font-size: 13px;
  transition: all 0.2s;

  &:hover {
    border-color: #212121;
  }
`;

const MaterialList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MaterialItem = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  cursor: pointer;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
`;

/* 상품 섹션 */
const ProductSection = styled.main`
  flex: 1;
`;

const ProductHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const ProductCount = styled.span`
  font-size: 14px;
  color: #757575;
`;

const SortDropdown = styled.div`
  position: relative;
`;

const SortButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 13px;
  background: #fff;

  &:hover {
    border-color: #212121;
  }
`;

const SortMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  margin-top: 4px;
  min-width: 150px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
`;

const SortOption = styled.button`
  display: block;
  width: 100%;
  padding: 10px 16px;
  text-align: left;
  font-size: 13px;
  background: ${({ $active }) => ($active ? '#f5f5f5' : '#fff')};

  &:hover {
    background: #f5f5f5;
  }
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
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
`;

const ProductCard = styled(Link)`
  display: block;
`;

const ProductImageWrapper = styled.div`
  position: relative;
  aspect-ratio: 1;
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 12px;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;

  ${ProductCard}:hover & {
    transform: scale(1.05);
  }
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
`;

const NewBadge = styled.span`
  position: absolute;
  top: 12px;
  left: 12px;
  background: #212121;
  color: #fff;
  padding: 4px 8px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 4px;
`;

const SaleBadge = styled.span`
  position: absolute;
  top: 12px;
  right: 12px;
  background: #c62828;
  color: #fff;
  padding: 4px 8px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 4px;
`;

const ProductInfo = styled.div``;

const ProductName = styled.h3`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #212121;
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
  font-size: 14px;
  font-weight: 600;
  color: ${({ $sale }) => ($sale ? '#c62828' : '#212121')};
`;
