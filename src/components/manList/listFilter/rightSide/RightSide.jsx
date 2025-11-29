import { useNavigate } from "react-router-dom";
import { useProducts } from "../../../../hooks/useProducts";
import { SortOptions, SortLabels } from "../../../../utils/sortUtils";
import "./RightSide.css";

export default function RightSide() {
  const { filteredProducts, loading, error, sortType, updateSort } =
    useProducts();
  const navigate = useNavigate();

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div className="right-side">
        <div className="loading-state">
          <p>제품을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="right-side">
        <div className="error-state">
          <p>제품을 불러오는데 실패했습니다.</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="right-side">
      <div className="product-header">
        <h2>{filteredProducts.length}개 제품</h2>
        <select
          className="sort-select"
          value={sortType}
          onChange={(e) => updateSort(e.target.value)}
        >
          {Object.entries(SortOptions).map(([key, value]) => (
            <option key={value} value={value}>
              {SortLabels[value]}
            </option>
          ))}
        </select>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <p>선택한 필터에 맞는 제품이 없습니다.</p>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => handleProductClick(product.id)}
            >
              <div className="product-image">
                <img src={product.images[0]} alt={product.name} />
                {product.isOnSale && (
                  <span className="discount-badge">
                    -{product.discountPercentage}%
                  </span>
                )}
                {product.isNew && <span className="new-badge">NEW</span>}
              </div>

              <div className="color-options">
                {product.colors.map((color, index) => (
                  <span
                    key={index}
                    className="color-dot"
                    style={{ backgroundColor: color }}
                    title={color}
                  ></span>
                ))}
              </div>

              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-price">
                  {product.isOnSale && (
                    <span className="discount">
                      -{product.discountPercentage}%
                    </span>
                  )}
                  <span className="current-price">
                    ₩{product.price.toLocaleString()}
                  </span>
                  {product.isOnSale && (
                    <span className="original-price">
                      ₩{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
