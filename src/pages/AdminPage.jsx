import { useState, useEffect } from "react";
import styled from "styled-components";
import { adminAPI } from "../api";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // 모달 상태
  const [showProductModal, setShowProductModal] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);

  // PPT slide21: 상품 등록 폼
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    material: "tree",
    categories: [],
    sizes: [],
    imageUrls: [""],
  });

  // PPT slide21: 가용사이즈 변경 폼
  const [sizeForm, setSizeForm] = useState([]);

  // PPT slide21: 할인정책 변경 폼
  const [discountForm, setDiscountForm] = useState({
    discountRate: 0,
    saleStart: "",
    saleEnd: "",
  });

  // PPT slide21: 판매현황 기간 필터
  const [salesFilter, setSalesFilter] = useState({ from: "", to: "" });

  useEffect(() => {
    if (activeTab === "products") {
      fetchProducts();
    } else if (activeTab === "sales") {
      fetchSales();
    }
  }, [activeTab]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const productList = await adminAPI.getProducts();
      // adminAPI가 이미 배열을 반환
      setProducts(Array.isArray(productList) ? productList : []);
    } catch (error) {
      console.error("상품 목록 조회 실패:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // PPT slide21: 판매현황 조회 (기간별 필터링)
  const fetchSales = async () => {
    setLoading(true);
    try {
      const salesList = await adminAPI.getSales(
        salesFilter.from,
        salesFilter.to
      );
      // adminAPI가 이미 배열을 반환
      setSales(Array.isArray(salesList) ? salesList : []);
    } catch (error) {
      console.error("매출 현황 조회 실패:", error);
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  // PPT slide21: 상품 등록
  const handleCreateProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      alert("상품명과 가격은 필수입니다.");
      return;
    }

    try {
      await adminAPI.createProduct({
        name: newProduct.name,
        description: newProduct.description,
        price: Number(newProduct.price),
        material: newProduct.material,
        categories: newProduct.categories,
        sizes: newProduct.sizes.map(Number),
        imageUrls: newProduct.imageUrls.filter((url) => url.trim()),
      });
      alert("상품이 등록되었습니다.");
      setShowProductModal(false);
      setNewProduct({
        name: "",
        description: "",
        price: "",
        material: "tree",
        categories: [],
        sizes: [],
        imageUrls: [""],
      });
      fetchProducts();
    } catch (error) {
      alert("상품 등록에 실패했습니다.");
    }
  };

  // PPT slide21: 가용사이즈 변경
  const handleUpdateSizes = async () => {
    try {
      await adminAPI.updateSizes(selectedProduct.id, sizeForm.map(Number));
      alert("가용 사이즈가 변경되었습니다.");
      setShowSizeModal(false);
      fetchProducts();
    } catch (error) {
      alert("사이즈 변경에 실패했습니다.");
    }
  };

  // PPT slide21: 할인정책 변경
  const handleUpdateDiscount = async () => {
    try {
      await adminAPI.updateDiscount(
        selectedProduct.id,
        discountForm.discountRate / 100, // API는 0~1 비율
        discountForm.saleStart,
        discountForm.saleEnd
      );
      alert("할인 정책이 변경되었습니다.");
      setShowDiscountModal(false);
      fetchProducts();
    } catch (error) {
      alert("할인 정책 변경에 실패했습니다.");
    }
  };

  const openSizeModal = (product) => {
    setSelectedProduct(product);
    setSizeForm(
      product.sizes?.map((s) => (typeof s === "object" ? s.size : s)) || []
    );
    setShowSizeModal(true);
  };

  const openDiscountModal = (product) => {
    setSelectedProduct(product);
    setDiscountForm({
      discountRate: (product.discountRate || 0) * 100,
      saleStart: product.saleStart?.split("T")[0] || "",
      saleEnd: product.saleEnd?.split("T")[0] || "",
    });
    setShowDiscountModal(true);
  };

  const formatPrice = (price) => {
    return price?.toLocaleString() || 0;
  };

  const sizeOptions = [
    "220",
    "230",
    "240",
    "250",
    "255",
    "260",
    "265",
    "270",
    "275",
    "280",
    "285",
    "290",
    "295",
    "300",
    "305",
    "310",
    "315",
    "320",
  ];
  const categoryOptions = [
    { value: "lifestyle", label: "라이프스타일" },
    { value: "slipon", label: "슬립온" },
  ];

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>관리자 페이지</PageTitle>
      </PageHeader>

      <TabContainer>
        <Tab
          $active={activeTab === "products"}
          onClick={() => setActiveTab("products")}
        >
          상품 관리
        </Tab>
        <Tab
          $active={activeTab === "sales"}
          onClick={() => setActiveTab("sales")}
        >
          판매 현황
        </Tab>
      </TabContainer>

      <ContentWrapper>
        {activeTab === "products" && (
          <ProductManagement>
            <ToolBar>
              <h2>등록된 상품</h2>
              {/* PPT slide21: 상품등록 버튼 */}
              <AddButton onClick={() => setShowProductModal(true)}>
                + 새 상품 등록
              </AddButton>
            </ToolBar>

            {loading ? (
              <LoadingWrapper>
                <Spinner />
              </LoadingWrapper>
            ) : (
              <ProductTable>
                <thead>
                  <tr>
                    <th>이미지</th>
                    <th>상품명</th>
                    <th>가격</th>
                    <th>소재</th>
                    <th>할인율</th>
                    <th>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <TableImage>
                          {product.imageUrls?.[0] ? (
                            <img
                              src={product.imageUrls[0]}
                              alt={product.name}
                            />
                          ) : (
                            "🖼️"
                          )}
                        </TableImage>
                      </td>
                      <td>{product.name}</td>
                      <td>{formatPrice(product.price)}원</td>
                      <td>{product.material}</td>
                      <td>{Math.round((product.discountRate || 0) * 100)}%</td>
                      <td>
                        <ActionButtons>
                          {/* PPT slide21: 가용사이즈 변경 */}
                          <ActionButton onClick={() => openSizeModal(product)}>
                            사이즈 변경
                          </ActionButton>
                          {/* PPT slide21: 할인정책 변경 */}
                          <ActionButton
                            onClick={() => openDiscountModal(product)}
                          >
                            할인 설정
                          </ActionButton>
                        </ActionButtons>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </ProductTable>
            )}
          </ProductManagement>
        )}

        {/* PPT slide21: 판매현황 */}
        {activeTab === "sales" && (
          <SalesManagement>
            <ToolBar>
              <h2>판매 현황</h2>
              <FilterGroup>
                <FilterInput
                  type="date"
                  value={salesFilter.from}
                  onChange={(e) =>
                    setSalesFilter((prev) => ({
                      ...prev,
                      from: e.target.value,
                    }))
                  }
                />
                <span>~</span>
                <FilterInput
                  type="date"
                  value={salesFilter.to}
                  onChange={(e) =>
                    setSalesFilter((prev) => ({ ...prev, to: e.target.value }))
                  }
                />
                <FilterButton onClick={fetchSales}>조회</FilterButton>
              </FilterGroup>
            </ToolBar>

            {loading ? (
              <LoadingWrapper>
                <Spinner />
              </LoadingWrapper>
            ) : (
              <>
                <SalesSummary>
                  <SummaryCard>
                    <SummaryLabel>총 매출</SummaryLabel>
                    <SummaryValue>
                      {formatPrice(
                        sales.reduce(
                          (sum, s) => sum + (s.totalRevenue || s.revenue || 0),
                          0
                        )
                      )}
                      원
                    </SummaryValue>
                  </SummaryCard>
                  <SummaryCard>
                    <SummaryLabel>총 판매 수량</SummaryLabel>
                    <SummaryValue>
                      {sales.reduce(
                        (sum, s) => sum + (s.totalQuantity || s.quantity || 0),
                        0
                      )}
                      개
                    </SummaryValue>
                  </SummaryCard>
                </SalesSummary>

                <SalesTable>
                  <thead>
                    <tr>
                      <th>상품명</th>
                      <th>판매 수량</th>
                      <th>매출액</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.map((sale, index) => (
                      <tr key={index}>
                        <td>{sale.productName || sale.product?.name}</td>
                        <td>{sale.totalQuantity || sale.quantity}개</td>
                        <td>
                          {formatPrice(sale.totalRevenue || sale.revenue)}원
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </SalesTable>
              </>
            )}
          </SalesManagement>
        )}
      </ContentWrapper>

      {/* PPT slide21: 상품 등록 모달 */}
      {showProductModal && (
        <>
          <ModalOverlay onClick={() => setShowProductModal(false)} />
          <Modal>
            <ModalHeader>
              <ModalTitle>새 상품 등록</ModalTitle>
              <ModalClose onClick={() => setShowProductModal(false)}>
                ✕
              </ModalClose>
            </ModalHeader>
            <ModalContent>
              <FormGroup>
                <Label>상품명 *</Label>
                <Input
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="상품명을 입력하세요"
                />
              </FormGroup>
              <FormGroup>
                <Label>상품 설명</Label>
                <Textarea
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="상품 설명을 입력하세요"
                  rows={3}
                />
              </FormGroup>
              <FormRow>
                <FormGroup>
                  <Label>가격 *</Label>
                  <Input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                    placeholder="가격"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>소재 *</Label>
                  <Select
                    value={newProduct.material}
                    onChange={(e) =>
                      setNewProduct((prev) => ({
                        ...prev,
                        material: e.target.value,
                      }))
                    }
                  >
                    <option value="tree">Tree</option>
                    <option value="wool">Wool</option>
                  </Select>
                </FormGroup>
              </FormRow>
              <FormGroup>
                <Label>카테고리</Label>
                <CheckboxGroup>
                  {categoryOptions.map((cat) => (
                    <CheckboxLabel key={cat.value}>
                      <input
                        type="checkbox"
                        checked={newProduct.categories.includes(cat.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewProduct((prev) => ({
                              ...prev,
                              categories: [...prev.categories, cat.value],
                            }));
                          } else {
                            setNewProduct((prev) => ({
                              ...prev,
                              categories: prev.categories.filter(
                                (c) => c !== cat.value
                              ),
                            }));
                          }
                        }}
                      />
                      {cat.label}
                    </CheckboxLabel>
                  ))}
                </CheckboxGroup>
              </FormGroup>
              <FormGroup>
                <Label>가용 사이즈</Label>
                <SizeCheckboxGroup>
                  {sizeOptions.map((size) => (
                    <SizeCheckbox
                      key={size}
                      $selected={newProduct.sizes.includes(size)}
                      onClick={() => {
                        if (newProduct.sizes.includes(size)) {
                          setNewProduct((prev) => ({
                            ...prev,
                            sizes: prev.sizes.filter((s) => s !== size),
                          }));
                        } else {
                          setNewProduct((prev) => ({
                            ...prev,
                            sizes: [...prev.sizes, size],
                          }));
                        }
                      }}
                    >
                      {size}
                    </SizeCheckbox>
                  ))}
                </SizeCheckboxGroup>
              </FormGroup>
              {/* PPT slide21: 사진은 반드시 포함 */}
              <FormGroup>
                <Label>상품 이미지 URL *</Label>
                {newProduct.imageUrls.map((url, index) => (
                  <ImageUrlInput key={index}>
                    <Input
                      value={url}
                      onChange={(e) => {
                        const newUrls = [...newProduct.imageUrls];
                        newUrls[index] = e.target.value;
                        setNewProduct((prev) => ({
                          ...prev,
                          imageUrls: newUrls,
                        }));
                      }}
                      placeholder="이미지 URL을 입력하세요"
                    />
                    {index === newProduct.imageUrls.length - 1 && (
                      <AddImageButton
                        type="button"
                        onClick={() =>
                          setNewProduct((prev) => ({
                            ...prev,
                            imageUrls: [...prev.imageUrls, ""],
                          }))
                        }
                      >
                        +
                      </AddImageButton>
                    )}
                  </ImageUrlInput>
                ))}
              </FormGroup>
            </ModalContent>
            <ModalFooter>
              <CancelButton onClick={() => setShowProductModal(false)}>
                취소
              </CancelButton>
              <SubmitButton onClick={handleCreateProduct}>
                등록하기
              </SubmitButton>
            </ModalFooter>
          </Modal>
        </>
      )}

      {/* PPT slide21: 사이즈 변경 모달 */}
      {showSizeModal && (
        <>
          <ModalOverlay onClick={() => setShowSizeModal(false)} />
          <Modal>
            <ModalHeader>
              <ModalTitle>가용 사이즈 변경</ModalTitle>
              <ModalClose onClick={() => setShowSizeModal(false)}>✕</ModalClose>
            </ModalHeader>
            <ModalContent>
              <ProductNameDisplay>{selectedProduct?.name}</ProductNameDisplay>
              <SizeCheckboxGroup>
                {sizeOptions.map((size) => (
                  <SizeCheckbox
                    key={size}
                    $selected={sizeForm.includes(size)}
                    onClick={() => {
                      if (sizeForm.includes(size)) {
                        setSizeForm(sizeForm.filter((s) => s !== size));
                      } else {
                        setSizeForm([...sizeForm, size]);
                      }
                    }}
                  >
                    {size}
                  </SizeCheckbox>
                ))}
              </SizeCheckboxGroup>
            </ModalContent>
            <ModalFooter>
              <CancelButton onClick={() => setShowSizeModal(false)}>
                취소
              </CancelButton>
              <SubmitButton onClick={handleUpdateSizes}>저장</SubmitButton>
            </ModalFooter>
          </Modal>
        </>
      )}

      {/* PPT slide21: 할인 설정 모달 */}
      {showDiscountModal && (
        <>
          <ModalOverlay onClick={() => setShowDiscountModal(false)} />
          <Modal>
            <ModalHeader>
              <ModalTitle>할인 정책 변경</ModalTitle>
              <ModalClose onClick={() => setShowDiscountModal(false)}>
                ✕
              </ModalClose>
            </ModalHeader>
            <ModalContent>
              <ProductNameDisplay>{selectedProduct?.name}</ProductNameDisplay>
              <FormGroup>
                <Label>할인율 (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={discountForm.discountRate}
                  onChange={(e) =>
                    setDiscountForm((prev) => ({
                      ...prev,
                      discountRate: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </FormGroup>
              <FormRow>
                <FormGroup>
                  <Label>세일 시작일</Label>
                  <Input
                    type="date"
                    value={discountForm.saleStart}
                    onChange={(e) =>
                      setDiscountForm((prev) => ({
                        ...prev,
                        saleStart: e.target.value,
                      }))
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>세일 종료일</Label>
                  <Input
                    type="date"
                    value={discountForm.saleEnd}
                    onChange={(e) =>
                      setDiscountForm((prev) => ({
                        ...prev,
                        saleEnd: e.target.value,
                      }))
                    }
                  />
                </FormGroup>
              </FormRow>
            </ModalContent>
            <ModalFooter>
              <CancelButton onClick={() => setShowDiscountModal(false)}>
                취소
              </CancelButton>
              <SubmitButton onClick={handleUpdateDiscount}>저장</SubmitButton>
            </ModalFooter>
          </Modal>
        </>
      )}
    </PageWrapper>
  );
};

export default AdminPage;

// Styled Components (이전과 동일한 스타일 유지)
const PageWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px;
`;

const PageHeader = styled.div`
  margin-bottom: 30px;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 30px;
  border-bottom: 1px solid #e0e0e0;
`;

const Tab = styled.button`
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 500;
  color: ${({ $active }) => ($active ? "#212121" : "#757575")};
  border-bottom: 2px solid
    ${({ $active }) => ($active ? "#212121" : "transparent")};
  margin-bottom: -1px;
  transition: all 0.2s;

  &:hover {
    color: #212121;
  }
`;

const ContentWrapper = styled.div``;

const ProductManagement = styled.div``;

const SalesManagement = styled.div``;

const ToolBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  h2 {
    font-size: 18px;
    font-weight: 600;
  }
`;

const AddButton = styled.button`
  padding: 10px 20px;
  background: #212121;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  transition: background 0.2s;

  &:hover {
    background: #424242;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const FilterInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
`;

const FilterButton = styled.button`
  padding: 8px 16px;
  background: #212121;
  color: #fff;
  font-size: 14px;
  border-radius: 6px;

  &:hover {
    background: #424242;
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

const ProductTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 16px;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
  }

  th {
    font-weight: 600;
    background: #f5f5f5;
  }
`;

const TableImage = styled.div`
  width: 60px;
  height: 60px;
  background: #f5f5f5;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 12px;
  transition: all 0.2s;

  &:hover {
    background: #212121;
    color: #fff;
    border-color: #212121;
  }
`;

const SalesSummary = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 30px;
`;

const SummaryCard = styled.div`
  padding: 24px;
  background: #f5f5f5;
  border-radius: 12px;
`;

const SummaryLabel = styled.p`
  font-size: 14px;
  color: #757575;
  margin-bottom: 8px;
`;

const SummaryValue = styled.p`
  font-size: 28px;
  font-weight: 700;
`;

const SalesTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 16px;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
  }

  th {
    font-weight: 600;
    background: #f5f5f5;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 520px;
  max-height: 90vh;
  background: #fff;
  border-radius: 12px;
  z-index: 1001;
  overflow: hidden;
  display: flex;
  flex-direction: column;
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
  overflow-y: auto;
`;

const ModalFooter = styled.div`
  display: flex;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #e0e0e0;
`;

const ProductNameDisplay = styled.p`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e0e0e0;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #212121;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  resize: none;

  &:focus {
    outline: none;
    border-color: #212121;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  background: #fff;

  &:focus {
    outline: none;
    border-color: #212121;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  gap: 20px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  cursor: pointer;
`;

const SizeCheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const SizeCheckbox = styled.button`
  padding: 8px 14px;
  border: 1px solid ${({ $selected }) => ($selected ? "#212121" : "#e0e0e0")};
  background: ${({ $selected }) => ($selected ? "#212121" : "#fff")};
  color: ${({ $selected }) => ($selected ? "#fff" : "#212121")};
  border-radius: 4px;
  font-size: 13px;
  transition: all 0.2s;
`;

const ImageUrlInput = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
`;

const AddImageButton = styled.button`
  width: 44px;
  height: 44px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 20px;
  flex-shrink: 0;

  &:hover {
    background: #f5f5f5;
  }
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 14px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  transition: background 0.2s;

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
  transition: background 0.2s;

  &:hover {
    background: #424242;
  }
`;
