import { createContext, useState } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Hàm kiểm tra sự trùng khớp (composite key: id + size_id + color_id)
  const isMatch = (p1, p2) =>
    p1.id === p2.id && p1.size_id === p2.size_id && p1.color_id === p2.color_id;

  // Thêm sản phẩm vào giỏ
  const addToCart = (product) => {
    // Tìm xem sản phẩm đã có trong cart chưa
    const existing = cart.find((p) => isMatch(p, product));

    if (existing) {
      // Nếu đã tồn tại, tăng số lượng
      setCart(
        cart.map((p) =>
          isMatch(p, product)
            ? { ...p, quantity: (p.quantity || 1) + 1 }
            : p
        )
      );
    } else {
      // Nếu chưa tồn tại, thêm mới và lưu image_url từ product_colors
      setCart([
        ...cart,
        {
          ...product,
          quantity: 1,
          image_url: product.image_url || "/public/placeholder.jpg",
        },
      ]);
    }
  };

  // Cập nhật số lượng sản phẩm
  const updateQuantity = (productKey, delta) => {
    setCart(
      cart
        .map((p) =>
          isMatch(p, productKey)
            ? { ...p, quantity: Math.max((p.quantity || 1) + delta, 1) }
            : p
        )
        .filter((p) => p.quantity > 0)
    );
  };

  // Xóa sản phẩm khỏi giỏ
  const removeFromCart = (productKey) => {
    setCart(cart.filter((p) => !isMatch(p, productKey)));
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQuantity, removeFromCart, setCart }}
    >
      {children}
    </CartContext.Provider>
  );
}
