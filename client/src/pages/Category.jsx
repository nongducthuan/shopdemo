import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import API from "../api";

export default function CategoryPage() {
  const { id } = useParams(); // lấy id danh mục từ URL
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  if (loading)
    return (
      <p className="text-center py-10 text-lg font-medium text-gray-500 animate-pulse">
        Đang tải sản phẩm...
      </p>
    );

  return (
    <div className="container mt-4 mb-4">
      <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-gray-800">
        DANH MỤC SẢN PHẨM
      </h2>
      {products.length === 0 ? (
        <p className="text-gray-500 text-lg">Không có sản phẩm nào.</p>
      ) : (
        <div className="d-flex justify-center gap-6">
          {products.map((p) => (
            <div key={p.id}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
