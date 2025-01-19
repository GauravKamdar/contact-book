import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const [contacts, setContacts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContacts = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch("/contacts", {
        headers: { Authorization: token },
      });

      if (response.ok) {
        const data = await response.json();
        setContacts(data);
      } else {
        alert("Failed to fetch contacts!");
      }
    };

    fetchContacts();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    const response = await fetch( `/contacts/${id}`, {
      method: "DELETE",
      headers: { Authorization: token },
    });

    if (response.ok) {
      setContacts(contacts.filter((contact) => contact.id !== id));
    } else {
      alert("Failed to delete contact!");
    }
  };

  return (
    <div>
      <h2>My Contacts</h2>
      <Link to="/add-contact">Add Contact</Link>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact.id}>
              <td>{contact.first_name} {contact.last_name}</td>
              <td>{contact.email}</td>
              <td>{contact.phone}</td>
              <td>
                <Link to={`/edit-contact/${contact.id}`}>Edit</Link>
                <button onClick={() => handleDelete(contact.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home;