const db = require('../db');

function addUser({ name, food_plan_points, semester_start, semester_end }, callback) {
  const sql = 'INSERT INTO users (name, food_plan_points, semester_start, semester_end) VALUES (?, ?, ?, ?)';
  db.run(sql, [name, food_plan_points, semester_start, semester_end], function (err) {
    if (err) {
      callback(err);
    } else {
      callback(null, this.lastID);
    }
  });
}

function getUserById(id, callback) {
  const sql = 'SELECT * FROM users WHERE id = ?';
  db.get(sql, [id], (err, row) => {
    if (err) {
      callback(err);
    } else {
      callback(null, row);
    }
  });
}

module.exports = {
  addUser,
  getUserById,
}; 