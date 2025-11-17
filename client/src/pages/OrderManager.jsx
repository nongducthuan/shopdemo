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
    document.body.style.overflow = "visible";
    return () => {
      document.body.style.overflow = "hidden";
    };
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
      alert(err.response?.data?.message || err.message);
    }
  };

  const formatCurrency = (amount) =>
    Number(amount).toLocaleString("vi-VN") + " đ";

  const getStatusColor = (status) => {
    switch (status) {
      case "Đã hủy":
        return "#ffb3b3";
      case "Đang giao hàng":
        return "#b3e5fc";
      case "Đã giao hàng":
        return "#c8e6c9";
      case "Đã xác nhận":
        return "#fff0b3";
      default:
        return "#e0e0e0";
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 mt-4">
      <h2 className="text-center text-2xl sm:text-3xl font-bold mb-8 text-gray-800">
        QUẢN LÝ ĐƠN HÀNG
      </h2>

      {orders.length === 0 ? (
        <p>Chưa có đơn hàng nào</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-light text-center align-middle">
              <tr>
                <th>Đơn #</th>
                <th>Người đặt</th>
                <th>Địa chỉ</th>
                <th>Tổng tiền</th>
                <th>Sản phẩm</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody className="text-center ">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="fw-bold">{order.id}</td>
                  <td>{order.user_name}</td>
                  <td>{order.address}</td>
                  <td className="text-danger fw-semibold">
                    {formatCurrency(order.total_price)}
                  </td>
                  <td>
                    <ul className="mb-0 ps-0" style={{ lineHeight: "1.4", listStyle: "none" }}>
                      {order.items.map((item) => (
                        <li
                          key={item.id}
                          className="d-flex align-items-center mb-2"
                          style={{ gap: "0.5rem" }}
                        >
                          <div>
                            <strong>{item.product_name}</strong>
                            {item.size_name && <span> - Size: {item.size_name}</span>}
                            {item.color_name && (
                              <span>
                                {" "}
                                - Màu: {item.color_name}
                                {item.color_code && (
                                  <span
                                    style={{
                                      display: "inline-block",
                                      width: "12px",
                                      height: "12px",
                                      backgroundColor: item.color_code,
                                      border: "1px solid #ccc",
                                      marginLeft: "4px",
                                      marginRight: "4px",
                                    }}
                                  ></span>
                                )}
                              </span>
                            )}
                            - Số lượng: {item.quantity}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleChangeStatus(order.id, e.target.value)
                      }
                      className="form-select form-select-sm min-w-[140px]"
                      style={{
                        backgroundColor: getStatusColor(order.status),
                        color: "#333",
                      }}
                    >
                      <option value="Chờ xác nhận">Chờ xác nhận</option>
                      <option value="Đã xác nhận">Đã xác nhận</option>
                      <option value="Đang giao hàng">Đang giao hàng</option>
                      <option value="Đã giao hàng">Đã giao hàng</option>
                      <option value="Đã hủy">Đã hủy</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
