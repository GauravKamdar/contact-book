import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3306/Login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      const { token } = await response.json();
      localStorage.setItem("token", token);
      navigate("/Home");
    } else {
      const errorMessage = await response.text();
      alert(`Login failed: ${errorMessage}`);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })} required
        />
        {errors.email && <span>{errors.email}</span>}<br />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })} required
        />
        {errors.password && <span>{errors.password}</span>}<br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
