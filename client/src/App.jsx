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
import './assets/style/style.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/category/:id" element={<Category />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Order />} />
          <Route path="/search" element={<Search />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roleRequired="admin">
                <Admin />
              </ProtectedRoute>
            }
          />
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
