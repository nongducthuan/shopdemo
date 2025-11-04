import { useEffect, useState } from "react";
import API from "../api.jsx";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Bạn cần đăng nhập để xem đơn hàng.");
        setLoading(false);
        return;
      }

      try {
        const res = await API.get("/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.error(err);
        setError("Không thể tải đơn hàng.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const formatCurrency = (amount) =>
    Number(amount).toLocaleString("vi-VN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }) + " đ";

  if (loading)
    return <p style={{ textAlign: "center", marginTop: "10px" }}>Đang tải đơn hàng...</p>;
  if (error)
    return <p style={{ textAlign: "center", marginTop: "10px" }}>{error}</p>;
  if (!orders.length)
    return <p style={{ textAlign: "center", marginTop: "10px" }}>Chưa có đơn hàng.</p>;

  return (
    <div className="order container mt-4">
      <h2 className="text-center">Đơn hàng của tôi</h2>
      {orders.map((order) => (
        <div key={order.id} className="card mb-3 shadow-sm">
          <div className="card-header bg-light">
            <strong>Đơn #{order.id}</strong> - {order.status} -{" "}
            {new Date(order.created_at).toLocaleString()}
          </div>
          <div className="card-body">
            <p><strong>Số điện thoại:</strong> {order.phone || "Chưa có"}</p>
            <p><strong>Địa chỉ giao hàng:</strong> {order.address || "Chưa có"}</p>
            <p><strong>Tổng tiền:</strong> {formatCurrency(order.total_price)}</p>

            <ul className="list-group">
              {order.items.map((item) => (
                <li
                  key={item.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div className="d-flex align-items-center">
                    {item.color_image && (
                      <img
                        src={item.color_image}
                        alt={item.color}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          marginRight: "1rem",
                          borderRadius: "8px",
                        }}
                      />
                    )}
                    <div>
                      <strong>{item.product_name}</strong>
                      {item.size && <span> - Size: {item.size}</span>}
                      {item.color && <span> - Màu: {item.color}</span>}
                      <div>Số lượng: {item.quantity}</div>
                    </div>
                  </div>
                  <span>{formatCurrency(Number(item.price) * item.quantity)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
