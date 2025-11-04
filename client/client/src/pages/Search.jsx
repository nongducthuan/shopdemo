import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";

export default function SearchResults() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gender, setGender] = useState("");
  const [category, setCategory] = useState("");

  const query = new URLSearchParams(useLocation().search).get("query") || "";

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi gọi API:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let result = products.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );

    if (gender) result = result.filter((p) => p.gender === gender);
    if (category) result = result.filter((p) => p.category === category);

    setFiltered(result);
  }, [query, products, gender, category]);

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Kết quả tìm kiếm cho: "{query}"</h2>
      <div style={{ display: "flex", gap: "1rem", margin: "1rem 0" }}>
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">Tất cả giới tính</option>
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
          <option value="Unisex">Unisex</option>
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Tất cả loại hàng</option>
          <option value="Áo">Áo</option>
          <option value="Quần">Quần</option>
          <option value="Váy">Váy</option>
          <option value="Giày">Giày</option>
          <option value="Phụ kiện">Phụ kiện</option>
        </select>
      </div>
      {filtered.length === 0 ? (
        <p>Không tìm thấy sản phẩm phù hợp.</p>
      ) : (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            justifyContent: "center",
          }}
        >
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
