import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContacts = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:3306/contacts/", {
          headers: { Authorization: token },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch contacts!");
        }
        const data = await response.json();
        setContacts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:3306/contacts/${id}`, {
      method: "DELETE",
      headers: { Authorization: token },
    });

    if (response.ok) {
      setContacts(contacts.filter((contact) => contact.id !== id));
    } else {
      alert("Failed to delete contact!");
    }
  };

  if (loading) return <div>Loading contacts...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>My Contacts</h2>
      <Link to="/add-contact">Add Contact</Link>{"   "}
      <Link to="/">Logout</Link>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Avatar</th>
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
                <img
                  src={contact.avatar_url ? contact.avatar_url : ""} 
                  alt="Avatar"
                  width="50" // Optional: Adjust image size
                  height="50"
                  style={{ borderRadius: "50%" }} // Optional: Make it circular
                />
              </td>

              <td>
                <Link to={`/edit-contact/${contact.id}`}>Edit</Link>{" "}
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
