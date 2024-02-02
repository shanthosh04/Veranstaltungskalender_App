const jwt = require('jsonwebtoken');
const { executeSQL } = require("./database");

// Initialisierung der API-Endpunkte
const initializeAPI = (app) => {
  app.post("/api/login", login);
  app.post("/api/register", register);
};

// Registrierungsfunktion
const register = async (req, res) => {
  const { firstname, lastname, birthdate, street, zipcode, city, email, password } = req.body;
  const query = `INSERT INTO users (firstname, lastname, birthdate, street, zipcode, city, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;
  try {
    const result = await executeSQL(query, [firstname, lastname, birthdate, street, zipcode, city, email, password]);
    if (result.affectedRows === 1) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login-Funktion
const login = async (req, res) => {
  const { email, password } = req.body;
  const query = `SELECT * FROM users WHERE email = ? AND password = ?`;
  try {
    const users = await executeSQL(query, [email, password]);
    if (users.length === 1) {
      const user = users[0];
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'secretevent',
        { expiresIn: '1h' }
      );

      res.json({ token });
    } else {
      res.status(401).json({ error: "Authentifizierung fehlgeschlagen" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { initializeAPI };
