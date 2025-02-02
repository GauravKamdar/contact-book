import React, { useState } from "react";
import { Link,useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({ 
    first_name: "", 
    last_name: "", 
    email: "", 
    password: "", 
    phone: "", 
    about: "", 
    address: "", 
    avatar: null 
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    let newErrors = {};
    // Phone number validation (10-digit only)
    const phone = /^[0-9]{10}$/;
    if (!phone.test(form.phone)) {
      newErrors.phone = "Please enter valid mobile number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const response = await fetch("http://localhost:3306/Register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      alert("Registration successful!");
      navigate("/Login");
    } else {
      const errorMessage = await response.text();
      alert(`Registration failed: ${errorMessage}`);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="First Name"
          value={form.first_name}
          onChange={(e) => setForm({ ...form, first_name: e.target.value })} required
        />
        {errors.first_name && <span>{errors.first_name}</span>}<br />
        <input
          type="text"
          placeholder="Last Name"
          value={form.last_name}
          onChange={(e) => setForm({ ...form, last_name: e.target.value })} required
        />
        {errors.last_name && <span>{errors.last_name}</span>}<br />
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
        <input
          type="text"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })} required
        />
        {errors.phone && <span>{errors.phone}</span>}<br />
        <textarea
          placeholder="About Contact"
          value={form.about}
          onChange={(e) => setForm({ ...form, about: e.target.value })}
        />
        <br />
        <input
          type="text"
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
        <br />
        <input
          type="file"
          onChange={(e) => setForm({ ...form, avatar: e.target.files[0] })}
        />
        <br />
        
        <button type="submit">Register</button><br />
        <p>Already have an account?<Link to='/Login'><br />Login</Link></p>
      </form>
    </div>
  );
};

export default Register;
