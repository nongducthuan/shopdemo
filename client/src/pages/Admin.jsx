import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api.jsx";

export default function Admin() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    banners: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const [productRes, orderRes, bannerRes] = await Promise.all([
          API.get("/admin/products", { headers: { Authorization: `Bearer ${token}` } }),
          API.get("/admin/orders", { headers: { Authorization: `Bearer ${token}` } }),
          API.get("/admin/banners", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setStats({
          products: productRes.data.length,
          orders: orderRes.data.length,
          banners: bannerRes.data.length,
        });
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu thống kê:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Dashboard</h2>
      <p className="text-center text-muted mb-5">
       Chọn khu vực bạn muốn quản lý
      </p>

      <div className="row g-4">
        {/* Quản lý Banner */}
        <div className="col-md-4">
          <div
            className="card shadow-sm text-center p-4 dashboard-card"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/admin/banner")}
          >
            <i className="fa-solid fa-image fa-3x mb-3 text-primary icon-management"></i>
            <h5 className="card-title">Quản lý Banner</h5>
            <p className="text-muted">Số banner hiện tại: {stats.banners}</p>
          </div>
        </div>

        {/* Quản lý Sản phẩm */}
        <div className="col-md-4">
          <div
            className="card shadow-sm text-center p-4 dashboard-card"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/admin/products")}
          >
            <i className="fa-solid fa-box-open fa-3x mb-3 text-success icon-management"></i>
            <h5 className="card-title">Quản lý Sản phẩm</h5>
            <p className="text-muted">Tổng sản phẩm: {stats.products}</p>
          </div>
        </div>

        {/* Quản lý Đơn hàng */}
        <div className="col-md-4">
          <div
            className="card shadow-sm text-center p-4 dashboard-card"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/admin/orders")}
          >
            <i className="fa-solid fa-receipt fa-3x mb-3 text-warning icon-management"></i>
            <h5 className="card-title">Quản lý Đơn hàng</h5>
            <p className="text-muted">Đơn hàng hiện tại: {stats.orders}</p>
          </div>
        </div>
      </div>
    </div>
  );
}