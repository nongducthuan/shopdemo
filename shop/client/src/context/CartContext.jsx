import { createContext, useState } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Thêm sản phẩm vào giỏ
  const addToCart = (product) => {
    // Nếu sản phẩm đã có trong giỏ, tăng quantity
    const existing = cart.find((p) => p.id === product.id);
    if (existing) {
      setCart(
        cart.map((p) =>
          p.id === product.id
            ? { ...p, quantity: (p.quantity || 1) + 1 }
            : p
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Cập nhật số lượng (delta = +1 hoặc -1)
  const updateQuantity = (id, delta) => {
    setCart(
      cart
        .map((p) =>
          p.id === id
            ? { ...p, quantity: Math.max((p.quantity || 1) + delta, 1) }
            : p
        )
        .filter((p) => p.quantity > 0) // loại bỏ nếu quantity = 0
    );
  };

  // Xóa sản phẩm khỏi giỏ
  const removeFromCart = (id) => {
    setCart(cart.filter((p) => p.id !== id));
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQuantity, removeFromCart, setCart }}
    >
      {children}
    </CartContext.Provider>
  );
}
