const db = require('../db');

// Insert a new foodpoint transaction
function addFoodpoint({ user_id, amount, timestamp }, callback) {
  const sql = 'INSERT INTO foodpoint_transactions (user_id, amount, timestamp) VALUES (?, ?, ?)';
  db.run(sql, [user_id, amount, timestamp], function (err) {
    if (err) {
      callback(err);
    } else {
      callback(null, this.lastID);
    }
  });
}

// Get all foodpoint transactions for a user
function getAllFoodpoints(user_id, callback) {
  const sql = 'SELECT * FROM foodpoint_transactions WHERE user_id = ? ORDER BY timestamp DESC';
  db.all(sql, [user_id], (err, rows) => {
    if (err) {
      callback(err);
    } else {
      callback(null, rows);
    }
  });
}

// Get all foodpoint transactions for a user on a specific date
function getFoodpointsByDate(user_id, date, callback) {
  const sql = 'SELECT * FROM foodpoint_transactions WHERE user_id = ? AND date(timestamp) = ?';
  db.all(sql, [user_id, date], (err, rows) => {
    if (err) {
      callback(err);
    } else {
      callback(null, rows);
    }
  });
}

module.exports = {
  addFoodpoint,
  getAllFoodpoints,
  getFoodpointsByDate,
}; 