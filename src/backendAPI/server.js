const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mysql = require("mysql2");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Parse JSON requests

// MySQL Database Connection
const db = mysql.createConnection({
  host: "localhost", // Replace with your database host
  user: "finance_tracker", // Replace with your MySQL username
  password: "finance_tracker", // Replace with your MySQL password
  database: "finance", // Replace with your MySQL database name
});

db.connect((err) => {
  if (err) {
    console.error("Could not connect to MySQL:", err);
    process.exit(1);
  }
  console.log("Connected to MySQL database.");
});

// Sign Up Endpoint
app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  // Basic validation
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long." });
  }

  // Check if email already exists
  const queryCheck = "SELECT * FROM users WHERE email = ?";
  db.query(queryCheck, [email], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error." });
    }
    if (result.length > 0) {
      return res
        .status(400)
        .json({ message: "Email is already registered." });
    }

    // Hash the password and save the user to the database
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error hashing password." });
      }

      const queryInsert =
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
      db.query(
        queryInsert,
        [username, email, hashedPassword],
        (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "Database error." });
          }
          res.status(201).json({ message: "User registered successfully!" });
        }
      );
    });
  });
});

// Login Endpoint
app.post("/loginPage", (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error." });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "User not found!" });
    }

    const user = result[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error verifying password." });
      }
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid password!" });
      }

      // Generate a token
      const token = jwt.sign({ email: user.email }, "secretKey", {
        expiresIn: "1h",
      });
      res.json({ token });
    });
  });
});

// Start the Server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

// Transaction API
app.get("/api/transactions", (req, res) => {
  const query = "SELECT id, date, category, description, amount, type FROM transactions";
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching transactions:", err);
      return res.status(500).json({ message: "Database error." });
    }
    res.json(result);
  });
});

// Add Transaction API
app.post("/api/transactions", (req, res) => {
  const { amount, date, type, description, category } = req.body;

  // Validate incoming data
  if (!amount || !date || !type) {
    return res.status(400).json({ message: "Amount, date, and type are required." });
  }

  // Insert the transaction into the database
  const query = `
    INSERT INTO transactions (amount, date, type, description, category)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(query, [amount, date, type, description, category], (err, result) => {
    if (err) {
      console.error("Error adding transaction:", err);
      return res.status(500).json({ message: "Database error." });
    }
    res.status(201).json({ message: "Transaction added successfully!", transactionId: result.insertId });
  });
});

// Update Transaction API
app.put("/api/transactions/:id", (req, res) => {
  const { id } = req.params;
  const { amount, date, type, description, category } = req.body;

  // Validate incoming data
  if (!amount || !date || !type) {
    return res.status(400).json({ message: "Amount, date, and type are required." });
  }

  // Format the date to 'YYYY-MM-DD'
  const formattedDate = new Date(date).toISOString().split('T')[0];

  // Update the transaction in the database
  const query = `
    UPDATE transactions
    SET amount = ?, date = ?, type = ?, description = ?, category = ?
    WHERE id = ?
  `;
  db.query(query, [amount, formattedDate, type, description, category, id], (err, result) => {
    if (err) {
      console.error("Error updating transaction:", err);
      return res.status(500).json({ message: "Database error." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Transaction not found." });
    }
    res.json({ message: "Transaction updated successfully!" });
  });
});

// Delete Transaction API
app.delete("/api/transactions/:id", (req, res) => {
  const { id } = req.params;

  // Delete the transaction from the database
  const query = "DELETE FROM transactions WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting transaction:", err);
      return res.status(500).json({ message: "Database error." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Transaction not found." });
    }
    res.json({ message: "Transaction deleted successfully!" });
  });
});

// Dashboard API
app.get("/api/dashboard", (req, res) => {
  const query = `SELECT 
  SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) AS totalIncome,
  SUM(CASE WHEN amount < 0 THEN amount ELSE 0 END) AS totalExpenses,
  SUM(amount) AS netBalance
  FROM transactions;
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching dashboard data:", err);
      return res.status(500).json({ message: "Database error." });
    }
    res.json(result[0]);
  });
});




