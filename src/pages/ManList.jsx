import { useProducts } from "../hooks/useProducts";
import Slide from "../components/manList/slide/Slide";
import StyleFilter from "../components/manList/listFilter/StyleFilter";
import "./ManList.css";

export default function ManList() {
  const { updateFilters, filters } = useProducts();

  const handleGenderChange = (gender) => {
    updateFilters({ gender });
  };

  return (
    <div className="manlist-container">
      <Slide />
      <div className="category-tabs">
        <button
          className={`tab ${filters.gender === "men" ? "active" : ""}`}
          onClick={() => handleGenderChange("men")}
        >
          남성
        </button>
        <button
          className={`tab ${filters.gender === "women" ? "active" : ""}`}
          onClick={() => handleGenderChange("women")}
        >
          여성
        </button>
      </div>
      <StyleFilter />
    </div>
  );
}
