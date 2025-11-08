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
  const [categoryImages, setCategoryImages] = useState({});
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  // Lấy ảnh đại diện sản phẩm cho từng category con
  useEffect(() => {
    const fetchCategoriesWithImages = async () => {
      try {
        const allCategories = [
          { id: 4, name: "Áo nam" },
          { id: 5, name: "Quần nam" },
          { id: 6, name: "Áo nữ" },
          { id: 7, name: "Quần nữ" },
          { id: 8, name: "Áo unisex" },
          { id: 9, name: "Quần unisex" }
        ];
        // Lấy ảnh đại diện cho từng category con
        const entries = await Promise.all(
          allCategories.map(async (cat) => {
            try {
              const res = await fetch(
                `http://localhost:5000/products/representative?category_id=${cat.id}`
              );
              if (!res.ok) {
                // Nếu API trả về lỗi (404), trả về null thay vì báo lỗi
                return [cat.id, null];
              }
              const data = await res.json();
              // Giả sử ảnh đại diện của category nằm trong trường `image_url`
              const imageUrl = data?.image_url || null; // Trả về URL ảnh nếu có
              return [cat.id, imageUrl];
            } catch (err) {
              console.error("Lỗi khi fetch ảnh đại diện cho category", cat.id, err);
              return [cat.id, null];
            }
          })
        );
        // Chuyển đổi mảng entries thành một object, sau đó lưu vào state categoryImages
        setCategoryImages(Object.fromEntries(entries));
      } catch (err) {
        console.error("Lỗi khi fetch các category với ảnh:", err);
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