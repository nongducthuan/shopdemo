import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import API from "../api.jsx";
import ProductCard from "../components/ProductCard.jsx";

export default function SearchResults() {
  const [products, setProducts] = useState([]); // Đảm bảo khởi tạo là mảng rỗng
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gender, setGender] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  const query = new URLSearchParams(useLocation().search).get("query") || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/products");  // Đảm bảo endpoint chính xác

        // Kiểm tra xem dữ liệu trả về có phải là đối tượng và có thuộc tính `data` là mảng không
        if (res.data && Array.isArray(res.data.data)) {
          setProducts(res.data.data);  // Gán dữ liệu sản phẩm vào state products
        } else {
          console.error("Dữ liệu trả về không phải là mảng:", res.data);
          setProducts([]);  // Trả về mảng rỗng nếu không phải mảng
        }

        // Fetch categories (for gender and categories)
        const categoryRes = await API.get("/categories");
        if (Array.isArray(categoryRes.data)) {
          setCategories(categoryRes.data);
        } else {
          console.error("Dữ liệu trả về danh mục không phải là mảng:", categoryRes.data);
          setCategories([]); // Trả về mảng rỗng nếu không phải mảng
        }

        setLoading(false);
      } catch (err) {
        console.error("Lỗi khi gọi API:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let result = Array.isArray(products) ? products.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    ) : []; // Kiểm tra trước khi lọc

    if (gender) result = result.filter((p) => {
      // Lọc theo giới tính
      return categories.find(c => c.id === p.category_id && c.parent_id === gender);
    });

    if (category) result = result.filter((p) => p.category_id === category);

    setFiltered(result);
  }, [query, products, gender, category, categories]);

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Kết quả tìm kiếm cho: "{query}"</h2>
      <div style={{ display: "flex", gap: "1rem", margin: "1rem 0" }}>
        {/* Dropdown giới tính */}
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">Tất cả giới tính</option>
          {categories
            .filter(c => !c.parent_id)  // Các danh mục chính như Nam, Nữ, Unisex
            .map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
        </select>

        {/* Dropdown danh mục */}
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Tất cả loại hàng</option>
          {categories
            .filter(c => c.parent_id === gender)  // Lọc danh mục con theo giới tính đã chọn
            .map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
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
