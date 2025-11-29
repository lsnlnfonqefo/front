import { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const MainImage = styled.img`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
`;

const ThumbnailContainer = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
`;

const Thumbnail = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  border: 2px solid ${(props) => (props.isActive ? "#000" : "transparent")};
  transition: border 0.2s;

  &:hover {
    border-color: #666;
  }
`;

export default function ProductImages({ images }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <Container>
      <MainImage src={images[selectedIndex]} alt="Product" />
      <ThumbnailContainer>
        {images.map((image, index) => (
          <Thumbnail
            key={index}
            src={image}
            alt={`Thumbnail ${index + 1}`}
            isActive={index === selectedIndex}
            onClick={() => setSelectedIndex(index)}
          />
        ))}
      </ThumbnailContainer>
    </Container>
  );
}
