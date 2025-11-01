import { createContext, useState } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    const existing = cart.find(
      (p) => p.id === product.id && p.size_id === product.size_id && p.color_id === product.color_id
    );

    if (existing) {
      setCart(
        cart.map((p) =>
          p.id === product.id &&
            p.size_id === product.size_id &&
            p.color_id === product.color_id
            ? { ...p, quantity: (p.quantity || 1) + 1 }
            : p
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, delta) => {
    setCart(
      cart
        .map((p) =>
          p.id === id
            ? { ...p, quantity: Math.max((p.quantity || 1) + delta, 1) }
            : p,
        )
        .filter((p) => p.quantity > 0),
    );
  };

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
