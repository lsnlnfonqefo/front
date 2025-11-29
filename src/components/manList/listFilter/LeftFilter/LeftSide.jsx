import { useProducts } from "../../../../hooks/useProducts";
import { FilterOptions } from "../../../../types/product";
import "./LeftSide.css";

export default function LeftSide() {
  const { filters, toggleFilter } = useProducts();

  const handleSizeClick = (size) => {
    toggleFilter("sizes", size);
  };

  const handleMaterialChange = (materialId) => {
    toggleFilter("materials", materialId);
  };

  const handleFunctionChange = (functionId) => {
    toggleFilter("functions", functionId);
  };

  const handleModelChange = (modelId) => {
    toggleFilter("models", modelId);
  };

  return (
    <div className="left-side">
      {/* 사이즈 필터 */}
      <div className="filter-section">
        <h3>사이즈</h3>
        <div className="size-buttons">
          {FilterOptions.sizes.map((size) => (
            <button
              key={size}
              className={`size-btn ${
                filters.sizes.includes(size) ? "active" : ""
              }`}
              onClick={() => handleSizeClick(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* 소재 필터 */}
      <div className="filter-section">
        <h3>소재</h3>
        <div className="checkbox-group">
          {FilterOptions.materials.map((material) => (
            <label key={material.id}>
              <input
                type="checkbox"
                checked={filters.materials.includes(material.id)}
                onChange={() => handleMaterialChange(material.id)}
              />
              <span>{material.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 기능 필터 */}
      <div className="filter-section">
        <h3>기능</h3>
        <div className="checkbox-group">
          {FilterOptions.functions.map((func) => (
            <label key={func.id}>
              <input
                type="checkbox"
                checked={filters.functions.includes(func.id)}
                onChange={() => handleFunctionChange(func.id)}
              />
              <span>{func.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 모델 필터 */}
      <div className="filter-section">
        <h3>모델</h3>
        <div className="checkbox-group">
          {FilterOptions.models.map((model) => (
            <label key={model.id}>
              <input
                type="checkbox"
                checked={filters.models.includes(model.id)}
                onChange={() => handleModelChange(model.id)}
              />
              <span>{model.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
