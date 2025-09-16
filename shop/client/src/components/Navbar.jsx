import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
    setMenuOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
      setMenuOpen(false);
      setSearchTerm("");
    }
  };

  return (
    <nav className="custom-navbar">
      <div className="navbar-top">
        <Link className="navbar-brand" to="/">🛒 Clothing Shop</Link>
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
          <NavLink to="/" end className="nav-link" onClick={() => setMenuOpen(false)}>
            Trang chủ
          </NavLink>
        </li>
        <li>
          <NavLink to="/cart" className="nav-link" onClick={() => setMenuOpen(false)}>
            Giỏ hàng
          </NavLink>
        </li>
        <li>
          <NavLink to="/orders" className="nav-link" onClick={() => setMenuOpen(false)}>
            Đơn hàng
          </NavLink>
        </li>
        {!user ? (
          <li>
            <NavLink to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>
              Đăng nhập
            </NavLink>
          </li>
        ) : (
          <li>
            <button className="nav-link logout-btn" onClick={handleLogout}>
              Đăng xuất
            </button>
          </li>
        )}
        <li>
          <NavLink to="/register" className="nav-link" onClick={() => setMenuOpen(false)}>
            Đăng ký
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin" className="nav-link" onClick={() => setMenuOpen(false)}>
            Quản lý
          </NavLink>
        </li>
      </ul>

      <form className="search-form" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          className="search-input"
          placeholder="Tìm sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className="search-btn">🔍</button>
      </form>
    </nav>
  );
}
