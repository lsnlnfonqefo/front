import { useState } from "react";
import styled from "styled-components";
import adminService from "../../api/adminService";
import { FilterOptions } from "../../types/product";

const Container = styled.div`
  background: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px;
`;

const Form = styled.form``;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
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

const TextArea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #000;
  }
`;

const Select = styled.select`
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

const CheckboxGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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

const SizeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-top: 10px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 30px;
`;

const SubmitButton = styled.button`
  flex: 1;
  padding: 14px;
  background: #000;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #333;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 14px;
  background: white;
  color: #000;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    border-color: #000;
  }
`;

const availableSizes = [260, 265, 270, 275, 280, 285, 290, 295, 300, 305, 310];

export default function ProductForm({ onCancel, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    images: ["/img/slideimg1.jpg"], // 기본 이미지
    gender: "men",
    material: "",
    model: "",
    categories: [],
    functions: [],
    sizes: [],
    stockQuantity: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryToggle = (categoryId) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter((c) => c !== categoryId)
        : [...prev.categories, categoryId],
    }));
  };

  const handleFunctionToggle = (functionId) => {
    setFormData((prev) => ({
      ...prev,
      functions: prev.functions.includes(functionId)
        ? prev.functions.filter((f) => f !== functionId)
        : [...prev.functions, functionId],
    }));
  };

  const handleSizeToggle = (size) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size].sort((a, b) => a - b),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사
    if (!formData.name || !formData.description) {
      alert("상품명과 설명을 입력해주세요.");
      return;
    }

    if (!formData.price || !formData.originalPrice) {
      alert("가격 정보를 입력해주세요.");
      return;
    }

    if (formData.sizes.length === 0) {
      alert("최소 1개 이상의 사이즈를 선택해주세요.");
      return;
    }

    if (!formData.material || !formData.model) {
      alert("소재와 모델을 선택해주세요.");
      return;
    }

    setSubmitting(true);

    try {
      const productData = {
        ...formData,
        price: parseInt(formData.price),
        originalPrice: parseInt(formData.originalPrice),
        stockQuantity: parseInt(formData.stockQuantity) || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        saleStartDate: null,
        saleEndDate: null,
        inStock: true,
      };

      await adminService.createProduct(productData);
      alert("상품이 등록되었습니다!");
      onSuccess();
    } catch (error) {
      alert("상품 등록에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container>
      <Title>상품 등록</Title>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>상품명 *</Label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="예: 남성 울 그루커 슬립온"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>상품 설명 *</Label>
          <TextArea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="슬립온, 라이프스타일, 캐주얼"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>원가 *</Label>
          <Input
            type="number"
            name="originalPrice"
            value={formData.originalPrice}
            onChange={handleChange}
            placeholder="170000"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>판매가 *</Label>
          <Input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="119000"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>재고 수량</Label>
          <Input
            type="number"
            name="stockQuantity"
            value={formData.stockQuantity}
            onChange={handleChange}
            placeholder="50"
          />
        </FormGroup>

        <FormGroup>
          <Label>소재 *</Label>
          <Select
            name="material"
            value={formData.material}
            onChange={handleChange}
            required
          >
            <option value="">선택하세요</option>
            {FilterOptions.materials.map((material) => (
              <option key={material.id} value={material.id}>
                {material.label}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>모델 *</Label>
          <Select
            name="model"
            value={formData.model}
            onChange={handleChange}
            required
          >
            <option value="">선택하세요</option>
            {FilterOptions.models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.label}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>카테고리</Label>
          <CheckboxGroup>
            {FilterOptions.categories
              .filter((cat) => !cat.auto)
              .map((category) => (
                <CheckboxLabel key={category.id}>
                  <input
                    type="checkbox"
                    checked={formData.categories.includes(category.id)}
                    onChange={() => handleCategoryToggle(category.id)}
                  />
                  {category.label}
                </CheckboxLabel>
              ))}
          </CheckboxGroup>
        </FormGroup>

        <FormGroup>
          <Label>기능</Label>
          <CheckboxGroup>
            {FilterOptions.functions.map((func) => (
              <CheckboxLabel key={func.id}>
                <input
                  type="checkbox"
                  checked={formData.functions.includes(func.id)}
                  onChange={() => handleFunctionToggle(func.id)}
                />
                {func.label}
              </CheckboxLabel>
            ))}
          </CheckboxGroup>
        </FormGroup>

        <FormGroup>
          <Label>가용 사이즈 *</Label>
          <SizeGrid>
            {availableSizes.map((size) => (
              <CheckboxLabel key={size}>
                <input
                  type="checkbox"
                  checked={formData.sizes.includes(size)}
                  onChange={() => handleSizeToggle(size)}
                />
                {size}
              </CheckboxLabel>
            ))}
          </SizeGrid>
        </FormGroup>

        <ButtonGroup>
          <CancelButton type="button" onClick={onCancel}>
            취소
          </CancelButton>
          <SubmitButton type="submit" disabled={submitting}>
            {submitting ? "등록 중..." : "상품 등록"}
          </SubmitButton>
        </ButtonGroup>
      </Form>
    </Container>
  );
}
