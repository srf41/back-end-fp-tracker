const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'foodpoints.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

db.serialize(() => {
  // Users table
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      food_plan_points REAL NOT NULL,
      semester_start TEXT NOT NULL,
      semester_end TEXT NOT NULL
    )`,
    (err) => {
      if (err) {
        console.error('Error creating users table:', err.message);
      } else {
        console.log('Users table is ready.');
      }
    }
  );

  // Foodpoint transactions table
  db.run(
    `CREATE TABLE IF NOT EXISTS foodpoint_transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      timestamp TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`,
    (err) => {
      if (err) {
        console.error('Error creating foodpoint_transactions table:', err.message);
      } else {
        console.log('Foodpoint transactions table is ready.');
      }
    }
  );

  // Blocked days table
  db.run(
    `CREATE TABLE IF NOT EXISTS blocked_days (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`,
    (err) => {
      if (err) {
        console.error('Error creating blocked_days table:', err.message);
      } else {
        console.log('Blocked days table is ready.');
      }
    }
  );
});

module.exports = db; 