// Navbar.jsx
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [categoryImages, setCategoryImages] = useState({}); // { categoryId: image_url }
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  // Lấy ảnh đại diện sản phẩm cho từng category con
  useEffect(() => {
    const fetchCategoriesWithImages = async () => {
      try {
        const parentIds = [1, 2, 3];
        const allCategories = [];

        // Lấy toàn bộ danh mục con
        for (const pid of parentIds) {
          const res = await fetch(
            `http://localhost:5000/categories?parent_id=${pid}`
          );
          const cats = await res.json();
          allCategories.push(...cats);
        }

        // Lấy ảnh đại diện cho từng category con
        const entries = await Promise.all(
          allCategories.map(async (cat) => {
            const res = await fetch(
              `http://localhost:5000/products/representative?category_id=${cat.id}`
            );
            const data = await res.json();
            return [cat.id, data?.image_url || null];
          })
        );

        setCategoryImages(Object.fromEntries(entries));
      } catch (err) {
        console.error("Lỗi fetch category/ảnh:", err);
      }
    };

    fetchCategoriesWithImages();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
    setMenuOpen(false);
  };

  const isHome = location.pathname === "/";
  const totalQuantity = cart.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  return (
    <div className="container-fluid">
      <nav className={`custom-navbar ${isHome ? "transparent" : "white-bg"}`}>
        {/* 🔹 Logo + nút menu mobile */}
        <div className="navbar-top">
          <div className="navbar-brand" onClick={() => navigate("/")}>
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

        {/* 🔹 Menu chính */}
        <ul className={`navbar-menu ${menuOpen ? "show" : ""}`}>
          {/* Nam */}
          <li className="dropdown">
            <span>Nam</span>
            <div className="dropdown-content">
              <NavLink to="/category/4" onClick={() => setMenuOpen(false)}>
                {categoryImages[4] && (
                  <img
                    src={`http://localhost:5000${categoryImages[4]}`}
                    className="dropdown-img"
                    alt="Áo nam"
                  />
                )}
                Áo
              </NavLink>
              <NavLink to="/category/5" onClick={() => setMenuOpen(false)}>
                {categoryImages[5] && (
                  <img
                    src={`http://localhost:5000${categoryImages[5]}`}
                    className="dropdown-img"
                    alt="Quần nam"
                  />
                )}
                Quần
              </NavLink>
            </div>
          </li>

          {/* Nữ */}
          <li className="dropdown">
            <span>Nữ</span>
            <div className="dropdown-content">
              <NavLink to="/category/6" onClick={() => setMenuOpen(false)}>
                {categoryImages[6] && (
                  <img
                    src={`http://localhost:5000${categoryImages[6]}`}
                    className="dropdown-img"
                    alt="Áo nữ"
                  />
                )}
                Áo
              </NavLink>
              <NavLink to="/category/7" onClick={() => setMenuOpen(false)}>
                {categoryImages[7] && (
                  <img
                    src={`http://localhost:5000${categoryImages[7]}`}
                    className="dropdown-img"
                    alt="Quần nữ"
                  />
                )}
                Quần
              </NavLink>
            </div>
          </li>

          {/* Unisex */}
          <li className="dropdown">
            <span>Unisex</span>
            <div className="dropdown-content">
              <NavLink to="/category/8" onClick={() => setMenuOpen(false)}>
                {categoryImages[8] && (
                  <img
                    src={`http://localhost:5000${categoryImages[8]}`}
                    className="dropdown-img"
                    alt="Áo unisex"
                  />
                )}
                Áo
              </NavLink>
              <NavLink to="/category/9" onClick={() => setMenuOpen(false)}>
                {categoryImages[9] && (
                  <img
                    src={`http://localhost:5000${categoryImages[9]}`}
                    className="dropdown-img"
                    alt="Quần unisex"
                  />
                )}
                Quần
              </NavLink>
            </div>
          </li>
        </ul>

        {/* 🔹 Icon bar */}
        <div className="nav-icons">
          <div
            className="nav-icon"
            title="Trang chủ"
            onClick={() => navigate("/")}
          >
            <i className="fa-solid fa-house"></i>
          </div>

          <div
            className="nav-icon"
            title="Đơn hàng"
            onClick={() => navigate("/orders")}
          >
            <i className="fa-solid fa-truck"></i>
          </div>

          <div
            className="nav-icon"
            title="Tìm kiếm"
            onClick={() => navigate("/search")}
          >
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>

          <div
            className="nav-icon"
            title="Giỏ hàng"
            onClick={() => navigate("/cart")}
          >
            <i className="fa-solid fa-bag-shopping"></i>
            {totalQuantity > 0 && (
              <span className="cart-badge-dot">{totalQuantity}</span>
            )}
          </div>

          {user?.role === "admin" && (
            <div
              className="nav-icon admin-icon"
              onMouseEnter={() => setAdminMenuOpen(true)}
              onMouseLeave={() => setAdminMenuOpen(false)}
              onClick={(e) => {
                e.stopPropagation();
                navigate("/admin");
                setAdminMenuOpen(false);
              }}
            >
              <i className="fa-solid fa-gear"></i>

              {adminMenuOpen && (
                <div
                  className="user-dropdown"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    className="dropdown-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/admin/banner");
                      setAdminMenuOpen(false);
                    }}
                  >
                    Quản lý Banner
                  </div>
                  <div
                    className="dropdown-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/admin/products");
                      setAdminMenuOpen(false);
                    }}
                  >
                    Quản lý Sản phẩm
                  </div>
                  <div
                    className="dropdown-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/admin/orders");
                      setAdminMenuOpen(false);
                    }}
                  >
                    Quản lý Đơn Hàng
                  </div>
                </div>
              )}
            </div>
          )}

          <div
            className="nav-icon user-icon"
            onMouseEnter={() => setUserMenuOpen(true)}
            onMouseLeave={() => setUserMenuOpen(false)}
          >
            <i className="fa-solid fa-user"></i>

            {/* Dropdown menu */}
            {userMenuOpen && (
              <div className="user-dropdown">
                {user ? (
                  <>
                    <div
                      className="dropdown-item"
                      onClick={() => {
                        navigate("/profile");
                        setUserMenuOpen(false);
                      }}
                    >
                      Thông tin cá nhân
                    </div>
                    <div
                      className="dropdown-item"
                      onClick={() => {
                        handleLogout();
                        setUserMenuOpen(false);
                      }}
                    >
                      Đăng xuất
                    </div>
                  </>
                ) : (
                  <div
                    className="dropdown-item"
                    onClick={() => {
                      navigate("/login");
                      setUserMenuOpen(false);
                    }}
                  >
                    Đăng nhập
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}