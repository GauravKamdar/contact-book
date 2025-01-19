import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AddEditContact = () => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    about: "",
    address: "",
    whatsapp_number: "",
    avatar: null,
  });
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchContact = async () => {
        const token = localStorage.getItem("token");
        const response = await fetch(`/contacts/${id}`, {
          headers: { Authorization: token },
        });

        if (response.ok) {
          const data = await response.json();
          setForm({ ...data, avatar: null });
        } else {
          alert("Failed to fetch contact!");
        }
      };

      fetchContact();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    const response = await fetch(`
      contacts${id ? `/${id}` : ""}`,
      {
        method: id ? "PUT" : "POST",
        headers: { Authorization: token },
        body: formData,
      }
    );

    if (response.ok) {
      navigate("/dashboard");
    } else {
      alert("Failed to save contact!");
    }
  };

  return (
    <div>
      <h2>{id ? "Edit Contact" : "Add Contact"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="First Name"
          value={form.first_name}
          onChange={(e) => setForm({ ...form, first_name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={form.last_name}
          onChange={(e) => setForm({ ...form, last_name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="text"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <textarea
          placeholder="About Contact"
          value={form.about}
          onChange={(e) => setForm({ ...form, about: e.target.value })}
        />
        <input
          type="text"
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
        <input
          type="text"
          placeholder="WhatsApp Number"
          value={form.whatsapp_number}
          onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
        />
        <input
          type="file"
          onChange={(e) => setForm({ ...form, avatar: e.target.files[0] })}
        />
        <button type="submit">{id ? "Update" : "Save"}</button>
      </form>
    </div>
  );
};

export default AddEditContact;