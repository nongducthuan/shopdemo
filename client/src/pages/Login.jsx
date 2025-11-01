import { useState, useContext } from "react";
import API from "../api.jsx";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../pages/Pages.css";

export default function Login() {
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Xóa lỗi cũ nếu có

    try {
      const res = await API.post("/auth/login", form);
      console.log("🔹 Login API response:", res.data);

      const { user, token } = res.data;

      if (!user || !token) {
        setError("Phản hồi từ server không hợp lệ!");
        return;
      }

      // Lưu user và token vào localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      // Cập nhật AuthContext
      setUser(user);

      // Điều hướng về trang chủ hoặc admin
      if (user.role === "admin") navigate("/admin");
      else navigate("/");
    } catch (err) {
      console.error("❌ Login error:", err);
      setError("Sai email/SĐT hoặc mật khẩu!");
    }
  };

  return (
    <div className="login container mt-4">
      <h2 className="mb-4 text-center">Đăng nhập</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            name="identifier"
            className="form-control"
            placeholder="Email hoặc số điện thoại"
            value={form.identifier}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="Mật khẩu"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Đăng nhập
        </button>
      </form>

      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
}
