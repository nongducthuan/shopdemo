import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import API from "../api";

export default function CategoryPage() {
  const { id } = useParams(); // Lấy id danh mục từ URL
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    API.get(`/products?category_id=${id}`)
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi tải sản phẩm:", err);
        setError("Không thể tải sản phẩm. Vui lòng thử lại.");
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <div className="container mt-4 mb-4">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-gray-800">
          DANH MỤC SẢN PHẨM
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-200 h-64 rounded-lg"
            ></div>
          ))}
        </div>
      </div>
    );

  if (error)
    return (
      <p className="text-center py-10 text-lg font-medium text-red-500">
        {error}
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
        <div className="flex flex-wrap justify-center gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              className="flex-1 min-w-[220px] max-w-[250px] flex justify-center"
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
