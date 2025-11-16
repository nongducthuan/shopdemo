import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

export default function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  const [categoryImages, setCategoryImages] = useState({});
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const [userTimeout, setUserTimeout] = useState(null);
  const [adminTimeout, setAdminTimeout] = useState(null);
  const [categoryTimeout, setCategoryTimeout] = useState(null);

  useEffect(() => {
    const fetchCategoriesWithImages = async () => {
      const allCategories = [
        { id: 4, name: "Áo nam" },
        { id: 5, name: "Quần nam" },
        { id: 6, name: "Áo nữ" },
        { id: 7, name: "Quần nữ" },
        { id: 8, name: "Áo unisex" },
        { id: 9, name: "Quần unisex" },
      ];
      const entries = await Promise.all(
        allCategories.map(async (cat) => {
          try {
            const res = await fetch(
              `http://localhost:5000/products/representative?category_id=${cat.id}`
            );
            if (!res.ok) return [cat.id, null];
            const data = await res.json();
            return [cat.id, data?.image_url || null];
          } catch {
            return [cat.id, null];
          }
        })
      );
      setCategoryImages(Object.fromEntries(entries));
    };
    fetchCategoriesWithImages();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  const totalQuantity = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const renderCategoryDropdown = (catIds) =>
    catIds.map((id) => (
      <NavLink
        key={id}
        to={`/category/${id}`}
        className="flex flex-col items-center justify-center hover:bg-violet-50 rounded-lg p-2 hover:text-violet-700 transition"
      >
        {categoryImages[id] && (
          <img
            src={`http://localhost:5000${categoryImages[id]}`}
            className="w-10 h-10 rounded object-cover mb-1"
            alt=""
          />
        )}
        <span className="text-sm font-medium">{id % 2 === 0 ? "Áo" : "Quần"}</span>
      </NavLink>
    ));

  // --- Handlers with delay ---
  const handleCategoryEnter = (cat) => {
    if (categoryTimeout) clearTimeout(categoryTimeout);
    setHoveredCategory(cat);
  };
  const handleCategoryLeave = () => {
    const timeout = setTimeout(() => setHoveredCategory(null), 200);
    setCategoryTimeout(timeout);
  };

  const handleAdminEnter = () => {
    if (adminTimeout) clearTimeout(adminTimeout);
    setAdminMenuOpen(true);
  };
  const handleAdminLeave = () => {
    const timeout = setTimeout(() => setAdminMenuOpen(false), 200);
    setAdminTimeout(timeout);
  };

  const handleUserEnter = () => {
    if (userTimeout) clearTimeout(userTimeout);
    setUserMenuOpen(true);
  };
  const handleUserLeave = () => {
    const timeout = setTimeout(() => setUserMenuOpen(false), 200);
    setUserTimeout(timeout);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm font-sans px-4 py-3">
      {/* Desktop */}
      <div className="hidden md:flex items-center justify-between">
        {/* Brand */}
        <div
          className="text-xl font-bold text-violet-600 cursor-pointer hover:text-violet-700 transition"
          onClick={() => navigate("/")}
        >
          🛒 Clothing Shop
        </div>

        {/* Menu */}
        <ul className="flex justify-center items-center gap-6">
          {/* Nam */}
          <li
            className="relative"
            onMouseEnter={() => handleCategoryEnter("nam")}
            onMouseLeave={handleCategoryLeave}
          >
            <span className="cursor-pointer text-gray-700 font-medium hover:text-violet-600 transition">
              Nam
            </span>
            {hoveredCategory === "nam" && (
              <div className="absolute left-1/2 -translate-x-1/2 grid grid-cols-2 gap-2 bg-white rounded-lg shadow-md py-2 px-3 w-56 z-50 mt-1 border border-gray-100">
                {renderCategoryDropdown([4, 5])}
              </div>
            )}
          </li>

          {/* Nữ */}
          <li
            className="relative"
            onMouseEnter={() => handleCategoryEnter("nu")}
            onMouseLeave={handleCategoryLeave}
          >
            <span className="cursor-pointer text-gray-700 font-medium hover:text-violet-600 transition">
              Nữ
            </span>
            {hoveredCategory === "nu" && (
              <div className="absolute left-1/2 -translate-x-1/2 grid grid-cols-2 gap-2 bg-white rounded-lg shadow-md py-2 px-3 w-56 z-50 mt-1 border border-gray-100">
                {renderCategoryDropdown([6, 7])}
              </div>
            )}
          </li>

          {/* Unisex */}
          <li
            className="relative"
            onMouseEnter={() => handleCategoryEnter("unisex")}
            onMouseLeave={handleCategoryLeave}
          >
            <span className="cursor-pointer text-gray-700 font-medium hover:text-violet-600 transition">
              Unisex
            </span>
            {hoveredCategory === "unisex" && (
              <div className="absolute left-1/2 -translate-x-1/2 grid grid-cols-2 gap-2 bg-white rounded-lg shadow-md py-2 px-3 w-56 z-50 mt-1 border border-gray-100">
                {renderCategoryDropdown([8, 9])}
              </div>
            )}
          </li>
        </ul>

        {/* Icons */}
        <div className="flex items-center gap-2">
          <i
            className="fa-solid fa-house text-gray-700 hover:text-violet-600 cursor-pointer transition text-lg"
            onClick={() => navigate("/")}
          ></i>
          <i
            className="fa-solid fa-truck text-gray-700 hover:text-violet-600 cursor-pointer transition text-lg"
            onClick={() => navigate("/orders")}
          ></i>
          <i
            className="fa-solid fa-magnifying-glass text-gray-700 hover:text-violet-600 cursor-pointer transition text-lg"
            onClick={() => navigate("/search")}
          ></i>
          <div className="relative">
            <i
              className="fa-solid fa-bag-shopping text-gray-700 hover:text-violet-600 cursor-pointer transition text-lg"
              onClick={() => navigate("/cart")}
            ></i>
            {totalQuantity > 0 && (
              <span className="absolute -top-2 -right-3 bg-violet-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {totalQuantity}
              </span>
            )}
          </div>

          {/* Admin */}
          {user?.role === "admin" && (
            <div
              className="relative"
              onMouseEnter={handleAdminEnter}
              onMouseLeave={handleAdminLeave}
            >
              <i className="fa-solid fa-gear text-gray-700 hover:text-violet-600 cursor-pointer transition text-lg"></i>

              {adminMenuOpen && (
                <div className="absolute right-0 bg-white rounded-lg shadow-md mt-2 py-2 w-44 animate-fadeIn">
                  <div
                    className="px-4 py-2 hover:bg-violet-50 hover:text-violet-700 cursor-pointer"
                    onClick={() => navigate("/admin/banner")}
                  >
                    Quản lý Banner
                  </div>
                  <div
                    className="px-4 py-2 hover:bg-violet-50 hover:text-violet-700 cursor-pointer"
                    onClick={() => navigate("/admin/products")}
                  >
                    Quản lý Sản phẩm
                  </div>
                  <div
                    className="px-4 py-2 hover:bg-violet-50 hover:text-violet-700 cursor-pointer"
                    onClick={() => navigate("/admin/orders")}
                  >
                    Quản lý Đơn hàng
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User */}
          <div
            className="relative"
            onMouseEnter={handleUserEnter}
            onMouseLeave={handleUserLeave}
          >
            <i className="fa-solid fa-user text-gray-700 hover:text-violet-600 cursor-pointer transition text-lg"></i>
            {userMenuOpen && (
              <div className="absolute right-0 bg-white rounded-lg shadow-md mt-2 py-2 w-40 animate-fadeIn">
                {user ? (
                  <>
                    <div
                      className="px-4 py-2 hover:bg-violet-50 hover:text-violet-700 cursor-pointer"
                      onClick={() => navigate("/profile")}
                    >
                      Thông tin cá nhân
                    </div>
                    <div
                      className="px-4 py-2 hover:bg-violet-50 hover:text-violet-700 cursor-pointer"
                      onClick={handleLogout}
                    >
                      Đăng xuất
                    </div>
                  </>
                ) : (
                  <div
                    className="px-4 py-2 hover:bg-violet-50 hover:text-violet-700 cursor-pointer"
                    onClick={() => navigate("/login")}
                  >
                    Đăng nhập
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="flex flex-col gap-3 md:hidden">
        {/* Brand */}
        <div
          className="text-xl font-bold text-violet-600 cursor-pointer hover:text-violet-700 text-center"
          onClick={() => navigate("/")}
        >
          🛒 Clothing Shop
        </div>

        {/* Menu */}
        <ul className="flex justify-center items-center gap-4">
          {["nam", "nu", "unisex"].map((cat) => (
            <li
              key={cat}
              className="relative"
              onMouseEnter={() => handleCategoryEnter(cat)}
              onMouseLeave={handleCategoryLeave}
            >
              <span className="cursor-pointer text-gray-700 font-medium hover:text-violet-600 transition">
                {cat === "nam" ? "Nam" : cat === "nu" ? "Nữ" : "Unisex"}
              </span>
              {hoveredCategory === cat && (
                <div className="absolute left-1/2 -translate-x-1/2 grid grid-cols-2 gap-2 bg-white rounded-lg shadow-md py-2 px-3 w-56 z-50 mt-1 border border-gray-100">
                  {cat === "nam" && renderCategoryDropdown([4, 5])}
                  {cat === "nu" && renderCategoryDropdown([6, 7])}
                  {cat === "unisex" && renderCategoryDropdown([8, 9])}
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* Icons */}
        <div className="flex justify-center items-center gap-4">
          <i
            className="fa-solid fa-house text-gray-700 hover:text-violet-600 cursor-pointer transition text-lg"
            onClick={() => navigate("/")}
          ></i>
          <i
            className="fa-solid fa-truck text-gray-700 hover:text-violet-600 cursor-pointer transition text-lg"
            onClick={() => navigate("/orders")}
          ></i>
          <i
            className="fa-solid fa-magnifying-glass text-gray-700 hover:text-violet-600 cursor-pointer transition text-lg"
            onClick={() => navigate("/search")}
          ></i>
          <div className="relative">
            <i
              className="fa-solid fa-bag-shopping text-gray-700 hover:text-violet-600 cursor-pointer transition text-lg"
              onClick={() => navigate("/cart")}
            ></i>
            {totalQuantity > 0 && (
              <span className="absolute -top-2 -right-3 bg-violet-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {totalQuantity}
              </span>
            )}
          </div>

          {user?.role === "admin" && (
            <div
              className="relative"
              onMouseEnter={handleAdminEnter}
              onMouseLeave={handleAdminLeave}
              onClick={() => navigate("/admin")}
            >
              <i className="fa-solid fa-gear text-gray-700 hover:text-violet-600 cursor-pointer transition text-lg"></i>
            </div>
          )}

          <div
            className="relative"
            onMouseEnter={handleUserEnter}
            onMouseLeave={handleUserLeave}
          >
            <i className="fa-solid fa-user text-gray-700 hover:text-violet-600 cursor-pointer transition text-lg"></i>
            {userMenuOpen && (
              <div className="absolute right-0 bg-white rounded-lg shadow-md mt-2 py-2 w-40 animate-fadeIn">
                {user ? (
                  <>
                    <div
                      className="px-4 py-2 hover:bg-violet-50 hover:text-violet-700 cursor-pointer"
                      onClick={() => navigate("/profile")}
                    >
                      Thông tin cá nhân
                    </div>
                    <div
                      className="px-4 py-2 hover:bg-violet-50 hover:text-violet-700 cursor-pointer"
                      onClick={handleLogout}
                    >
                      Đăng xuất
                    </div>
                  </>
                ) : (
                  <div
                    className="px-4 py-2 hover:bg-violet-50 hover:text-violet-700 cursor-pointer"
                    onClick={() => navigate("/login")}
                  >
                    Đăng nhập
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
