import "../../LeftFilter/LeftSide.css";
export default function FunctionFilter(params) {
  return (
    <div>
      {" "}
      {/* 기능 필터 */}
      <div className="filter-section">
        <h3>기능</h3>
        <div className="checkbox-group">
          <label>
            <input type="checkbox" />
            <span>비즈니스</span>
          </label>
          <label>
            <input type="checkbox" />
            <span>캐주얼</span>
          </label>
          <label>
            <input type="checkbox" />
            <span>거리로 산책</span>
          </label>
          <label>
            <input type="checkbox" />
            <span>러닝</span>
          </label>
          <label>
            <input type="checkbox" />
            <span>슬립온</span>
          </label>
          <label>
            <input type="checkbox" />
            <span>운동화 스니커즈</span>
          </label>
          <label>
            <input type="checkbox" />
            <span>라이프스타일</span>
          </label>
          <label>
            <input type="checkbox" />
            <span>애슬레저</span>
          </label>
        </div>
      </div>
    </div>
  );
}
