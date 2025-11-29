import "../../LeftFilter/LeftSide.css";
export default function SizeFilter(params) {
  return (
    <div>
      <div className="filter-section">
        <h3>사이즈</h3>
        <div className="size-buttons">
          <button className="size-btn">260</button>
          <button className="size-btn">265</button>
          <button className="size-btn active">270</button>
          <button className="size-btn">275</button>
          <button className="size-btn active">280</button>
          <button className="size-btn">285</button>
          <button className="size-btn">290</button>
          <button className="size-btn active">295</button>
          <button className="size-btn">300</button>
          <button className="size-btn">305</button>
          <button className="size-btn">310</button>
        </div>
      </div>
    </div>
  );
}
