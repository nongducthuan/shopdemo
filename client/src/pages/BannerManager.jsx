import { useState, useEffect } from "react";
import API from "../api.jsx";

export default function BannerManager() {
  const backendUrl = "http://localhost:5000";
  const [banners, setBanners] = useState([]);
  const [bannerForm, setBannerForm] = useState({
    image_url: "",
    title: "",
    subtitle: "",
  });
  const [editingBannerId, setEditingBannerId] = useState(null);

  const fetchBanners = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/admin/banners", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBanners(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleBannerChange = (e) =>
    setBannerForm({ ...bannerForm, [e.target.name]: e.target.value });

  const handleBannerSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (editingBannerId) {
        await API.put(`/admin/banners/${editingBannerId}`, bannerForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await API.post("/admin/banners", bannerForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setBannerForm({ image_url: "", title: "", subtitle: "" });
      setEditingBannerId(null);
      fetchBanners();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditBanner = (b) => {
    setBannerForm({
      image_url: b.image_url,
      title: b.title,
      subtitle: b.subtitle,
    });
    setEditingBannerId(b.id);
  };

  const handleDeleteBanner = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/admin/banners/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBanners();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Quản lý Banner</h2>
      <form onSubmit={handleBannerSubmit} className="row g-3 mb-4">
        <div className="col-md-3">
          <input
            type="text"
            name="image_url"
            placeholder="URL hình ảnh"
            value={bannerForm.image_url}
            onChange={handleBannerChange}
            className="form-control"
            required
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            name="title"
            placeholder="Tiêu đề"
            value={bannerForm.title}
            onChange={handleBannerChange}
            className="form-control"
            required
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            name="subtitle"
            placeholder="Phụ đề"
            value={bannerForm.subtitle}
            onChange={handleBannerChange}
            className="form-control"
            required
          />
        </div>
        <div className="col-md-3">
          <button type="submit" className="btn btn-primary w-100">
            {editingBannerId ? "Cập nhật" : "Thêm"}
          </button>
        </div>
      </form>

      <div className="row">
        {banners.map((b) => (
          <div key={b.id} className="col-md-3 col-6 mb-3">
            <div
              className="card shadow-sm h-100 d-flex flex-column"
              style={{ minHeight: "360px" }}
            >
              {/* Ảnh cố định kích thước để block đều nhau */}
              {b.image_url && (
                <img
                  src={`${backendUrl}${b.image_url}`}
                  className="card-img-top"
                  alt={b.title}
                  style={{
                    height: "180px",
                    objectFit: "cover",
                  }}
                />
              )}

              {/* Body giãn flex */}
              <div className="card-body d-flex flex-column">
                <h5 className="mb-1 text-truncate">{b.title}</h5>
                <p className="text-muted small flex-grow-1">{b.subtitle}</p>

                {/* Nút bấm luôn nằm cuối */}
                <div className="text-end mt-auto">
                  <button
                    onClick={() => handleEditBanner(b)}
                    className="btn btn-warning btn-sm me-2"
                  >
                    <i className="fas fa-pen"></i>
                  </button>
                  <button
                    onClick={() => handleDeleteBanner(b.id)}
                    className="btn btn-danger btn-sm"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
