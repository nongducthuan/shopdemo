import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import API from "../api";

const allCategories = [
  { id: 4, name: "ÁO NAM" },
  { id: 5, name: "QUẦN NAM" },
  { id: 6, name: "ÁO NỮ" },
  { id: 7, name: "QUẦN NỮ" },
  { id: 8, name: "ÁO UNISEX" },
  { id: 9, name: "QUẦN UNISEX" },
];

export default function CategoryPage() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const limit = 8; // sản phẩm mỗi trang
  const categoryName = allCategories.find((c) => c.id === Number(id))?.name;

  useEffect(() => {
    setLoading(true);
    setError(null);

    API.get(`/products?category_id=${id}&page=${page}&limit=${limit}`)
      .then((res) => {
        const response = res.data;
        // check an toàn
        setProducts(Array.isArray(response.data) ? response.data : response);
        setTotalPages(response.totalPages || 1);
        setLoading(false);
        // scroll lên đầu khi đổi trang
        window.scrollTo({ top: 0, behavior: "smooth" });
      })
      .catch(() => {
        setError("Không thể tải sản phẩm. Vui lòng thử lại.");
        setLoading(false);
      });
  }, [id, page]);

  const nextPage = () => setPage((p) => Math.min(p + 1, totalPages));
  const prevPage = () => setPage((p) => Math.max(p - 1, 1));

  if (loading)
    return (
      <div className="container mt-4 mb-4">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-gray-800">
          {categoryName}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(limit)].map((_, i) => (
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
        DANH MỤC SẢN PHẨM {categoryName}
      </h2>

      {!products || products.length === 0 ? (
        <p className="text-gray-500 text-lg">Không có sản phẩm nào.</p>
      ) : (
        <>
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

          {/* NÚT PHÂN TRANG */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              disabled={page === 1}
              onClick={prevPage}
              className={`px-4 py-2 rounded-md border ${
                page === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              ← Trước
            </button>

            <span className="px-3 py-2">
              Trang {page}/{totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={nextPage}
              className={`px-4 py-2 rounded-md border ${
                page === totalPages ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Sau →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
