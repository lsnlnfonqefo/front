import "../../LeftFilter/LeftSide.css";
export default function ModelFilter(params) {
  return (
    <div>
      {" "}
      {/* 모델 필터 */}
      <div className="filter-section">
        <h3>모델</h3>
        <div className="checkbox-group">
          <label>
            <input type="checkbox" />
            <span>러너</span>
          </label>
          <label>
            <input type="checkbox" />
            <span>러너</span>
          </label>
          <label>
            <input type="checkbox" />
            <span>구르미</span>
          </label>
          <label>
            <input type="checkbox" />
            <span>트레이어</span>
          </label>
        </div>
      </div>
    </div>
  );
}
