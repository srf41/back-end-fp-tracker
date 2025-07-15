const db = require('../db');

function addBlockedDay({ user_id, date }, callback) {
  const sql = 'INSERT INTO blocked_days (user_id, date) VALUES (?, ?)';
  db.run(sql, [user_id, date], function (err) {
    if (err) {
      callback(err);
    } else {
      callback(null, this.lastID);
    }
  });
}

function removeBlockedDay(id, callback) {
  const sql = 'DELETE FROM blocked_days WHERE id = ?';
  db.run(sql, [id], function (err) {
    if (err) {
      callback(err);
    } else {
      callback(null);
    }
  });
}

function getBlockedDays(user_id, callback) {
  const sql = 'SELECT * FROM blocked_days WHERE user_id = ? ORDER BY date ASC';
  db.all(sql, [user_id], (err, rows) => {
    if (err) {
      callback(err);
    } else {
      callback(null, rows);
    }
  });
}

module.exports = {
  addBlockedDay,
  removeBlockedDay,
  getBlockedDays,
}; 