import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../api.jsx";

export default function AdminProductDetail() {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const backendUrl = "http://localhost:5000"; // URL backend

  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    image_url: "",
    gender: "",
    category: "",
  });
  const [colors, setColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [newSize, setNewSize] = useState({ size: "", stock: 0 });
  const [mainImage, setMainImage] = useState("");

  // =================== FETCH PRODUCT ===================
  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await API.get(`/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data;
      setProduct(data);
      setForm({
        name: data.name,
        description: data.description || "",
        price: data.price,
        stock: data.stock || 0,
        image_url: data.image_url || "",
        gender: data.gender || "",
        category: data.category || "",
      });
      setColors(data.colors || []);

      if (data.colors?.length > 0) {
        setSelectedColor(data.colors[0]);
        setMainImage(data.colors[0].image_url ? `${backendUrl}${data.colors[0].image_url}` : `${backendUrl}${data.image_url}`);
      } else {
        setMainImage(data.image_url ? `${backendUrl}${data.image_url}` : "");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // =================== FORM CHÍNH ===================
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/admin/products/${id}`, { ...form }, { headers: { Authorization: `Bearer ${token}` } });
      alert("Cập nhật sản phẩm thành công!");
      fetchProduct();
    } catch (err) {
      console.error(err);
    }
  };

  // =================== COLORS ===================
  const handleAddColor = async () => {
    try {
      const res = await API.post(
        `/admin/products/${id}/colors`,
        { color_name: "Màu mới", color_code: "#ffffff", image_url: "" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newColor = { color_name: "Màu mới", color_code: "#ffffff", image_url: "", sizes: [], id: res.data.colorId };
      setColors([...colors, newColor]);
      setSelectedColor(newColor);
      setMainImage(form.image_url ? `${backendUrl}${form.image_url}` : "");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveColor = async (color) => {
    try {
      await API.put(`/admin/colors/${color.id}`, color, { headers: { Authorization: `Bearer ${token}` } });
      const updatedColors = colors.map(c => c.id === color.id ? color : c);
      setColors(updatedColors);
      setSelectedColor(color);
      setMainImage(color.image_url ? `${backendUrl}${color.image_url}` : `${backendUrl}${form.image_url}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteColor = async (colorId) => {
    try {
      await API.delete(`/admin/colors/${colorId}`, { headers: { Authorization: `Bearer ${token}` } });
      const updatedColors = colors.filter(c => c.id !== colorId);
      setColors(updatedColors);
      if (selectedColor?.id === colorId) {
        setSelectedColor(updatedColors[0] || null);
        setMainImage(updatedColors[0]?.image_url ? `${backendUrl}${updatedColors[0].image_url}` : `${backendUrl}${form.image_url}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // =================== SIZES ===================
  const handleAddSize = async () => {
    if (!newSize.size || !selectedColor) return;
    try {
      const res = await API.post(`/admin/colors/${selectedColor.id}/sizes`, newSize, { headers: { Authorization: `Bearer ${token}` } });
      const addedSize = { ...newSize, id: res.data.sizeId };
      const updatedColor = { ...selectedColor, sizes: [...(selectedColor.sizes || []), addedSize] };
      setSelectedColor(updatedColor);
      setColors(colors.map(c => c.id === updatedColor.id ? updatedColor : c));
      setNewSize({ size: "", stock: 0 });
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateSize = async (size) => {
    if (!selectedColor) return;
    try {
      await API.put(`/admin/sizes/${size.id}`, size, { headers: { Authorization: `Bearer ${token}` } });
      const updatedColor = {
        ...selectedColor,
        sizes: selectedColor.sizes.map(s => s.id === size.id ? size : s)
      };
      setSelectedColor(updatedColor);
      setColors(colors.map(c => c.id === updatedColor.id ? updatedColor : c));
      alert("Cập nhật size thành công!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSize = async (sizeId) => {
    if (!selectedColor) return;
    try {
      const updatedColor = { ...selectedColor, sizes: (selectedColor.sizes || []).filter(s => s.id !== sizeId) };
      await API.delete(`/admin/sizes/${sizeId}`, { headers: { Authorization: `Bearer ${token}` } });
      setSelectedColor(updatedColor);
      setColors(colors.map(c => c.id === updatedColor.id ? updatedColor : c));
    } catch (err) {
      console.error(err);
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div style={{ display: "flex", gap: "2rem", padding: "2rem" }}>
      {/* Cột trái: Ảnh + màu */}
      <div style={{ flex: 1 }}>
        <img
          src={mainImage || "https://via.placeholder.com/400x400?text=No+Image"}
          alt={product.name}
          style={{ width: "100%", maxWidth: "400px", objectFit: "cover", borderRadius: "8px" }}
        />
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
          {colors.map(color => (
            <div key={color.id} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                onClick={() => { 
                  setSelectedColor(color); 
                  setMainImage(color.image_url ? `${backendUrl}${color.image_url}` : `${backendUrl}${form.image_url}`); 
                }}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  border: selectedColor?.id === color.id ? "3px solid blue" : "1px solid gray",
                  backgroundColor: color.color_code,
                  cursor: "pointer",
                }}
              />
              <button
                onClick={() => handleDeleteColor(color.id)}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "red", marginTop: "0.2rem" }}
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          ))}
          <button
            onClick={handleAddColor}
            style={{ backgroundColor: "blue", color: "white", padding: "0.5rem", marginLeft: "0.5rem", borderRadius: "5px" }}
          >
            Thêm màu mới
          </button>
        </div>
      </div>

      {/* Cột phải: Form sản phẩm + quản lý màu + size */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1rem" }}>
        {selectedColor && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <h4>Thông tin màu: {selectedColor.color_name}</h4>
            <input placeholder="Tên màu" value={selectedColor.color_name} onChange={(e) => setSelectedColor({ ...selectedColor, color_name: e.target.value })} />
            <input placeholder="Code màu" value={selectedColor.color_code} onChange={(e) => setSelectedColor({ ...selectedColor, color_code: e.target.value })} />
            <input placeholder="URL hình ảnh" value={selectedColor.image_url} onChange={(e) => setSelectedColor({ ...selectedColor, image_url: e.target.value })} />
            <button onClick={() => handleSaveColor(selectedColor)} style={{ backgroundColor: "green", color: "white", padding: "0.5rem", borderRadius: "5px" }}>Cập nhật</button>

            <h4>Size của màu: {selectedColor.color_name}</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              {(selectedColor.sizes || []).map(size => (
                <div key={size.id} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <select
                    value={size.size}
                    onChange={(e) =>
                      setSelectedColor({
                        ...selectedColor,
                        sizes: selectedColor.sizes.map(s =>
                          s.id === size.id ? { ...s, size: e.target.value } : s
                        ),
                      })
                    }
                    style={{ width: "60px" }}
                  >
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>

                  <input
                    type="number"
                    value={size.stock}
                    onChange={(e) =>
                      setSelectedColor({
                        ...selectedColor,
                        sizes: selectedColor.sizes.map(s =>
                          s.id === size.id ? { ...s, stock: +e.target.value } : s
                        ),
                      })
                    }
                    style={{ width: "50px" }}
                  />
                  <button
                    onClick={() => handleUpdateSize(size)}
                    style={{ backgroundColor: "orange", color: "white", padding: "0 0.5rem", borderRadius: "5px" }}
                  >
                    Cập nhật
                  </button>
                  <button
                    onClick={() => handleDeleteSize(size.id)}
                    style={{ background: "transparent", border: "none", color: "red" }}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              ))}

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <select
                  value={newSize.size}
                  onChange={(e) => setNewSize({ ...newSize, size: e.target.value })}
                  style={{ width: "60px" }}
                >
                  <option value="">Chọn size</option>
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>

                <input
                  placeholder="Stock"
                  type="number"
                  value={newSize.stock}
                  onChange={(e) => setNewSize({ ...newSize, stock: +e.target.value })}
                  style={{ width: "50px" }}
                />
                <button
                  onClick={handleAddSize}
                  style={{ backgroundColor: "blue", color: "white", padding: "0.5rem", borderRadius: "5px" }}
                >
                  Thêm size
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
