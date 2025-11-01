import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api.jsx";

export default function Admin() {
  const navigate = useNavigate();
  const backendUrl = "http://localhost:5000"; // URL backend
  const [banners, setBanners] = useState([]);
  const [bannerForm, setBannerForm] = useState({ image_url: "", title: "", subtitle: "" });
  const [editingBannerId, setEditingBannerId] = useState(null);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", price: 0, stock: 0, image_url: "", gender: "", category: "" });
  const [editingId, setEditingId] = useState(null);
  const [orders, setOrders] = useState([]);

  // ================= FETCH DATA =================
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/admin/products", { headers: { Authorization: `Bearer ${token}` } });
      setProducts(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/admin/orders", { headers: { Authorization: `Bearer ${token}` } });
      setOrders(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchBanners = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/admin/banners", { headers: { Authorization: `Bearer ${token}` } });
      setBanners(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchBanners();
  }, []);

  // ================= FORM PRODUCTS =================
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (editingId) {
        await API.put(`/admin/products/${editingId}`, form, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await API.post("/admin/products", form, { headers: { Authorization: `Bearer ${token}` } });
      }
      setForm({ name: "", description: "", price: 0, stock: 0, image_url: "", gender: "", category: "" });
      setEditingId(null);
      fetchProducts();
    } catch (err) { console.error(err); }
  };

  const handleEdit = (p) => {
    setForm({ ...p, stock: p.stock || 0, image_url: p.image_url || "" });
    setEditingId(p.id);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/admin/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchProducts();
    } catch (err) { console.error(err); }
  };

  // ================= FORM BANNERS =================
  const handleBannerChange = (e) => setBannerForm({ ...bannerForm, [e.target.name]: e.target.value });

  const handleBannerSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (editingBannerId) {
        await API.put(`/admin/banners/${editingBannerId}`, bannerForm, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await API.post("/admin/banners", bannerForm, { headers: { Authorization: `Bearer ${token}` } });
      }
      setBannerForm({ image_url: "", title: "", subtitle: "" });
      setEditingBannerId(null);
      fetchBanners();
    } catch (err) { console.error(err); }
  };

  const handleEditBanner = (b) => {
    setBannerForm({ image_url: b.image_url, title: b.title, subtitle: b.subtitle });
    setEditingBannerId(b.id);
  };

  const handleDeleteBanner = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/admin/banners/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchBanners();
    } catch (err) { console.error(err); }
  };

  // ================= ORDERS =================
  const handleChangeStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem("token");
      await API.put(`/admin/orders/${orderId}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      fetchOrders();
    } catch (err) { console.error(err); }
  };

  // ================= RENDER =================
  return (
    <div className="container mt-4">
      {/* Quản lý Banner */}
      <h2>Quản lý Banner (Carousel)</h2>
      <form onSubmit={handleBannerSubmit} className="row g-3 mb-4">
        <div className="col-md-3 col-12">
          <input type="text" name="image_url" placeholder="URL hình ảnh" value={bannerForm.image_url} onChange={handleBannerChange} className="form-control" required />
        </div>
        <div className="col-md-3 col-12">
          <input type="text" name="title" placeholder="Tiêu đề" value={bannerForm.title} onChange={handleBannerChange} className="form-control" required />
        </div>
        <div className="col-md-3 col-12">
          <input type="text" name="subtitle" placeholder="Phụ đề" value={bannerForm.subtitle} onChange={handleBannerChange} className="form-control" required />
        </div>
        <div className="col-md-3 col-12">
          <button type="submit" className="btn btn-primary w-100">{editingBannerId ? "Cập nhật" : "Thêm"}</button>
        </div>
      </form>

      <div className="row mb-4">
        {banners.map(b => (
          <div key={b.id} className="col-6 col-md-3 mb-3">
            <div className="card shadow-sm h-100">
              {b.image_url && <img src={`${backendUrl}${b.image_url}`} className="card-img-top" alt={b.title} style={{ height: "250px", objectFit: "cover" }} />}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{b.title}</h5>
                <p className="card-text text-muted">{b.subtitle}</p>
                <div className="mt-auto text-end">
                  <button onClick={() => handleEditBanner(b)} className="btn btn-warning btn-sm me-2"><i className="fas fa-pen"></i></button>
                  <button onClick={() => handleDeleteBanner(b.id)} className="btn btn-danger btn-sm"><i className="fas fa-trash"></i></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quản lý sản phẩm */}
      <h2>Quản lý sản phẩm</h2>
      <form onSubmit={handleSubmit} className="row g-3 mb-4 align-items-end">
        <div className="col-md-4 col-12">
          <input type="text" name="name" placeholder="Tên sản phẩm" value={form.name} onChange={handleChange} className="form-control" required />
        </div>
        <div className="col-md-4 col-12">
          <input type="text" name="description" placeholder="Mô tả sản phẩm" value={form.description} onChange={handleChange} className="form-control" />
        </div>
        <div className="col-md-4 col-12">
          <input type="number" name="stock" placeholder="Số lượng" value={form.stock} className="form-control" readOnly />
        </div>
        <div className="col-md-3 col-12">
          <input type="text" name="image_url" placeholder="URL hình ảnh" value={form.image_url} onChange={handleChange} className="form-control" />
        </div>
        <div className="col-md-3 col-12">
          <select name="gender" value={form.gender || ""} onChange={handleChange} className="form-select" required>
            <option value="">-- Chọn giới tính --</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>
        <div className="col-md-3 col-12">
          <select name="category" value={form.category || ""} onChange={handleChange} className="form-select" required>
            <option value="">-- Chọn danh mục --</option>
            <option value="Áo">Áo</option>
            <option value="Quần">Quần</option>
            <option value="Váy">Váy</option>
            <option value="Giày">Giày</option>
            <option value="Phụ kiện">Phụ kiện</option>
          </select>
        </div>
        <div className="col-md-3 col-12 text-end">
          <button type="submit" className="btn btn-primary w-100">{editingId ? "Cập nhật" : "Thêm"}</button>
        </div>
      </form>

      <div className="row">
        {products.map(p => (
          <div key={p.id} className="col-6 col-md-3 mb-3" style={{ cursor: "pointer" }} onClick={() => navigate(`/admin/products/${p.id}`)}>
            <div className="card shadow-sm h-100">
              {p.image_url && <img src={`${backendUrl}${p.image_url}`} className="card-img-top" style={{ height: "100%", objectFit: "cover" }} alt={p.name} />}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{p.name}</h5>
                <p className="card-text text-muted">{p.description}</p>
                <p><strong>Giá:</strong> {Number(p.price).toLocaleString("vi-VN")} đ</p>
                <p><strong>Số lượng:</strong> {p.total_stock}</p>
                <p><strong>Giới tính:</strong> {p.gender}</p>
                <p><strong>Danh mục:</strong> {p.category}</p>
                <div className="mt-auto text-end">
                  <button onClick={(e) => { e.stopPropagation(); handleEdit(p); }} className="btn btn-warning btn-sm me-2"><i className="fas fa-pen"></i></button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }} className="btn btn-danger btn-sm"><i className="fas fa-trash"></i></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quản lý đơn hàng */}
      <h2 className="mt-4">Quản lý đơn hàng</h2>
      {orders.length === 0 ? <p>Chưa có đơn hàng nào</p> : (
        <div className="row">
          {orders.map(order => (
            <div key={order.id} className="col-6 col-md-3 mb-3">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">Đơn #{order.id}</h5>
                  <p><strong>Người đặt:</strong> {order.user_name || order.user_id}</p>
                  <p><strong>Tổng tiền:</strong> {order.total_price}₫</p>
                  <p><strong>Địa chỉ:</strong> {order.address || "-"}</p>
                  <p><strong>Trạng thái:</strong> {order.status}</p>
                  <ul className="mb-2">
                    {order.items.map(item => <li key={item.id}>{item.product_name} x {item.quantity} = {item.price}₫</li>)}
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
