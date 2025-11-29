import "../../LeftFilter/LeftSide.css";
export default function FabricFilter(params) {
  return (
    <div>
      {/* 소재 필터 */}
      <div className="filter-section">
        <h3>소재</h3>
        <div className="checkbox-group">
          <label>
            <input type="checkbox" />
            <span>가볍고 시원한 troo</span>
          </label>
          <label>
            <input type="checkbox" />
            <span>부드럽고 따뜻한 wool</span>
          </label>
        </div>
      </div>
    </div>
  );
}
