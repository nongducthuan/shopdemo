import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard"; // ✅ import component chung
import API from "../api"; // ✅ dùng API giống Home (nếu bạn đã có axios instance)

export default function CategoryPage() {
  const { id } = useParams(); // lấy id danh mục từ URL
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Gọi API để lấy sản phẩm theo category_id
    API.get(`/products?category_id=${id}`)
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi tải sản phẩm:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="text-center py-5">Đang tải sản phẩm...</p>;

  return (
    <div className="category-page container-fluid text-center py-5">
      <h2 className="section-title fw-bold mb-4">Danh mục sản phẩm</h2>
      <div className="row g-3 justify-content-center">
        {products.map((p) => (
          <div key={p.id} className="col-6 col-md-3 w-100 d-flex justify-content-center">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>

  );
}
