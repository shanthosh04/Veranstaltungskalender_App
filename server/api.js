const jwt = require('jsonwebtoken');
const { executeSQL } = require("./database");

const initializeAPI = (app) => {
  app.post("/api/login", login);
  app.post("/api/register", register);
  app.get("/api/event", authenticateToken, getEvents);
  app.post("/api/event", authenticateToken, createEvent);
  app.put("/api/event/:eventId", authenticateToken, editEvent);
  app.delete("/api/event/:eventId", authenticateToken, deleteEvent);
};

const register = async (req, res) => {
  const { firstname, lastname, birthdate, street, zipcode, city, email, password } = req.body;
  const query = `INSERT INTO users (firstname, lastname, birthdate, street, zipcode, city, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;
  try {
    const result = await executeSQL(query, [firstname, lastname, birthdate, street, zipcode, city, email, password]);
    if (result.affectedRows === 1) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: "Benutzer konnte nicht registriert werden" });
    }
  } catch (error) {
    res.status(500).json({ error: "Serverfehler bei der Registrierung" });
  }
};

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
    res.status(500).json({ error: "Serverfehler beim Login" });
  }
};

const createEvent = async (req, res) => {
  const { title, date, description } = req.body;
  const userId = req.user.userId;
  const query = `INSERT INTO events (user_id, title, date, description) VALUES (?, ?, ?, ?);`;
  try {
    const result = await executeSQL(query, [userId, title, date, description]);
    if (result.affectedRows === 1) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: "Ereignis konnte nicht erstellt werden" });
    }
  } catch (error) {
    res.status(500).json({ error: "Serverfehler bei der Ereigniserstellung" });
  }
};

const editEvent = async (req, res) => {
  const { title, date, description } = req.body;
  const { eventId } = req.params;
  const userId = req.user.userId;

  const query = `UPDATE events SET title = ?, date = ?, description = ? WHERE id = ? AND user_id = ?;`;
  try {
    const result = await executeSQL(query, [title, date, description, eventId, userId]);
    if (result.affectedRows === 1) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: "Ereignis konnte nicht aktualisiert werden" });
    }
  } catch (error) {
    res.status(500).json({ error: "Serverfehler bei der Aktualisierung des Ereignisses" });
  }
};


const deleteEvent = async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user.userId;
  const query = `DELETE FROM events WHERE id = ? AND user_id = ?;`;
  try {
    const result = await executeSQL(query, [eventId, userId]);
    if (result.affectedRows === 1) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: "Ereignis konnte nicht gelöscht werden" });
    }
  } catch (error) {
    res.status(500).json({ error: "Serverfehler beim Löschen des Ereignisses" });
  }
};

const getEvents = async (req, res) => {
  const userId = req.user.userId;
  const query = `SELECT * FROM events WHERE user_id = ?`;
  try {
    const events = await executeSQL(query, [userId]);
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Serverfehler beim Abrufen von Veranstaltungen" });
  }
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET || 'secretevent', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

module.exports = { initializeAPI };
