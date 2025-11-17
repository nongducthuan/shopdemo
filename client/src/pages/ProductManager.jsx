import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api.jsx";

export default function ProductManager() {
  const navigate = useNavigate();
  const backendUrl = "http://localhost:5000";
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", price: 0, stock: 0, image_url: "", gender: "", category: "" });
  const [editingId, setEditingId] = useState(null);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/admin/products", { headers: { Authorization: `Bearer ${token}` } });
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
    } catch (err) {
      console.error(err);
    }
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
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-gray-800">
        QUẢN LÝ SẢN PHẨM
      </h2>

      <form onSubmit={handleSubmit} className="row g-3 mb-4">
        <div className="col-md-4">
          <input type="text" name="name" placeholder="Tên sản phẩm" value={form.name} onChange={handleChange} className="form-control" required />
        </div>
        <div className="col-md-4">
          <input type="text" name="description" placeholder="Mô tả" value={form.description} onChange={handleChange} className="form-control" />
        </div>
        <div className="col-md-4">
          <input type="text" name="image_url" placeholder="URL hình ảnh" value={form.image_url} onChange={handleChange} className="form-control" />
        </div>
        <div className="col-md-3">
          <select name="gender" value={form.gender} onChange={handleChange} className="form-select" required>
            <option value="">-- Chọn giới tính --</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>
        <div className="col-md-3">
          <select name="category" value={form.category} onChange={handleChange} className="form-select" required>
            <option value="">-- Chọn danh mục --</option>
            <option value="Áo">Áo</option>
            <option value="Quần">Quần</option>
          </select>
        </div>
        <div className="col-md-3">
          <button type="submit" className="btn btn-primary w-100">{editingId ? "Cập nhật" : "Thêm"}</button>
        </div>
      </form>

      <div className="row">
        {products.map((p) => (
          <div key={p.id} className="col-md-3 col-6 mb-3" onClick={() => navigate(`/admin/products/${p.id}`)}>
            <div className="card shadow-sm h-100">
              {p.image_url && <img src={`${backendUrl}${p.image_url}`} className="card-img-top" alt={p.name} />}
              <div className="card-body d-flex flex-column">
                <h5>{p.name}</h5>
                <p className="text-muted">{p.description}</p>
                <p><strong>Giá:</strong> {Number(p.price).toLocaleString("vi-VN")}đ</p>
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
    </div>
  );
}