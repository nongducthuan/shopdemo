import { useState } from "react";
import API from "../api.jsx";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu không khớp!");
      return;
    }
    try {
      const { name, email, phone, password } = form;
      await API.post("/auth/register", { name, email, phone, password });
      navigate("/login");
    } catch (err) {
      setError("Đăng ký thất bại!");
    }
  };

  return (
    <div className="register container mt-4 flex justify-center">
      <div className="w-full max-w-md lg:w-1/2">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-gray-800">
          ĐĂNG KÝ
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Tên"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              name="phone"
              className="form-control"
              placeholder="Số điện thoại"
              value={form.phone}
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

          <div className="mb-3">
            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              placeholder="Nhập lại mật khẩu"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-success w-100">
            Đăng ký
          </button>
        </form>

        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </div>
    </div>
  );
}
