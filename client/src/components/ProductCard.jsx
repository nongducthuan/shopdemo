import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  // Hàm định dạng tiền VNĐ
  const formatCurrency = (amount) =>
    Number(amount).toLocaleString("vi-VN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }) + " đ";

  // URL backend để lấy ảnh
  const backendUrl = "http://localhost:5000";

  return (
    <div
      className="card"
      style={{ width: "300px", cursor: "pointer" }}
    >
      <div
        className="card-body"
        style={{ display: "flex", flexDirection: "column" }}
      >
        {/* Click vào ảnh sẽ vào chi tiết */}
        <img
          style={{ height: "100%" }}
          src={
            product.image_url
              ? `${backendUrl}${product.image_url}` // Lấy từ backend
              : "https://via.placeholder.com/286x180?text=No+Image" // Ảnh dự phòng
          }
          className="card-img-top"
          alt={product.name}
          onClick={() => navigate(`/products/${product.id}`)}
        />
        <h5
          className="card-title"
          onClick={() => navigate(`/products/${product.id}`)}
        >
          {product.name}
        </h5>
        <p className="card-text">{product.description}</p>
        <p className="card-text">Giá: {formatCurrency(product.price)}</p>
      </div>
    </div>
  );
}
