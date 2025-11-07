import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const backendUrl = "http://localhost:5000";

  const formatCurrency = (amount) =>
    Number(amount).toLocaleString("vi-VN") + " đ";

  return (
    <div
      className="card product-card border-0 shadow-sm"
      onClick={() => navigate(`/products/${product.id}`)}
    >
      <div className="position-relative overflow-hidden">
        <img
          src={
            product.image_url
              ? `${backendUrl}${product.image_url}`
              : "https://via.placeholder.com/300x400?text=No+Image"
          }
          className="card-img-top product-img"
          alt={product.name}
        />
      </div>

      <div className="card-body text-center">
        <h6 className="card-title text-truncate mb-1">{product.name}</h6>
        {product.description && (
          <p className="card-text text-muted small mb-2">
            {product.description.length > 60
              ? product.description.slice(0, 60) + "..."
              : product.description}
          </p>
        )}
        <p className="text-danger fw-bold mb-0">
          {formatCurrency(product.price)}
        </p>
      </div>
    </div>
  );
}
