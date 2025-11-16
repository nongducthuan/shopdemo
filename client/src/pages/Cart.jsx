import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext.jsx";
import { Link } from "react-router-dom";
import API from "../api.jsx";

export default function Cart() {
  const { cart, setCart, removeFromCart } = useContext(CartContext);
  const [options, setOptions] = useState({});
  const formatPrice = (n) => Number(n).toLocaleString("vi-VN") + " VND";
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce(
    (sum, p) => sum + Number(p.price) * (p.quantity || 1),
    0
  );

  useEffect(() => {
    const fetchOptions = async () => {
      const result = {};
      for (const item of cart) {
        try {
          const res = await API.get(`/products/${item.id}/options`);
          result[item.id] = res.data;
        } catch (err) {
          console.error("Lỗi tải options:", err);
        }
      }
      setOptions(result);
    };
    if (cart.length > 0) fetchOptions();
  }, [cart]);

  const handleSelectChange = (cartItemId, field, value) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.cartItemId !== cartItemId) return item;

        if (field === "color") {
          const selectedColor = options[item.id]?.colors?.find(
            (c) => c.name === value
          );
          return {
            ...item,
            color: value,
            color_id: selectedColor?.id,
            color_image: selectedColor?.image_url || item.color_image,
          };
        }

        if (field === "size") {
          const selectedSize = options[item.id]?.sizes?.find(
            (s) => s.size === value
          );
          return {
            ...item,
            size: value,
            size_id: selectedSize?.id,
          };
        }

        return item;
      })
    );
  };

  const handleQuantityChange = (cartItemId, newQty) => {
    setCart((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId
          ? {
            ...item,
            quantity: Math.max(1, Math.min(newQty, item.stock || 9999)),
          }
          : item
      )
    );
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "http://localhost:5000/public/placeholder.jpg";
    if (imagePath.startsWith("http")) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  return (
    <div className="w-10/12 mx-auto mt-6 mb-10">
      <h2 className="text-center text-2xl sm:text-3xl font-bold mb-8 text-gray-800">
        GIỎ HÀNG
      </h2>
      {cart.length === 0 ? (
        <div className="text-center text-muted mt-4">
          <p>Chưa có sản phẩm nào trong giỏ.</p>
          <Link to="/" className="btn btn-outline-primary mt-2">
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: CART ITEMS */}
          <div className="lg:col-span-2 flex flex-col border rounded-lg h-fit shadow-sm bg-white">
            {cart.map((p) => {
              const opt = options[p.id];
              const imageSrc = getImageUrl(p.color_image);

              return (
                <div
                  key={p.cartItemId}
                  className="flex gap-4 border-b border-black/30 bg-white"
                >
                  {/* IMAGE */}
                  <img
                    src={imageSrc}
                    alt={p.name}
                    className="w-[150px] h-[200px] object-cover"
                  />

                  {/* INFO */}
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-bold text-lg text-gray-800 pt-1">{p.name}</h3>
                      <button
                        onClick={() => removeFromCart(p.cartItemId)}
                        className="text-white-500 hover:text-red-600 pr-1"
                      >
                        ✕
                      </button>
                    </div>

                    {/* SIZE & COLOR */}
                    <div className="mt-2 text-sm text-gray-600">
                      <div className="flex gap-4 mb-2">
                        <div>
                          <label className="block mb-1">Kích cỡ:</label>
                          <select
                            value={p.size}
                            onChange={(e) =>
                              handleSelectChange(
                                p.cartItemId,
                                "size",
                                e.target.value
                              )
                            }
                            className="border rounded px-2 py-1"
                          >
                            {opt?.sizes?.map((s) => (
                              <option key={s.id} value={s.size}>
                                {s.size}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block mb-1">Màu sắc:</label>
                          <select
                            value={p.color}
                            onChange={(e) =>
                              handleSelectChange(
                                p.cartItemId,
                                "color",
                                e.target.value
                              )
                            }
                            className="border rounded px-2 py-1"
                          >
                            {opt?.colors?.map((c) => (
                              <option key={c.id} value={c.name}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* QUANTITY */}
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-gray-600 text-sm">Số lượng:</span>

                        <button
                          onClick={() =>
                            handleQuantityChange(
                              p.cartItemId,
                              p.quantity - 1
                            )
                          }
                          disabled={p.quantity <= 1}
                          className="px-3 py-1 border rounded"
                        >
                          -
                        </button>

                        <span className="px-4 py-1 border rounded bg-gray-100">
                          {p.quantity}
                        </span>

                        <button
                          onClick={() =>
                            handleQuantityChange(
                              p.cartItemId,
                              p.quantity + 1
                            )
                          }
                          className="px-3 py-1 border rounded"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* PRICE */}
                    <div className="text-lg font-semibold text-red-600 mt-4">
                      {formatPrice(p.price * p.quantity)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT: SUMMARY */}
          <div className="border p-5 rounded-lg h-fit shadow-sm bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">TỔNG ĐƠN HÀNG</h3>
              <p className="font-bold text-lg">
                {totalQuantity} SẢN PHẨM
              </p>
            </div>

            <div className="flex justify-between text-gray-700 mb-3">
              <span>Tổng cộng</span>
              <span>{formatPrice(total)}</span>
            </div>

            <div className="border-t pt-4 mt-4 font-bold text-xl text-red-600 flex justify-between">
              <span>TỔNG</span>
              <span>{formatPrice(total)}</span>
            </div>

            <Link
              to="/checkout"
              className="block bg-red-600 text-white text-center mt-6 py-3 rounded-md font-medium"
            >
              THANH TOÁN
            </Link>

            <Link
              to="/"
              className="block text-center mt-4 py-2 border rounded-md"
            >
              TIẾP TỤC MUA SẮM
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
