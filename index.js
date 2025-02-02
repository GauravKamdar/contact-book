const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());
const UPLOAD_DIR = "C:/Users/krishna/OneDrive/Pictures/";
app.use("/uploads", express.static(UPLOAD_DIR)); // Serve uploaded files

const SECRET_KEY = "24a73bcfb242c95c4bfe9091202e9b172654f6c7f3ea726502171b3861a2f7e3bb9d88c45e9767b0071b9a76d52ceb41cd4590cd0f32e19d991e9ad4faf03a99";

// MySQL Database Connection
const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "2205",
  database: "contact_book",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL");
});

// Multer Setup for Avatar Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// User Registration
app.post("/Register", async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, hashedPassword],
    (err, result) => {
      if (err) return res.status(500).send("Error registering user");
      res.status(201).send("User registered successfully");
    }
  );
});

// User Login
app.post("/Login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).send("Server error");
    if (results.length === 0) return res.status(404).send("User not found");

    const user = results[0];
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) return res.status(401).send("Invalid credentials");

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "1h" });
    res.status(200).json({ token });
  });
});

// Middleware for Authentication
const authenticate = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).send("Access Denied");

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).send("Invalid Token");
    req.user = user;
    next();
  });
};

// Fetch Contacts
app.get("/contacts", authenticate, (req, res) => {
  db.query("SELECT * FROM contacts WHERE user_id = ?", [req.user.id], (err, results) => {
    if (err) return res.status(500).send("Error fetching contacts");
    res.status(200).json(results);
  });
});

app.get("/contacts/:id", authenticate, (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM contacts WHERE id = ? AND user_id = ?", [id, req.user.id], (err, result) => {
    if (err) return res.status(500).send("Error fetching contact");
    if (result.length === 0) return res.status(404).send("Contact not found");
    res.status(200).json(result[0]);
  });
});

// Add Contact
app.post("/contacts", authenticate, upload.single("avatar"), (req, res) => {
  const { first_name, last_name, email, phone, about, address, whatsapp_number } = req.body;
  const avatar_url = req.file ? `http://localhost:3306/uploads/${req.file.filename}` : null;

  db.query(
    "INSERT INTO contacts (user_id, first_name, last_name, email, phone, about, avatar_url, address, whatsapp_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [req.user.id, first_name, last_name, email, phone, about, avatar_url, address, whatsapp_number],
    (err, result) => {
      if (err) return res.status(500).send("Error adding contact");
      res.status(201).send("Contact added successfully");
    }
  );
});

// Edit Contact
app.put("/contacts/:id", authenticate, upload.single("avatar"), (req, res) => {
  const { first_name, last_name, email, phone, about, address, whatsapp_number } = req.body;
  const { id } = req.params;
  const avatar_url = req.file ? `http://localhost:3306/uploads/${req.file.filename}` : null; // Correct relative URL

  db.query(
    "UPDATE contacts SET first_name = ?, last_name = ?, email = ?, phone = ?, about = ?, address = ?, whatsapp_number = ?, avatar_url = COALESCE(?, avatar_url) WHERE id = ? AND user_id = ?",
    [first_name, last_name, email, phone, about, address, whatsapp_number, avatar_url, id, req.user.id],
    (err, result) => {
      if (err) return res.status(500).send("Error updating contact");
      if (result.affectedRows === 0) return res.status(404).send("Contact not found or no changes made");
      res.status(200).send("Contact updated successfully");
    }
  );
});

// Delete Contact
app.delete("/contacts/:id", authenticate, (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM contacts WHERE id = ? AND user_id = ?",
    [id, req.user.id],
    (err, result) => {
      if (err) return res.status(500).send("Error deleting contact");
      res.status(200).send("Contact deleted successfully");
    }
  );
});

// Start Server
app.listen(3306, () => console.log("Server running on http://localhost:3306"));
