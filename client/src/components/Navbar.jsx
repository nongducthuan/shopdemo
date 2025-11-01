import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
    setMenuOpen(false);
  };

  // 🔹 Tổng số lượng sản phẩm trong giỏ
  const totalQuantity = cart.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  return (
    <div className="container-fluid">
      <nav className="custom-navbar">
        <div className="navbar-top">
          <div className="navbar-brand" to="/">
            🛒 Clothing Shop
          </div>
          <button
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>

        <ul className={`navbar-menu ${menuOpen ? "show" : ""}`}>
          <li>
            <NavLink
              to="/"
              end
              className="nav-link"
              onClick={() => setMenuOpen(false)}
            >
              Trang chủ
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/orders"
              className="nav-link"
              onClick={() => setMenuOpen(false)}
            >
              Đơn hàng
            </NavLink>
          </li>

          {!user ? (
            <>
              <li>
                <NavLink
                  to="/login"
                  className="nav-link"
                  onClick={() => setMenuOpen(false)}
                >
                  Đăng nhập
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/register"
                  className="nav-link"
                  onClick={() => setMenuOpen(false)}
                >
                  Đăng ký
                </NavLink>
              </li>
            </>
          ) : (
            <>
              {user?.role === "admin" && (
                <li>
                  <NavLink
                    to="/admin"
                    className="nav-link"
                    onClick={() => setMenuOpen(false)}
                  >
                    Quản lý
                  </NavLink>
                </li>
              )}

              <li>
                <button className="nav-link logout-btn" onClick={handleLogout}>
                  Đăng xuất
                </button>
              </li>
            </>
          )}
        </ul>

        {/* 🔍 Icon tìm kiếm và 🛍 Giỏ hàng kiểu minimal */}
        <div className="nav-icons">
          <div
            className="nav-icon search-icon"
            onClick={() => navigate("/search")}
            title="Tìm kiếm"
          >
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>

          <div
            className="nav-icon cart-icon"
            onClick={() => navigate("/cart")}
            title="Giỏ hàng"
          >
            <i className="fa-solid fa-bag-shopping"></i>
            {totalQuantity > 0 && (
              <span className="cart-badge-dot">{totalQuantity}</span>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
