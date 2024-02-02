const { executeSQL } = require("./database");

const initializeAPI = (app) => {
  app.post("/api/login", login);
  app.post("/api/register", register);
};

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
    res.json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const query = `SELECT * FROM users WHERE email = ? AND password = ?`;
  try {
    const user = await executeSQL(query, [email, password]);
    if (user.length === 1) {
      res.json(user[0]);
    } else {
      res.json(null);
    }
  } catch (error) {
    res.json({ error: error.message });
  }
};

module.exports = { initializeAPI };
