import styled from "styled-components";

const Container = styled.div`
  margin: 20px 0;
`;

const Label = styled.h3`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 10px;
`;

const SizeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
`;

const SizeButton = styled.button`
  padding: 12px;
  border: 1px solid ${(props) => (props.isSelected ? "#000" : "#ddd")};
  background: ${(props) => (props.isSelected ? "#000" : "white")};
  color: ${(props) => (props.isSelected ? "white" : "#333")};
  font-size: 14px;
  font-weight: ${(props) => (props.isSelected ? "600" : "400")};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #000;
  }

  &:disabled {
    background: #f5f5f5;
    color: #ccc;
    cursor: not-allowed;
    border-color: #e0e0e0;
  }
`;

export default function SizeSelector({
  availableSizes,
  selectedSize,
  onSizeSelect,
}) {
  return (
    <Container>
      <Label>사이즈 선택</Label>
      <SizeGrid>
        {availableSizes.map((size) => (
          <SizeButton
            key={size}
            isSelected={selectedSize === size}
            onClick={() => onSizeSelect(size)}
          >
            {size}
          </SizeButton>
        ))}
      </SizeGrid>
    </Container>
  );
}
