import { useState, useEffect } from "react";
import styled from "styled-components";
import productService from "../../api/productService";
import adminService from "../../api/adminService";

const Container = styled.div`
  background: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
`;

const AddButton = styled.button`
  padding: 10px 20px;
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

const ProductTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Thead = styled.thead`
  background: #f8f9fa;
`;

const Th = styled.th`
  padding: 12px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  border-bottom: 2px solid #e0e0e0;
`;

const Tbody = styled.tbody``;

const Tr = styled.tr`
  &:hover {
    background: #f8f9fa;
  }
`;

const Td = styled.td`
  padding: 12px;
  font-size: 14px;
  border-bottom: 1px solid #f0f0f0;
`;

const ProductImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  margin-right: 5px;

  &:hover {
    border-color: #000;
  }
`;

const Modal = styled.div`
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
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #000;
  }
`;

const SizeCheckboxGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-top: 10px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  cursor: pointer;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
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

const availableSizes = [260, 265, 270, 275, 280, 285, 290, 295, 300, 305, 310];

export default function ProductManagement({ onAddProduct }) {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // 'size' or 'discount'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [discountData, setDiscountData] = useState({
    saleStartDate: "",
    saleEndDate: "",
    discountRate: 0,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productService.getProducts({ gender: "men" });
      setProducts(data);
    } catch (error) {
      console.error("Failed to load products:", error);
    }
  };

  const handleEditSize = (product) => {
    setSelectedProduct(product);
    setSelectedSizes(product.sizes);
    setModalType("size");
    setIsModalOpen(true);
  };

  const handleEditDiscount = (product) => {
    setSelectedProduct(product);
    setDiscountData({
      saleStartDate: product.saleStartDate
        ? new Date(product.saleStartDate).toISOString().split("T")[0]
        : "",
      saleEndDate: product.saleEndDate
        ? new Date(product.saleEndDate).toISOString().split("T")[0]
        : "",
      discountRate: product.discountPercentage || 0,
    });
    setModalType("discount");
    setIsModalOpen(true);
  };

  const handleSizeToggle = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size)
        ? prev.filter((s) => s !== size)
        : [...prev, size].sort((a, b) => a - b)
    );
  };

  const handleSubmitSize = async () => {
    if (selectedSizes.length === 0) {
      alert("최소 1개 이상의 사이즈를 선택해주세요.");
      return;
    }

    try {
      await adminService.updateAvailableSizes(
        selectedProduct.id,
        selectedSizes
      );
      alert("가용 사이즈가 변경되었습니다.");
      setIsModalOpen(false);
      loadProducts();
    } catch (error) {
      alert("사이즈 변경에 실패했습니다.");
    }
  };

  const handleSubmitDiscount = async () => {
    if (!discountData.saleStartDate || !discountData.saleEndDate) {
      alert("세일 기간을 입력해주세요.");
      return;
    }

    if (discountData.discountRate <= 0 || discountData.discountRate > 100) {
      alert("할인율은 1-100 사이의 값이어야 합니다.");
      return;
    }

    try {
      await adminService.updateDiscount(
        selectedProduct.id,
        discountData.saleStartDate,
        discountData.saleEndDate,
        discountData.discountRate
      );
      alert("할인 정책이 변경되었습니다.");
      setIsModalOpen(false);
      loadProducts();
    } catch (error) {
      alert("할인 정책 변경에 실패했습니다.");
    }
  };

  return (
    <>
      <Container>
        <Header>
          <Title>상품 관리</Title>
          <AddButton onClick={onAddProduct}>+ 상품 등록</AddButton>
        </Header>

        <ProductTable>
          <Thead>
            <Tr>
              <Th>이미지</Th>
              <Th>상품명</Th>
              <Th>가격</Th>
              <Th>재고</Th>
              <Th>관리</Th>
            </Tr>
          </Thead>
          <Tbody>
            {products.map((product) => (
              <Tr key={product.id}>
                <Td>
                  <ProductImage src={product.images[0]} alt={product.name} />
                </Td>
                <Td>{product.name}</Td>
                <Td>₩{product.price.toLocaleString()}</Td>
                <Td>{product.stockQuantity || 0}개</Td>
                <Td>
                  <ActionButton onClick={() => handleEditSize(product)}>
                    사이즈 변경
                  </ActionButton>
                  <ActionButton onClick={() => handleEditDiscount(product)}>
                    할인 설정
                  </ActionButton>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </ProductTable>
      </Container>

      {/* 사이즈 변경 모달 */}
      {modalType === "size" && (
        <Modal isOpen={isModalOpen} onClick={() => setIsModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>가용 사이즈 변경</ModalTitle>
            <p
              style={{ fontSize: "14px", color: "#666", marginBottom: "15px" }}
            >
              {selectedProduct?.name}
            </p>
            <SizeCheckboxGroup>
              {availableSizes.map((size) => (
                <CheckboxLabel key={size}>
                  <input
                    type="checkbox"
                    checked={selectedSizes.includes(size)}
                    onChange={() => handleSizeToggle(size)}
                  />
                  {size}
                </CheckboxLabel>
              ))}
            </SizeCheckboxGroup>
            <ButtonGroup>
              <CancelButton onClick={() => setIsModalOpen(false)}>
                취소
              </CancelButton>
              <SubmitButton onClick={handleSubmitSize}>저장</SubmitButton>
            </ButtonGroup>
          </ModalContent>
        </Modal>
      )}

      {/* 할인 설정 모달 */}
      {modalType === "discount" && (
        <Modal isOpen={isModalOpen} onClick={() => setIsModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>할인 정책 변경</ModalTitle>
            <p
              style={{ fontSize: "14px", color: "#666", marginBottom: "15px" }}
            >
              {selectedProduct?.name}
            </p>
            <FormGroup>
              <Label>세일 시작일</Label>
              <Input
                type="date"
                value={discountData.saleStartDate}
                onChange={(e) =>
                  setDiscountData((prev) => ({
                    ...prev,
                    saleStartDate: e.target.value,
                  }))
                }
              />
            </FormGroup>
            <FormGroup>
              <Label>세일 종료일</Label>
              <Input
                type="date"
                value={discountData.saleEndDate}
                onChange={(e) =>
                  setDiscountData((prev) => ({
                    ...prev,
                    saleEndDate: e.target.value,
                  }))
                }
              />
            </FormGroup>
            <FormGroup>
              <Label>할인율 (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={discountData.discountRate}
                onChange={(e) =>
                  setDiscountData((prev) => ({
                    ...prev,
                    discountRate: parseInt(e.target.value) || 0,
                  }))
                }
              />
            </FormGroup>
            <ButtonGroup>
              <CancelButton onClick={() => setIsModalOpen(false)}>
                취소
              </CancelButton>
              <SubmitButton onClick={handleSubmitDiscount}>저장</SubmitButton>
            </ButtonGroup>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
const handleSubmitDiscount = async () => {
  if (!discountData.saleStartDate || !discountData.saleEndDate) {
    alert("세일 기간을 입력해주세요.");
    return;
  }

  if (discountData.discountRate <= 0 || discountData.discountRate > 100) {
    alert("할인율은 1-100 사이의 값이어야 합니다.");
    return;
  }

  try {
    // API 파라미터 순서 수정
    await adminService.updateDiscount(
      selectedProduct.id,
      discountData.discountRate,
      discountData.saleStartDate,
      discountData.saleEndDate
    );
    alert("할인 정책이 변경되었습니다.");
    setIsModalOpen(false);
    loadProducts();
  } catch (error) {
    alert("할인 정책 변경에 실패했습니다.");
  }
};
