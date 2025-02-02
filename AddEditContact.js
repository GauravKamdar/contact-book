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

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { id } = useParams();

    const validateForm = () => {
        let newErrors = {};
        // Phone number validation (10-digit only)
        const phone = /^[0-9]{10}$/;
        if (!phone.test(form.phone)) {
            newErrors.phone = "Phone number must be exactly 10 digits.";
            alert("Please enter valid mobile number");
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        if (id) {
            const fetchContact = async () => {
                const token = localStorage.getItem("token");
                try {
                    const response = await fetch(`http://localhost:3306/contacts/${id}`, {
                        headers: { Authorization: token },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setForm({
                            first_name: data.first_name,
                            last_name: data.last_name,
                            email: data.email,
                            phone: data.phone,
                            about: data.about,
                            address: data.address,
                            whatsapp_number: data.whatsapp_number,
                            avatar: data.avatar || null,
                        });
                    } else {
                        const errorMessage = await response.text();
                        alert(`Failed to fetch contact!: ${errorMessage}`);
                    }
                } catch (err) {
                    console.error(err);
                }
            }
            fetchContact();
        };
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const token = localStorage.getItem("token");
        const formData = new FormData();

        Object.keys(form).forEach((key) => {
            if (form[key] !== null && form[key] !== undefined) {
                formData.append(key, form[key]);
            } else {
                formData.append(key, ""); // Convert NULL to empty string
            }
        });
        

        const response = await fetch(`http://localhost:3306/contacts/${id ? id : ""}`, {
            method: id ? "PUT":"POST",
            headers: { Authorization: token },
            body: formData,
        });

        if (response.ok) {
            navigate("/home");
        } else {
            const errorMessage = await response.text();
            alert(`Failed to save contact!: ${errorMessage}`);
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
                    onChange={(e) => setForm({ ...form, first_name: e.target.value })} required
                /><br />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={form.last_name}
                    onChange={(e) => setForm({ ...form, last_name: e.target.value })} required
                /><br />
                <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })} required
                /><br />
                <input
                    type="text"
                    placeholder="Phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })} required
                /><br />
                <textarea
                    placeholder="About Contact"
                    value={form.about}
                    onChange={(e) => setForm({ ...form, about: e.target.value })}
                /><br />
                <input
                    type="text"
                    placeholder="Address"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                /><br />
                <input
                    type="text"
                    placeholder="WhatsApp Number"
                    value={form.whatsapp_number}
                    onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
                /><br />
                <input
                    type="file"
                    onChange={(e) => setForm({ ...form, avatar: e.target.files[0] })}
                /><br />
                <button type="submit">{id ? "Update" : "Save"}</button>
            </form>
        </div>
    );
};

export default AddEditContact;
