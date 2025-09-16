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

  if (loading) return <p>Đang tải đơn hàng...</p>;
  if (error) return <p>{error}</p>;
  if (!orders.length) return <p>Chưa có đơn hàng nào.</p>;

  const formatCurrency = (amount) =>
    amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  return (
    <div className="container mt-4" style={{width: "400px"}}>
      <h2>Đơn hàng</h2>
      {orders.map((order) => (
        <div key={order.id} className="card mb-3">
          <div className="card-header">
            <strong>Đơn #{order.id}</strong> - {order.status} - {new Date(order.created_at).toLocaleString()}
          </div>
          <div className="card-body">
            <p><strong>Địa chỉ giao hàng:</strong> {order.address || "Chưa có"}</p>
            <p><strong>Tổng tiền:</strong> {formatCurrency(order.total_price)}</p>
            <ul className="list-group">
              {order.items.map((item) => (
                <li key={item.id} className="list-group-item d-flex justify-content-between">
                  {item.product_name} x {item.quantity}
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
