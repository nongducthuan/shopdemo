import { useContext } from "react";
import { CartContext } from "../context/CartContext.jsx";
import { Link } from "react-router-dom";
import "../pages/Pages.css";

export default function Cart() {
  const { cart, updateQuantity, removeFromCart } = useContext(CartContext);
  const formatPrice = (amount) =>
    Number(amount).toLocaleString("vi-VN", { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + " đ";
  const total = cart.reduce(
    (sum, p) => sum + Number(p.price) * (p.quantity || 1),
    0,
  );

  const handleIncrease = (id) => {
    updateQuantity(id, 1);
  };

  const handleDecrease = (id) => {
    updateQuantity(id, -1);
  };

  return (
    <div className="cart container mt-4">
      <h2 className="text-center">Giỏ hàng</h2>
      {cart.length === 0 ? (
        <p className="text-center">Chưa có sản phẩm trong giỏ</p>
      ) : (
        <>
          <ul className="list-group mb-3">
            {cart.map((p) => (
              <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  {p.color_image && (
                    <img
                      src={p.color_image}
                      alt={p.color}
                      style={{ width: "50px", height: "50px", objectFit: "cover", marginRight: "1rem" }}
                    />
                  )}
                  <div>
                    <strong>{p.name}</strong>
                    {p.size && <span> - Size: {p.size}</span>}
                    {p.color && <span> - Màu: {p.color}</span>}
                    <div className="d-flex align-items-center mt-1">
                      <input
                        type="number"
                        min="1"
                        value={p.quantity}
                        className="form-control form-control-sm"
                        style={{ width: "60px" }}
                        onChange={(e) => updateQuantity(p.id, Number(e.target.value) - p.quantity)}
                      />
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <span className="me-2">{formatPrice(Number(p.price) * p.quantity)}</span>
                  <button className="btn btn-sm btn-danger" onClick={() => removeFromCart(p.id)}>
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <h4>Tổng: {formatPrice(total)}</h4>
          <Link to="/checkout" className="btn btn-success mt-2">
            Thanh toán
          </Link>
        </>
      )}
    </div>
  );
}
