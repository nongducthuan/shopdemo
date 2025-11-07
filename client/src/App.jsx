
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import Admin from "./pages/Admin";
import AuthProvider from "./context/AuthContext";
import Order from "./pages/Order";
import Search from "./pages/Search";
import ProductDetail from "./pages/ProductDetail";
import AdminProductDetail from "./pages/AdminProductDetail";
import Category from "./pages/Category";
import BannerManager from "./pages/BannerManager";
import ProductManager from "./pages/ProductManager";
import OrderManager from "./pages/OrderManager"; 
import "./assets/style/style.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Trang người dùng */}
          <Route path="/" element={<Home />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/category/:id" element={<Category />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Order />} />
          <Route path="/search" element={<Search />} />

          {/* Trang admin chính */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roleRequired="admin">
                <Admin />
              </ProtectedRoute>
            }
          />

          {/* Quản lý Banner */}
          <Route
            path="/admin/banner"
            element={
              <ProtectedRoute roleRequired="admin">
                <BannerManager />
              </ProtectedRoute>
            }
          />

          {/* Quản lý Sản phẩm */}
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute roleRequired="admin">
                <ProductManager />
              </ProtectedRoute>
            }
          />

          {/* Quản lý Đơn hàng */}
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute roleRequired="admin">
                <OrderManager />
              </ProtectedRoute>
            }
          />

          {/* Trang chi tiết sản phẩm trong admin */}
          <Route
            path="/admin/products/:id"
            element={
              <ProtectedRoute roleRequired="admin">
                <AdminProductDetail />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
