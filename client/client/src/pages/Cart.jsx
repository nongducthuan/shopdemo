import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext.jsx";
import { Link } from "react-router-dom";
import API from "../api.jsx";

export default function Cart() {
  const { cart, setCart, removeFromCart } = useContext(CartContext);
  const [options, setOptions] = useState({});

  const formatPrice = (n) => Number(n).toLocaleString("vi-VN") + " đ";

  const total = cart.reduce(
    (sum, p) => sum + Number(p.price) * (p.quantity || 1),
    0
  );

  // 🔹 Khi cart thay đổi, tải options (size + màu)
  useEffect(() => {
    const fetchOptions = async () => {
      const result = {};
      for (const item of cart) {
        try {
          const res = await API.get(`/products/${item.id}/options`);
          result[item.id] = res.data; // { sizes, colors }
        } catch (err) {
          console.error("Lỗi tải options:", err);
        }
      }
      setOptions(result);
    };

    if (cart.length > 0) fetchOptions();
  }, [cart]);

  // 🔹 Cập nhật size hoặc màu
  const handleSelectChange = (id, field, value) => {
    setCart((prev) => {
      const updated = prev.map((item) => {
        if (item.id !== id) return item;

        if (field === "color") {
          const selectedColor = options[id]?.colors?.find((c) => c.name === value);
          return {
            ...item,
            color: value,
            color_id: selectedColor?.id,
            // Cập nhật color_image từ data API nếu có
            color_image: selectedColor?.image_url || item.color_image,
          };
        }

        if (field === "size") {
          const selectedSize = options[id]?.sizes?.find((s) => s.size === value);
          return {
            ...item,
            size: value,
            size_id: selectedSize?.id,
          };
        }

        return item;
      });

      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  };

  // 🔹 Cập nhật số lượng
  const handleQuantityChange = (id, value) => {
    const qty = Math.max(1, Number(value) || 1);
    const updated = cart.map((item) =>
      item.id === id ? { ...item, quantity: qty } : item
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // 💡 HÀM XỬ LÝ ĐƯỜNG DẪN ẢNH ĐƯỢC CẬP NHẬT Ở ĐÂY
  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      // Dùng placeholder nếu không có đường dẫn ảnh
      return "http://localhost:5000/public/placeholder.jpg";
    }
    if (imagePath.startsWith("http")) {
      // Nếu đường dẫn đã là URL đầy đủ, dùng luôn
      return imagePath;
    }
    // Nếu đường dẫn là tương đối (ví dụ: /images/abc.jpg), thêm domain server vào
    return `http://localhost:5000${imagePath}`;
  };

  return (
    <div className="cart container mt-5 mb-5">
      <h2 className="text-center fw-bold mb-4">🛒 Giỏ hàng</h2>

      {cart.length === 0 ? (
        <div className="text-center text-muted mt-4">
          <i className="fas fa-shopping-basket fa-2x mb-3"></i>
          <p>Chưa có sản phẩm nào trong giỏ.</p>
          <Link to="/" className="btn btn-outline-primary mt-2">
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <>
          <ul className="list-group shadow-sm rounded-3 mb-4">
            {cart.map((p) => {
              const opt = options[p.id];
              // 💡 GỌI HÀM XỬ LÝ ĐƯỜNG DẪN ẢNH
              const imageSrc = getImageUrl(p.color_image);

              return (
                <li
                  key={`${p.id}-${p.color_id}-${p.size_id}`}
                  className="list-group-item d-flex flex-wrap justify-content-between align-items-center p-3 border-0 border-bottom"
                >
                  {/* Ảnh sản phẩm */}
                  <div className="d-flex align-items-center flex-wrap">
                    <img
                      // SỬ DỤNG HÀM MỚI
                      src={imageSrc}
                      alt={p.color || "Sản phẩm"}
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                        borderRadius: "10px",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                        marginRight: "1rem",
                      }}
                      // 💡 Thêm onError để xử lý nếu ảnh không tải được
                      onError={(e) => {
                        e.target.onerror = null; // Ngăn chặn loop vô hạn
                        e.target.src = "http://localhost:5000/public/placeholder.jpg"; // Thử tải placeholder
                      }}
                    />

                    <div>
                      <strong className="d-block">{p.name}</strong>

                      {/* Chọn size và màu */}
                      <div className="d-flex flex-wrap align-items-center mt-2">
                        <div className="me-3">
                          <label className="me-1 text-secondary small">Size:</label>
                          <select
                            className="form-select form-select-sm"
                            style={{ width: "90px" }}
                            value={p.size}
                            onChange={(e) =>
                              handleSelectChange(p.id, "size", e.target.value)
                            }
                          >
                            {opt?.sizes?.map((s, index) => (
                              <option key={s.size_id || index} value={s.size}>
                                {s.size}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="me-1 text-secondary small">Màu:</label>
                          <select
                            className="form-select form-select-sm"
                            style={{ width: "110px" }}
                            value={p.color}
                            onChange={(e) =>
                              handleSelectChange(p.id, "color", e.target.value)
                            }
                          >
                            {opt?.colors?.map((c) => (
                              <option key={c.id} value={c.name}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Số lượng */}
                      <div className="mt-2">
                        <label className="me-2 text-secondary small">Số lượng:</label>
                        <input
                          type="number"
                          min="1"
                          value={p.quantity}
                          className="form-control form-control-sm d-inline-block"
                          style={{ width: "80px" }}
                          onChange={(e) =>
                            handleQuantityChange(p.id, e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Giá và nút xóa */}
                  <div className="text-end mt-3 mt-md-0">
                    <span className="d-block fw-semibold text-success mb-2">
                      {formatPrice(p.price * p.quantity)}
                    </span>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => removeFromCart(p.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Tổng cộng */}
          <div className="text-end mt-4">
            <h4 className="fw-bold">
              Tổng cộng:{" "}
              <span className="text-success">{formatPrice(total)}</span>
            </h4>
            <Link to="/checkout" className="btn btn-success mt-3 px-4 py-2">
              Tiến hành thanh toán
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
