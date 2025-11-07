import { useState, useEffect } from "react";
import API from "../api.jsx";

export default function OrderManager() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/admin/orders", { headers: { Authorization: `Bearer ${token}` } });
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleChangeStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem("token");
      await API.put(`/admin/orders/${orderId}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Quản lý Đơn hàng</h2>
      {orders.length === 0 ? (
        <p>Chưa có đơn hàng nào</p>
      ) : (
        <div className="row">
          {orders.map((order) => (
            <div key={order.id} className="col-md-4 col-6 mb-3">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5>Đơn #{order.id}</h5>
                  <p><strong>Người đặt:</strong> {order.user_name}</p>
                  <p><strong>Tổng tiền:</strong> {order.total_price}₫</p>
                  <p><strong>Địa chỉ:</strong> {order.address}</p>
                  <p><strong>Trạng thái:</strong> {order.status}</p>
                  <ul>
                    {order.items.map((i) => (
                      <li key={i.id}>{i.product_name} × {i.quantity}</li>
                    ))}
                  </ul>
                  <select value={order.status} onChange={(e) => handleChangeStatus(order.id, e.target.value)} className="form-select form-select-sm">
                    <option value="Chờ xác nhận">Chờ xác nhận</option>
                    <option value="Đã xác nhận">Đã xác nhận</option>
                    <option value="Đang giao hàng">Đang giao hàng</option>
                    <option value="Đã giao hàng">Đã giao hàng</option>
                    <option value="Đã hủy">Đã hủy</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}