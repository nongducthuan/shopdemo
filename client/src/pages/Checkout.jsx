import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext.jsx";
import API from "../api.jsx";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { cart, setCart } = useContext(CartContext);
  const [message, setMessage] = useState("");
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, p) => sum + Number(p.price) * (p.quantity ?? 1),
    0
  );

  const formatCurrency = (amount) =>
    Number(amount).toLocaleString("vi-VN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }) + " đ";

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

    if (!cart || cart.length === 0) {
      setMessage("Giỏ hàng trống!");
      return;
    }

    try {
      const itemsPayload = cart.map((p) => {
        if (!p.size_id) throw new Error(`Sản phẩm "${p.name}" chưa chọn size`);
        return {
          product_id: p.id,
          color_id: p.color_id ?? null,
          size_id: p.size_id ?? null,
          quantity: p.quantity ?? 1,
          price: Number(p.price),
        };
      });

      const totalPrice = itemsPayload.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const payload = {
        user_id: user.id,
        address,
        total_price: totalPrice,
        items: itemsPayload,
      };

      const res = await API.post("/orders", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("✅ Đặt hàng thành công!");
      setCart([]);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      console.error("Checkout error:", err);
      if (err.message.includes("chưa chọn size")) {
        setMessage(err.message);
      } else if (err.response?.status === 401) {
        setMessage("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setTimeout(() => navigate("/login"), 1500);
      } else if (err.response?.data?.message) {
        setMessage(`❌ ${err.response.data.message}`);
      } else {
        setMessage("❌ Thanh toán thất bại! Vui lòng thử lại.");
      }
    }
  };

  return (
    <div className="checkout container mt-4">
      <h2 className="text-center">Thanh toán</h2>

      {cart.length === 0 ? (
        <p className="text-center">Giỏ hàng trống</p>
      ) : (
        <>
          <ul className="list-group mb-3">
            {cart.map((p) => (
              <li
                key={p.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div className="d-flex align-items-center">
                  <img
                    src={
                      p.color_image
                        ? p.color_image.startsWith("http")
                          ? p.color_image
                          : `http://localhost:5000${p.color_image}`
                        : "http://localhost:5000/public/placeholder.jpg"
                    }
                    alt={p.color || "Sản phẩm"}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                      marginRight: "1rem",
                      borderRadius: "8px",
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "http://localhost:5000/public/placeholder.jpg";
                    }}
                  />
                  <div>
                    <strong>{p.name}</strong>
                    {p.size && <span> - Size: {p.size}</span>}
                    {p.color && <span> - Màu: {p.color}</span>}
                    <div>Số lượng: {p.quantity ?? 1}</div>
                  </div>
                </div>
                <span>
                  {formatCurrency(Number(p.price) * (p.quantity ?? 1))}
                </span>
              </li>
            ))}
          </ul>

          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              Địa chỉ giao hàng
            </label>
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

          <div className="mb-3">
            <button className="btn btn-success" onClick={handleCheckout}>
              Đặt hàng
            </button>
          </div>
        </>
      )}

      {message && (
        <div className="alert alert-info mt-3 text-center">{message}</div>
      )}
    </div>
  );
}
