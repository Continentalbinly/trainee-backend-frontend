const express = require("express");
const mysql = require("mysql");

const app = express();
app.use(express.json());

// MySQL Connection

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mysql-nodejs",  // Your SQL Database Name
});

connection.connect((err) => {
  if (err) {
    console.log("Error connecting to MySQL database = ", err);
    return;
  }
  console.log("MySQL successfully connected!");
});

// CREATE Routes
app.post("/create", async (req, res) => {
  const { email, name, password } = req.body;
  try {
    connection.query(
      "INSERT INTO users(email, fullname, password) VALUES(?, ?, ?)",
      [email, name, password],
      (err, result, fields) => {
        if (err) {
          console.log("Error while inserting a user into the database", err);
          return res.status(400).send();
        }
        return res
          .status(201)
          .json({ message: "New user successfully created!" });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

// READ
app.get("/read", async (req, res) => {
  try {
    connection.query("SELECT * FROM users", (err, result, fields) => {
      if (err) {
        console.log(err);
        return res.status(400).send();
      }
      res.status(200).json(result);
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

// READ sigle users from DB

app.get("/read/single/:email", async (req, res) => {
  const email = req.params.email;
  try {
    connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      (err, result, fields) => {
        if (err) {
          console.log(err);
          return res.status(400).send();
        }
        res.status(200).json(result);
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

// UPDATE data

app.patch("/update/:email", async (req, res) => {
  const email = req.params.email;
  const newPassword = req.body.newPassword;
  try {
    connection.query(
      "UPDATE users SET password = ? WHERE email = ?",
      [newPassword, email],
      (err, result, fields) => {
        if (err) {
          console.log(err);
          return res.status(400).send();
        }
        res
          .status(200)
          .json({ message: "User password updated successfully!" });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

//DELETE
app.delete("/delete/:email", async (req, res) => {
  const email = req.params.email;

  try {
    connection.query(
      "DELETE FROM users  WHERE email = ?",
      [email],
      (err, result, fields) => {
        if (err) {
          console.log(err);
          return res.status(400).send();
        }
        if (res.affectedRows === 0) {
            return res.status(404).json({ message: "No user with that email!"});
        }
        return res.status(200).json({ message: "User deleted successfully!"});
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

// REGISTER

app.post("/register", async (req, res) => {
  const { email, name, password } = req.body;
  try {
    connection.query(
      "INSERT INTO users(email, fullname, password) VALUES(?, ?, ?)",
      [email, name, password],
      (err, result, fields) => {
        if (err) {
          console.log("Error while inserting a user into the database", err);
          return res.status(400).send();
        }
        return res
          .status(201)
          .json({ message: "New user successfully created!" });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});
let PORT = 3000 || 5000

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
