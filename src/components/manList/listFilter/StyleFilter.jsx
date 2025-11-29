import { useProducts } from "../../../hooks/useProducts";
import { FilterOptions } from "../../../types/product";
import "./StyleFilter.css";
import LeftSide from "./LeftFilter/LeftSide";
import RightSide from "./rightSide/RightSide";

export default function StyleFilter() {
  const { filters, toggleFilter, clearFilters, getActiveFilterCount } =
    useProducts();

  const handleCategoryClick = (categoryId) => {
    toggleFilter("categories", categoryId);
  };

  const handleRemoveSize = (size) => {
    toggleFilter("sizes", size);
  };

  return (
    <div className="style-filter-container">
      {/* 카테고리 탭 */}
      <div className="category-tabs">
        {FilterOptions.categories.map((category) => (
          <button
            key={category.id}
            className={`category-tab ${
              filters.categories.includes(category.id) ? "active" : ""
            }`}
            onClick={() => handleCategoryClick(category.id)}
          >
            {category.label}
            {category.auto && <span className="auto-badge">AUTO</span>}
          </button>
        ))}
      </div>

      {/* 적용된 필터 태그 */}
      {getActiveFilterCount() > 0 && (
        <div className="applied-filters">
          <h3>적용된 필터</h3>
          <div className="filter-tags">
            {filters.sizes.map((size) => (
              <span key={size} className="filter-tag">
                {size} <button onClick={() => handleRemoveSize(size)}>×</button>
              </span>
            ))}
            {filters.materials.map((material) => {
              const materialData = FilterOptions.materials.find(
                (m) => m.id === material
              );
              return (
                <span key={material} className="filter-tag">
                  {materialData?.label}{" "}
                  <button onClick={() => toggleFilter("materials", material)}>
                    ×
                  </button>
                </span>
              );
            })}
            {filters.functions.map((func) => {
              const funcData = FilterOptions.functions.find(
                (f) => f.id === func
              );
              return (
                <span key={func} className="filter-tag">
                  {funcData?.label}{" "}
                  <button onClick={() => toggleFilter("functions", func)}>
                    ×
                  </button>
                </span>
              );
            })}
            {filters.models.map((model) => {
              const modelData = FilterOptions.models.find(
                (m) => m.id === model
              );
              return (
                <span key={model} className="filter-tag">
                  {modelData?.label}{" "}
                  <button onClick={() => toggleFilter("models", model)}>
                    ×
                  </button>
                </span>
              );
            })}
          </div>
          <button className="clear-all" onClick={clearFilters}>
            초기화
          </button>
        </div>
      )}

      {/* 메인 컨텐츠 */}
      <div className="filter-content">
        <LeftSide />
        <RightSide />
      </div>
    </div>
  );
}
