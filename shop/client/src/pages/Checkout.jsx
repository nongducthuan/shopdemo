import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext.jsx";
import API from "../api.jsx";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { cart, setCart } = useContext(CartContext);
  const [message, setMessage] = useState("");
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  const total = cart.reduce((sum, p) => sum + Number(p.price) * (p.quantity ?? 1), 0);

  const formatCurrency = (amount) =>
    amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user) {
      setMessage("Bạn cần đăng nhập trước khi thanh toán!");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    if (!address.trim()) {
      setMessage("Vui lòng nhập địa chỉ giao hàng!");
      return;
    }

    try {
      const itemsPayload = cart.map((p) => ({
        product_id: p.id,              
        quantity: p.quantity ?? 1,
        price: Number(p.price),
      }));

      const payload = {
        user_id: user.id,               
        items: itemsPayload,
        address,
        total_price: total,
      };

      console.log("Checkout payload:", payload);

      const res = await API.post("/orders", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("✅ Đặt hàng thành công!");
      setCart([]);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      console.error("Checkout error:", err);
      if (err.response?.status === 401) {
        setMessage("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setMessage("❌ Thanh toán thất bại! Vui lòng thử lại.");
      }
    }
  };

  return (
    <div className="container mt-4" style={{maxWidth: "400px"}}>
      <h2>Thanh toán</h2>

      {cart.length === 0 ? (
        <p>Giỏ hàng trống</p>
      ) : (
        <>
          <ul className="list-group mb-3">
            {cart.map((p, i) => (
              <li key={i} className="list-group-item d-flex justify-content-between">
                {p.name} x {p.quantity ?? 1}
                <span>{formatCurrency(Number(p.price) * (p.quantity ?? 1))}</span>
              </li>
            ))}
          </ul>

          <div className="mb-3">
            <label htmlFor="address" className="form-label">Địa chỉ giao hàng</label>
            <input
              type="text"
              id="address"
              className="form-control"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Nhập địa chỉ của bạn"
            />
          </div>

          <h4 className="mb-3">Tổng tiền: {formatCurrency(total)}</h4>

          <button className="btn btn-success" onClick={handleCheckout}>
            Đặt hàng
          </button>
        </>
      )}

      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
}
