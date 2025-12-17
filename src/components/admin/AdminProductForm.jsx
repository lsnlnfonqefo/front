// 상품 등록 화면: 새 상품을 등록하는 폼
import React, { useState } from 'react';
import styled from 'styled-components';
import { createProduct } from '../../api/adminApi';

const Section = styled.section`
  background-color: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 800px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #333;
  font-size: 14px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const TextArea = styled.textarea`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-weight: normal;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const Button = styled.button`
  padding: 12px 24px;
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: background-color 0.2s;

  &:hover {
    background-color: #229954;
  }

  &:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background-color: #fee;
  color: #c33;
  padding: 15px;
  border-radius: 4px;
  border: 1px solid #fcc;
`;

const SuccessMessage = styled.div`
  background-color: #efe;
  color: #3c3;
  padding: 15px;
  border-radius: 4px;
  border: 1px solid #cfc;
`;

const AddImageButton = styled.button`
  padding: 8px 16px;
  background-color: #95a5a6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  align-self: flex-start;

  &:hover {
    background-color: #7f8c8d;
  }
`;

const ImageInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const RemoveButton = styled.button`
  padding: 4px 8px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  align-self: flex-start;

  &:hover {
    background-color: #c0392b;
  }
`;

const AdminProductForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountRate: 0,
    categories: [],
    sizes: '',
    material: '',
    imageUrls: [''],
    saleStart: '',
    saleEnd: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // 백엔드에서 허용하는 카테고리: new, lifestyle, sale, slipon
  const categories = ['new', 'lifestyle', 'sale', 'slipon'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCategoryChange = (category) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handleImageUrlChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.map((url, i) => i === index ? value : url),
    }));
  };

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      imageUrls: [...prev.imageUrls, ''],
    }));
  };

  const removeImageField = (index) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      // 유효성 검증
      if (!formData.name.trim()) {
        throw new Error('제품명을 입력해주세요.');
      }
      const priceValue = parseFloat(formData.price);
      if (isNaN(priceValue) || priceValue < 0) {
        throw new Error('가격은 0 이상의 숫자여야 합니다.');
      }
      if (priceValue > 99999999) {
        throw new Error('가격은 99,999,999원을 초과할 수 없습니다.');
      }
      if (formData.discountRate < 0 || formData.discountRate > 100) {
        throw new Error('할인율은 0과 100 사이의 값이어야 합니다.');
      }
      if (formData.categories.length === 0) {
        throw new Error('최소 하나의 카테고리를 선택해주세요.');
      }
      const sizesArray = formData.sizes
        .split(',')
        .map(s => parseInt(s.trim()))
        .filter(s => !isNaN(s));
      if (sizesArray.length === 0) {
        throw new Error('사이즈를 입력해주세요.');
      }
      const validImageUrls = formData.imageUrls.filter(url => url.trim() !== '');
      if (validImageUrls.length === 0) {
        throw new Error('최소 하나의 이미지 URL을 입력해주세요.');
      }

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        // 퍼센트 값을 0~1 사이 값으로 변환 (예: 10% → 0.1)
        discountRate: (parseFloat(formData.discountRate) || 0) / 100,
        categories: formData.categories,
        sizes: sizesArray,
        material: formData.material.trim(),
        imageUrls: validImageUrls,
        saleStart: formData.saleStart || null,
        saleEnd: formData.saleEnd || null,
      };

      // 디버깅: 전송할 데이터 확인
      console.log('📤 Sending product data:', {
        ...payload,
        imageUrls: payload.imageUrls.map(url => url.substring(0, 50) + '...'), // URL 길이 제한
      });

      if (payload.saleStart && payload.saleEnd) {
        if (new Date(payload.saleEnd) < new Date(payload.saleStart)) {
          throw new Error('종료일은 시작일보다 늦어야 합니다.');
        }
      }

      const response = await createProduct(payload);
      
      if (response.success) {
        setSuccess('상품이 성공적으로 등록되었습니다.');
        // 폼 초기화
        setFormData({
          name: '',
          description: '',
          price: '',
          discountRate: 0,
          categories: [],
          sizes: '',
          material: '',
          imageUrls: [''],
          saleStart: '',
          saleEnd: '',
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || '상품 등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section>
      <h2>상품 등록</h2>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>제품명 *</Label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>설명</Label>
          <TextArea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label>가격 (원) *</Label>
          <Input
            type="number"
            min="0"
            max="99999999"
            step="1"
            value={formData.price}
            onChange={(e) => handleInputChange('price', e.target.value)}
            placeholder="예: 99000"
            required
          />
          <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
            최대 99,999,999원까지 입력 가능합니다.
          </small>
        </FormGroup>

        <FormGroup>
          <Label>할인율 (%) *</Label>
          <Input
            type="number"
            min="0"
            max="100"
            step="1"
            value={formData.discountRate}
            onChange={(e) => handleInputChange('discountRate', e.target.value)}
            placeholder="예: 10 (10% 할인)"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>카테고리 *</Label>
          <CheckboxGroup>
            {categories.map(cat => (
              <CheckboxLabel key={cat}>
                <Checkbox
                  type="checkbox"
                  checked={formData.categories.includes(cat)}
                  onChange={() => handleCategoryChange(cat)}
                />
                {cat}
              </CheckboxLabel>
            ))}
          </CheckboxGroup>
        </FormGroup>

        <FormGroup>
          <Label>사이즈 (쉼표로 구분) *</Label>
          <Input
            type="text"
            value={formData.sizes}
            onChange={(e) => handleInputChange('sizes', e.target.value)}
            placeholder="250,255,260,265"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>소재</Label>
          <Input
            type="text"
            value={formData.material}
            onChange={(e) => handleInputChange('material', e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label>이미지 URL *</Label>
          <ImageInputContainer>
            {formData.imageUrls.map((url, index) => (
              <div key={index} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Input
                  type="url"
                  value={url}
                  onChange={(e) => handleImageUrlChange(index, e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  style={{ flex: 1 }}
                />
                {formData.imageUrls.length > 1 && (
                  <RemoveButton type="button" onClick={() => removeImageField(index)}>
                    삭제
                  </RemoveButton>
                )}
              </div>
            ))}
            <AddImageButton type="button" onClick={addImageField}>
              이미지 URL 추가
            </AddImageButton>
          </ImageInputContainer>
        </FormGroup>

        <FormGroup>
          <Label>세일 시작일</Label>
          <Input
            type="date"
            value={formData.saleStart}
            onChange={(e) => handleInputChange('saleStart', e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label>세일 종료일</Label>
          <Input
            type="date"
            value={formData.saleEnd}
            onChange={(e) => handleInputChange('saleEnd', e.target.value)}
          />
        </FormGroup>

        <Button type="submit" disabled={loading}>
          {loading ? '등록 중...' : '상품 등록'}
        </Button>
      </Form>
    </Section>
  );
};

export default AdminProductForm;



