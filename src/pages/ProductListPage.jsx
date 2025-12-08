import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { productAPI } from "../api";

const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeFilters, setActiveFilters] = useState({
    sizes: [],
    materials: [],
  });

  const [sortBy, setSortBy] = useState("recommended");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const currentCategory = searchParams.get("category") || "all";

  const sizeOptions = [
    "250",
    "255",
    "260",
    "265",
    "270",
    "275",
    "280",
    "285",
    "290",
  ];
  const materialOptions = [
    { value: "tree", label: "가볍고 시원한 tree" },
    { value: "cotton", label: "면" },
    { value: "wool", label: "부드럽고 따뜻한 wool" },
    { value: "canvas", label: "캔버스" },
  ];

  const sortOptions = [
    { value: "recommended", label: "추천순" },
    { value: "sales", label: "판매순" },
    { value: "priceAsc", label: "가격 낮은 순" },
    { value: "priceDesc", label: "가격 높은 순" },
    { value: "newest", label: "최신 등록 순" },
  ];

  useEffect(() => {
    fetchProducts();
  }, [currentCategory, activeFilters, sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};

      if (currentCategory && currentCategory !== "all") {
        if (currentCategory === "new") {
          params.isNew = true;
        } else if (currentCategory === "sale") {
          params.isSale = true;
        } else {
          params.category = currentCategory;
        }
      }

      if (activeFilters.sizes.length > 0) {
        params.size = activeFilters.sizes.join(",");
      }

      if (activeFilters.materials.length > 0) {
        params.material = activeFilters.materials.join(",");
      }

      const productList = await productAPI.getProducts(params);
      const sorted = sortProducts(
        Array.isArray(productList) ? productList : [],
        sortBy
      );
      setProducts(sorted);
    } catch (error) {
      console.error("상품 조회 실패:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const sortProducts = (list, sort) => {
    const sorted = [...list];
    switch (sort) {
      case "priceAsc":
        return sorted.sort(
          (a, b) => getDiscountedPrice(a) - getDiscountedPrice(b)
        );
      case "priceDesc":
        return sorted.sort(
          (a, b) => getDiscountedPrice(b) - getDiscountedPrice(a)
        );
      case "newest":
        return sorted.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      case "sales":
        return sorted.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
      default:
        return sorted;
    }
  };

  const toggleSizeFilter = (size) => {
    setActiveFilters((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const toggleMaterialFilter = (material) => {
    setActiveFilters((prev) => ({
      ...prev,
      materials: prev.materials.includes(material)
        ? prev.materials.filter((m) => m !== material)
        : [...prev.materials, material],
    }));
  };

  const removeFilter = (type, value) => {
    setActiveFilters((prev) => ({
      ...prev,
      [type]: prev[type].filter((v) => v !== value),
    }));
  };

  const clearAllFilters = () => {
    setActiveFilters({ sizes: [], materials: [] });
  };

  const handleCategoryChange = (category) => {
    if (category === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  const getDiscountedPrice = (product) => {
    if (product.finalPrice) return Number(product.finalPrice);
    if (Number(product.discountRate) > 0) {
      return Math.floor(
        Number(product.price) * (1 - Number(product.discountRate))
      );
    }
    return Number(product.price);
  };

  const formatPrice = (price) => price?.toLocaleString() || 0;

  const getCategoryTitle = () => {
    switch (currentCategory) {
      case "new":
        return "신제품";
      case "lifestyle":
        return "라이프스타일";
      case "sale":
        return "세일";
      case "slipon":
        return "슬립온";
      default:
        return "남성 신발";
    }
  };

  const hasActiveFilters =
    activeFilters.sizes.length > 0 || activeFilters.materials.length > 0;

  const isNewProduct = (createdAt) => {
    if (!createdAt) return false;
    const created = new Date(createdAt);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return created > oneMonthAgo;
  };

  return (
    <PageWrapper>
      <Breadcrumb>
        <span>Home</span> &gt; <span>남성 전체 제품</span>
      </Breadcrumb>

      <GenderTabs>
        <GenderTab $active={true}>남성</GenderTab>
        <GenderTab $active={false}>여성</GenderTab>
      </GenderTabs>

      <PageTitle>{getCategoryTitle()}</PageTitle>
      <PageDescription>
        Wool, Tree, Sugar 등 자연 소재로 만들어 놀랍도록 편안한 올버즈 제품을
        만나보세요. 우리는 편안한 신발의 기준을 만들어가고 있습니다.
      </PageDescription>

      <CategoryTabs>
        <CategoryTab
          $active={currentCategory === "all"}
          onClick={() => handleCategoryChange("all")}
        >
          신발 ×
        </CategoryTab>
        <CategoryTab
          $active={currentCategory === "new"}
          onClick={() => handleCategoryChange("new")}
        >
          신제품
        </CategoryTab>
        <CategoryTab
          $active={currentCategory === "lifestyle"}
          onClick={() => handleCategoryChange("lifestyle")}
        >
          라이프스타일
        </CategoryTab>
        <CategoryTab
          $active={currentCategory === "active"}
          onClick={() => handleCategoryChange("active")}
        >
          액티브
        </CategoryTab>
        <CategoryTab
          $active={currentCategory === "sale"}
          onClick={() => handleCategoryChange("sale")}
        >
          세일
        </CategoryTab>
        <CategoryTab
          $active={currentCategory === "slipon"}
          onClick={() => handleCategoryChange("slipon")}
        >
          슬립온
        </CategoryTab>
        <CategoryTab
          $active={currentCategory === "slipper"}
          onClick={() => handleCategoryChange("slipper")}
        >
          슬리퍼
        </CategoryTab>
      </CategoryTabs>

      <Divider />

      <ContentWrapper>
        <FilterSection>
          {hasActiveFilters && (
            <AppliedFilters>
              <AppliedTitle>적용된 필터</AppliedTitle>
              <AppliedList>
                {activeFilters.sizes.map((size) => (
                  <AppliedTag
                    key={size}
                    onClick={() => removeFilter("sizes", size)}
                  >
                    {size} ×
                  </AppliedTag>
                ))}
                {activeFilters.materials.map((material) => (
                  <AppliedTag
                    key={material}
                    onClick={() => removeFilter("materials", material)}
                  >
                    {materialOptions.find((m) => m.value === material)?.label} ×
                  </AppliedTag>
                ))}
              </AppliedList>
              <ClearButton onClick={clearAllFilters}>초기화</ClearButton>
            </AppliedFilters>
          )}

          <FilterGroup>
            <FilterTitle>사이즈</FilterTitle>
            <SizeFilterGrid>
              {sizeOptions.map((size) => (
                <SizeButton
                  key={size}
                  $active={activeFilters.sizes.includes(size)}
                  onClick={() => toggleSizeFilter(size)}
                >
                  {size}
                </SizeButton>
              ))}
            </SizeFilterGrid>
          </FilterGroup>

          <FilterGroup>
            <FilterTitle>소재</FilterTitle>
            <MaterialList>
              {materialOptions.map((material) => (
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

        <ProductSection>
          <ProductHeader>
            <ProductCount>{products.length}개 제품</ProductCount>
            <SortDropdown>
              <SortButton
                onClick={() => setShowSortDropdown(!showSortDropdown)}
              >
                {sortOptions.find((o) => o.value === sortBy)?.label} ▼
              </SortButton>
              {showSortDropdown && (
                <SortMenu>
                  {sortOptions.map((option) => (
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
            <LoadingWrapper>
              <Spinner />
            </LoadingWrapper>
          ) : products.length === 0 ? (
            <EmptyState>조건에 맞는 상품이 없습니다.</EmptyState>
          ) : (
            <ProductGrid>
              {products.map((product) => (
                <ProductCard key={product.id} to={`/products/${product.id}`}>
                  <ProductImageWrapper>
                    {product.images?.[0] ? (
                      <ProductImage
                        src={product.images[0]}
                        alt={product.name}
                      />
                    ) : (
                      <PlaceholderImage>🖼️</PlaceholderImage>
                    )}
                    {isNewProduct(product.createdAt) && (
                      <NewBadge>NEW</NewBadge>
                    )}
                    {Number(product.discountRate) > 0 && (
                      <SaleBadge>
                        {Math.round(Number(product.discountRate) * 100)}%
                      </SaleBadge>
                    )}
                    <SizeOverlay>
                      <SizeGrid>
                        {(product.sizes || []).map((size) => (
                          <SizeChip key={size}>{size}</SizeChip>
                        ))}
                      </SizeGrid>
                    </SizeOverlay>
                  </ProductImageWrapper>
                  <ColorThumbnails>
                    {(product.images || []).slice(0, 5).map((img, idx) => (
                      <ColorThumb key={idx} src={img} alt="" />
                    ))}
                    {(product.images?.length || 0) > 5 && (
                      <MoreColors>›</MoreColors>
                    )}
                  </ColorThumbnails>
                  <ProductInfo>
                    <ProductName>{product.name}</ProductName>
                    <ProductTags>
                      {(product.categories || []).join(", ") ||
                        "캐주얼, 라이프스타일"}
                    </ProductTags>
                    <ProductPrice>
                      {Number(product.discountRate) > 0 ? (
                        <>
                          <DiscountRate>
                            {Math.round(Number(product.discountRate) * 100)}%
                          </DiscountRate>
                          <CurrentPrice $sale>
                            ₩{formatPrice(getDiscountedPrice(product))}
                          </CurrentPrice>
                          <OriginalPrice>
                            ₩{formatPrice(Number(product.price))}
                          </OriginalPrice>
                        </>
                      ) : (
                        <CurrentPrice>
                          ₩{formatPrice(Number(product.price))}
                        </CurrentPrice>
                      )}
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

const GenderTabs = styled.div`
  display: flex;
  margin-bottom: 24px;
`;

const GenderTab = styled.button`
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 500;
  background: ${({ $active }) => ($active ? "#212121" : "#fff")};
  color: ${({ $active }) => ($active ? "#fff" : "#212121")};
  border: 1px solid #212121;

  &:first-child {
    border-radius: 20px 0 0 20px;
  }
  &:last-child {
    border-radius: 0 20px 20px 0;
    border-left: none;
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
  max-width: 700px;
  line-height: 1.6;
`;

const CategoryTabs = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const CategoryTab = styled.button`
  padding: 8px 16px;
  border: 1px solid ${({ $active }) => ($active ? "#212121" : "#e0e0e0")};
  background: ${({ $active }) => ($active ? "#212121" : "#fff")};
  color: ${({ $active }) => ($active ? "#fff" : "#212121")};
  border-radius: 20px;
  font-size: 13px;
  transition: all 0.2s;

  &:hover {
    border-color: #212121;
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 24px 0;
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: 30px;
`;

const FilterSection = styled.aside`
  width: 180px;
  flex-shrink: 0;
`;
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

const SizeFilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
`;

const SizeButton = styled.button`
  padding: 8px 4px;
  border: 1px solid ${({ $active }) => ($active ? "#212121" : "#e0e0e0")};
  background: ${({ $active }) => ($active ? "#212121" : "#fff")};
  color: ${({ $active }) => ($active ? "#fff" : "#212121")};
  border-radius: 4px;
  font-size: 12px;
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
  background: ${({ $active }) => ($active ? "#f5f5f5" : "#fff")};

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
    to {
      transform: rotate(360deg);
    }
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
  gap: 20px;
`;

const ProductCard = styled(Link)`
  display: block;
`;

const SizeOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  padding: 12px;
  opacity: 0;
  transform: translateY(100%);
  transition: all 0.3s ease;
`;

const ProductImageWrapper = styled.div`
  position: relative;
  aspect-ratio: 1;
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 12px;

  &:hover ${SizeOverlay} {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${ProductImageWrapper}:hover & {
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

const SizeGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const SizeChip = styled.span`
  padding: 6px 10px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 12px;
  background: #fff;
`;

const ColorThumbnails = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 12px;
`;

const ColorThumb = styled.img`
  width: 32px;
  height: 32px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
`;

const MoreColors = styled.span`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #757575;
`;

const ProductInfo = styled.div``;

const ProductName = styled.h3`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
  color: #212121;
`;

const ProductTags = styled.p`
  font-size: 12px;
  color: #757575;
  margin-bottom: 8px;
`;

const ProductPrice = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DiscountRate = styled.span`
  color: #c62828;
  font-weight: 600;
  font-size: 14px;
`;

const OriginalPrice = styled.span`
  font-size: 13px;
  color: #757575;
  text-decoration: line-through;
`;

const CurrentPrice = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ $sale }) => ($sale ? "#c62828" : "#212121")};
`;
