import { useEffect, useState } from "react";
import API from "../api.jsx";

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    image_url: "",
  });
  const [editingId, setEditingId] = useState(null);

  const [orders, setOrders] = useState([]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/admin/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

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
    fetchProducts();
    fetchOrders();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (editingId) {
        await API.put(`/admin/products/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await API.post("/admin/products", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setForm({ name: "", description: "", price: 0, stock: 0, image_url: "" });
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (p) => {
    setForm({
      name: p.name,
      description: p.description || "",
      price: p.price,
      stock: p.stock || 0,
      image_url: p.image_url || "",
    });
    setEditingId(p.id);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

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

  return (
    <div className="container mt-4">
      {/* Form quản lý sản phẩm */}
      <h2>Quản lý sản phẩm</h2>
      <form onSubmit={handleSubmit} className="row g-3 mb-4">
        <div className="col-md-3 col-12">
          <input
            type="text"
            name="name"
            placeholder="Tên sản phẩm"
            value={form.name}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="col-md-3 col-12">
          <input
            type="text"
            name="description"
            placeholder="Mô tả sản phẩm"
            value={form.description}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="col-md-2 col-12">
          <input
            type="number"
            name="price"
            placeholder="Giá"
            value={form.price}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="col-md-2 col-12">
          <input
            type="number"
            name="stock"
            placeholder="Số lượng"
            value={form.stock}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="col-md-2 col-12">
          <input
            type="text"
            name="image_url"
            placeholder="URL hình ảnh"
            value={form.image_url}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="col-12 text-end">
          <button type="submit" className="btn btn-primary">
            {editingId ? "Cập nhật" : "Thêm"}
          </button>
        </div>
      </form>

      {/* CARD LIST SẢN PHẨM */}
      <h2 className="mb-3">Danh sách sản phẩm</h2>
      <div className="row">
        {products.map((p) => (
          <div key={p.id} className="col-12 col-md-4 mb-3">
            <div className="card shadow-sm h-100">
              {p.image_url && (
                <img src={p.image_url} className="card-img-top" style={{height: "500px"}} alt={p.name} />
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{p.name}</h5>
                <p className="card-text text-muted">{p.description}</p>
                <p className="mb-1"><strong>Giá:</strong> {p.price}₫</p>
                <p><strong>Số lượng:</strong> {p.stock}</p>
                <div className="mt-auto text-end">
                  <button onClick={() => handleEdit(p)} className="btn btn-warning btn-sm me-2">
                    Sửa
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="btn btn-danger btn-sm">
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* QUẢN LÝ ĐƠN HÀNG */}
      <h2 className="mt-4">Quản lý đơn hàng</h2>
      {orders.length === 0 ? (
        <p>Chưa có đơn hàng nào</p>
      ) : (
        <div className="row">
          {orders.map((order) => (
            <div key={order.id} className="col-12 col-md-4 mb-3">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">Đơn #{order.id}</h5>
                  <p><strong>Người đặt:</strong> {order.user_name || order.user_id}</p>
                  <p><strong>Tổng tiền:</strong> {order.total_price}₫</p>
                  <p><strong>Địa chỉ:</strong> {order.address || "-"}</p>
                  <p><strong>Trạng thái:</strong> {order.status}</p>
                  <ul className="mb-2">
                    {order.items.map((item) => (
                      <li key={item.id}>
                        {item.product_name} x {item.quantity} = {item.price}₫
                      </li>
                    ))}
                  </ul>
                  <select
                    value={order.status}
                    onChange={(e) => handleChangeStatus(order.id, e.target.value)}
                    className="form-select form-select-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="shipped">Shipped</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
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
