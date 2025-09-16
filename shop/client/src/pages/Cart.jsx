import { useContext } from "react";
import { CartContext } from "../context/CartContext.jsx";
import { Link } from "react-router-dom";

export default function Cart() {
  const { cart, updateQuantity, removeFromCart } = useContext(CartContext);
  
  const total = cart.reduce(
    (sum, p) => sum + Number(p.price) * (p.quantity || 1),
    0
  );

  const handleIncrease = (id) => {
    updateQuantity(id, 1); 
  };

  const handleDecrease = (id) => {
    updateQuantity(id, -1); 
  };

  return (
    <div className="container mt-3" style={{maxWidth: "400px"}}>
      <h2>Giỏ hàng</h2>
      {cart.length === 0 ? (
        <p>Chưa có sản phẩm trong giỏ</p>
      ) : (
        <>
          <ul className="list-group mb-3">
            {cart.map((p) => (
              <li
                key={p.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{p.name}</strong>
                  <div className="d-flex align-items-center mt-1">
                    <button
                      className="btn btn-sm btn-outline-secondary me-1"
                      onClick={() => handleDecrease(p.id)}
                      disabled={p.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="mx-1">{p.quantity}</span>
                    <button
                      className="btn btn-sm btn-outline-secondary ms-1"
                      onClick={() => handleIncrease(p.id)}
                    >
                      +
                    </button>
                    <button
                      className="btn btn-sm btn-danger ms-3"
                      onClick={() => removeFromCart(p.id)}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
                <span>{Number(p.price) * p.quantity}₫</span>
              </li>
            ))}
          </ul>
          <h4>Tổng: {total}₫</h4>
          <Link to="/checkout" className="btn btn-success mt-2">
            Thanh toán
          </Link>
        </>
      )}
    </div>
  );
}
