import { useState, useEffect } from "react";
import API from "../api.jsx";

export default function OrderManager() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      await API.put(
        `/admin/orders/${orderId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const formatCurrency = (amount) =>
    Number(amount).toLocaleString("vi-VN") + " đ";

  return (
    <div className="container mt-4">
      <h2>Quản lý Đơn hàng</h2>
      {orders.length === 0 ? (
        <p>Chưa có đơn hàng nào</p>
      ) : (
        <div className="row">
          {orders.map((order) => (
            <div key={order.id} className="col-md-4 col-12 mb-3">
              <div className="card shadow-sm h-100 border-0 rounded-3">
                {/* HEADER */}
                <div className="border-bottom px-3 py-2 d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-bold">Đơn #{order.id}</h5>
                  <span
                    className="badge px-3 py-2"
                    style={{
                      fontSize: "0.8rem",
                      backgroundColor:
                        order.status === "Đã hủy"
                          ? "#ffb3b3"
                          : order.status === "Đang giao hàng"
                          ? "#b3e5fc"
                          : order.status === "Đã giao hàng"
                          ? "#c8e6c9"
                          : order.status === "Đã xác nhận"
                          ? "#fff0b3"
                          : "#e0e0e0",
                      color: "#333",
                    }}
                  >
                    {order.status}
                  </span>
                </div>

                {/* BODY */}
                <div className="card-body d-flex flex-column">
                  <div className="mb-2 text-muted small">
                    <p className="mb-1">
                      <strong>Người đặt:</strong> {order.user_name}
                    </p>
                    <p className="mb-1">
                      <strong>Địa chỉ:</strong> {order.address}
                    </p>
                    <p className="mb-2 fw-semibold text-danger">
                      Tổng tiền:{" "}
                      {formatCurrency(order.total_price)}
                    </p>
                  </div>

                  {/* ITEMS */}
                  <ul className="small ps-3 mb-3" style={{ lineHeight: "1.4" }}>
                    {order.items.map((i) => (
                      <li key={i.id}>
                        {i.product_name} × {i.quantity}
                      </li>
                    ))}
                  </ul>

                  {/* SELECT STATUS (luôn ở cuối card) */}
                  <div className="mt-auto">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleChangeStatus(order.id, e.target.value)
                      }
                      className="form-select form-select-sm"
                    >
                      <option value="Chờ xác nhận">Chờ xác nhận</option>
                      <option value="Đã xác nhận">Đã xác nhận</option>
                      <option value="Đang giao hàng">Đang giao hàng</option>
                      <option value="Đã giao hàng">Đã giao hàng</option>
                      <option value="Đã hủy">Đã hủy</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
