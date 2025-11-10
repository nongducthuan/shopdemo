import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../api.jsx";

export default function AdminProductDetail() {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const backendUrl = "http://localhost:5000";

  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    image_url: "",
  });
  const [colors, setColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [newSize, setNewSize] = useState({ size: "", stock: 0 });
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await API.get(`/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data;

      // prepend backendUrl cho ảnh
      if (data.image_url && !data.image_url.startsWith("http")) {
        data.image_url = `${backendUrl}${data.image_url}`;
      }
      if (data.colors?.length > 0) {
        data.colors = data.colors.map((c) => ({
          ...c,
          image_url: c.image_url && !c.image_url.startsWith("http") ? `${backendUrl}${c.image_url}` : c.image_url,
        }));
      }

      setProduct(data);
      setForm({
        name: data.name,
        description: data.description || "",
        price: data.price,
        stock: data.stock || 0,
        image_url: data.image_url || ""
      });

      setColors(data.colors || []);
      if (data.colors?.length > 0) {
        setSelectedColor(data.colors[0]);
        setMainImage(data.colors[0].image_url || data.image_url);
      } else {
        setMainImage(data.image_url || "");
      }
    } catch (err) {
      console.error(err);
    }
  };

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
      setMainImage(form.image_url || "");
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
      setMainImage(color.image_url || form.image_url);
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
        setMainImage(updatedColors[0]?.image_url || form.image_url);
      }
    } catch (err) {
      console.error(err);
    }
  };

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
      const updatedColor = { ...selectedColor, sizes: selectedColor.sizes.map(s => s.id === size.id ? size : s) };
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
    <div className="flex flex-col md:flex-row gap-8 p-8 justify-center items-start">
      {/* Cột trái: Ảnh + màu */}
      <div className="flex-1 flex flex-col items-center max-w-md">
        <div className="flex-1 max-w-md flex justify-center">
          <img
            src={mainImage || "https://via.placeholder.com/400x400?text=No+Image"}
            alt={product.name}
            className="w-auto max-w-xs h-auto object-cover rounded-lg"
          />
        </div>
        <div className="flex gap-3 mt-4 flex-wrap justify-center">
          {colors.map((color) => (
            <div key={color.id} className="flex flex-col items-center">
              <div
                onClick={() => {
                  setSelectedColor(color);
                  setMainImage(color.image_url || form.image_url);
                }}
                className={`w-10 h-10 rounded-full cursor-pointer border-2 transition-transform ${selectedColor?.id === color.id ? "border-black" : "border-gray-300"}`}
                style={{ backgroundColor: color.color_code }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
              <button
                onClick={() => handleDeleteColor(color.id)}
                className="text-red-500 mt-1"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          ))}

          <button
            onClick={handleAddColor}
            className="bg-blue-600 text-white px-3 py-1 rounded-md self-center"
          >
            Thêm màu mới
          </button>
        </div>
      </div>

      {/* Cột phải: Form sản phẩm + quản lý màu + size */}
      <div className="flex-1 flex flex-col gap-4 max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Tên sản phẩm"
            className="border rounded-md px-2 py-1 w-full"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Mô tả"
            className="border rounded-md px-2 py-1 w-full"
          />
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Giá"
            className="border rounded-md px-2 py-1 w-full"
          />
          <input
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            placeholder="Stock"
            className="border rounded-md px-2 py-1 w-full"
          />
          <input
            name="image_url"
            value={form.image_url}
            onChange={handleChange}
            placeholder="URL hình ảnh"
            className="border rounded-md px-2 py-1 w-full"
          />
          <button type="submit" className="bg-green-600 text-white px-3 py-2 rounded-md mt-2">
            Cập nhật sản phẩm
          </button>
        </form>

        {selectedColor && (
          <div className="flex flex-col gap-3 w-full">
            <h4 className="font-semibold">Thông tin màu: {selectedColor.color_name}</h4>
            <input
              placeholder="Tên màu"
              value={selectedColor.color_name}
              onChange={(e) => setSelectedColor({ ...selectedColor, color_name: e.target.value })}
              className="border rounded-md px-2 py-1 w-full"
            />
            <input
              placeholder="Code màu"
              value={selectedColor.color_code}
              onChange={(e) => setSelectedColor({ ...selectedColor, color_code: e.target.value })}
              className="border rounded-md px-2 py-1 w-full"
            />
            <input
              placeholder="URL hình ảnh"
              value={selectedColor.image_url}
              onChange={(e) => setSelectedColor({ ...selectedColor, image_url: e.target.value })}
              className="border rounded-md px-2 py-1 w-full"
            />
            <button
              onClick={() => handleSaveColor(selectedColor)}
              className="bg-green-600 text-white px-3 py-1 rounded-md mt-2"
            >
              Cập nhật màu
            </button>

            <h4 className="font-semibold mt-4">Size của màu: {selectedColor.color_name}</h4>
            <div className="flex flex-col gap-2 w-full">
              {(selectedColor.sizes || []).map((size) => (
                <div key={size.id} className="flex gap-2 items-center flex-wrap">
                  <select
                    value={size.size}
                    onChange={(e) =>
                      setSelectedColor({
                        ...selectedColor,
                        sizes: selectedColor.sizes.map((s) =>
                          s.id === size.id ? { ...s, size: e.target.value } : s
                        ),
                      })
                    }
                    className="border rounded-md px-2 py-1"
                  >
                    {["XS", "S", "M", "L", "XL", "XXL"].map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    value={size.stock}
                    onChange={(e) =>
                      setSelectedColor({
                        ...selectedColor,
                        sizes: selectedColor.sizes.map((s) =>
                          s.id === size.id ? { ...s, stock: +e.target.value } : s
                        ),
                      })
                    }
                    className="border rounded-md px-2 py-1 w-20"
                  />

                  <button
                    onClick={() => handleUpdateSize(size)}
                    className="bg-orange-500 text-white px-3 py-1 rounded-md"
                  >
                    Cập nhật
                  </button>
                  <button
                    onClick={() => handleDeleteSize(size.id)}
                    className="text-red-500 px-2 py-1"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              ))}

              <div className="flex gap-2 mt-2 flex-wrap items-center">
                <select
                  value={newSize.size}
                  onChange={(e) => setNewSize({ ...newSize, size: e.target.value })}
                  className="border rounded-md px-2 py-1"
                >
                  <option value="">Chọn size</option>
                  {["XS", "S", "M", "L", "XL", "XXL"].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                <input
                  placeholder="Stock"
                  type="number"
                  value={newSize.stock}
                  onChange={(e) => setNewSize({ ...newSize, stock: +e.target.value })}
                  className="border rounded-md px-2 py-1 w-20"
                />

                <button
                  onClick={handleAddSize}
                  className="bg-blue-600 text-white px-3 py-1 rounded-md"
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
