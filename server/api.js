const { queryDB } = require("./database");

let db;

const initializeAPI = async (app) => {
  app.post("/api/login", login);
  app.post("/api/register", register);
};

const register = async (req, res) => {
    const { username, password } = req.body;
    const query = `INSERT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    const user = await queryDB(db, query);
    if (user.length === 1) {
      res.json(user[0]);
    } else {
      res.json(null);
    }
  };

const login = async (req, res) => {
  const { username, password } = req.body;
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  const user = await queryDB(db, query);
  if (user.length === 1) {
    res.json(user[0]);
  } else {
    res.json(null);
  }
};

module.exports = { initializeAPI };