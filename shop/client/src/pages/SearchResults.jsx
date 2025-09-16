import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx"; 

export default function SearchResults() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
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
    if (products.length > 0) {
      const result = products.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
      );
      setFiltered(result);
    }
  }, [query, products]);

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Kết quả tìm kiếm cho: "{query}"</h2>
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
            <ProductCard key={product.id} product={product}/>
          ))}
        </div>
      )}
    </div>
  );
}
