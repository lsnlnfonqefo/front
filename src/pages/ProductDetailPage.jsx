import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import productService from "../api/productService";
import ProductImages from "../components/ProductDetail/ProductImages";
import ProductInfo from "../components/ProductDetail/ProductInfo";
import ReviewSection from "../components/ProductDetail/ReviewSection";

const Container = styled.div`
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
`;

const ProductLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  margin-bottom: 60px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Loading = styled.div`
  text-align: center;
  padding: 100px 20px;
  font-size: 18px;
  color: #666;
`;

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const data = await productService.getProductById(id);
      setProduct(data);
    } catch (error) {
      console.error("Failed to load product:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading>제품을 불러오는 중...</Loading>;
  }

  if (!product) {
    return <Loading>제품을 찾을 수 없습니다.</Loading>;
  }

  return (
    <Container>
      <ProductLayout>
        <ProductImages images={product.images} />
        <ProductInfo product={product} />
      </ProductLayout>
      <ReviewSection productId={product.id} />
    </Container>
  );
}
