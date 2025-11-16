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

      <div className="card-body d-flex flex-column text-center">
        <h3 className="font-bold text-lg text-gray-800 pt-1">{product.name}</h3>

        {product.description && (
          <p className="card-text text-muted small mb-2 flex-grow">
            {product.description.length > 60
              ? product.description.slice(0, 60) + "..."
              : product.description}
          </p>
        )}

        <p className="text-danger fw-bold mt-auto mb-0">
          {formatCurrency(product.price)}
        </p>
      </div>
    </div>
  );
}
