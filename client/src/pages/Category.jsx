import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function CategoryPage() {
  const { id } = useParams(); // lấy id danh mục từ URL
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Gọi API để lấy sản phẩm thuộc danh mục này
    fetch(`http://localhost:5000/products?category_id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi tải sản phẩm:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Đang tải sản phẩm...</p>;

  return (
    <div className="category-page container py-5">
      <h2 className="text-center mb-4">Danh mục sản phẩm</h2>

      {products.length === 0 ? (
        <p className="text-center text-muted">Không có sản phẩm nào.</p>
      ) : (
        <div className="row">
          {products.map((p) => (
            <div key={p.id} className="col-md-3 mb-4">
              <div className="card h-100 shadow-sm">
                <img
                  src={p.image_url}
                  className="card-img-top"
                  alt={p.name}
                  style={{ objectFit: "cover", height: "200px" }}
                />
                <div className="card-body text-center">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text text-danger">
                    {p.price.toLocaleString()}₫
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
