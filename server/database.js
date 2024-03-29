let pool = null;

const mysql = require('mysql2/promise');

const initializeMySQL = () => {
  pool = mysql.createPool({
    database: process.env.DB_NAME || 'mychat',
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'mychat',
    password: process.env.DB_PASSWORD || 'mychatpassword',
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0
  });
};

const executeSQL = async (query, params = []) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const [res] = await conn.query(query, params);
    return res;
  } catch (err) {
    console.error('Fehler bei der Ausführung der SQL-Abfrage:', err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

const initializeDBSchema = async () => {
  const userTableQuery = `CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL AUTO_INCREMENT,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    birthdate DATE NOT NULL,
    street VARCHAR(255) NOT NULL,
    zipcode VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
  );`;
  await executeSQL(userTableQuery);
  
  const eventTableQuery = `CREATE TABLE IF NOT EXISTS events (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    description TEXT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );`;
  await executeSQL(eventTableQuery);
};

module.exports = { executeSQL, initializeMySQL, initializeDBSchema };
