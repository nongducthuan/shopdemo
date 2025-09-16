import { useContext } from "react";
import { CartContext } from "../context/CartContext.jsx";

export default function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="card" style={{ width: "300px" }}>
      <div
        className="card-body"
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <img style={{ height: "300px" }}
          src={product.image_url || "https://via.placeholder.com/286x180?text=No+Image"}
          className="card-img-top"
          alt={product.name}
        />
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text">{product.description}</p>
        <p className="card-text">Giá: {product.price}₫</p>
        <p className="card-text">Số lượng: {product.stock}</p>
        <button className="btn btn-primary" style={{ justifyContent: "center" }} onClick={() => addToCart(product)}>
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
}
