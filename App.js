import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import AddEditContact from "./components/AddEditContact";
//import EditContact from "./components/EditContact";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/contacts" element={<Home />} />
        <Route path="/add-contact" element={<AddEditContact />} />
        <Route path="/edit-contact/:id" element={<AddEditContact />} />
      </Routes>
    </Router>
  );
};

export default App;
