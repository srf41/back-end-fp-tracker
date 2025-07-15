const { addUser, getUserById } = require('../models/user');

function validateUser(data) {
  if (
    typeof data.name !== 'string' ||
    typeof data.food_plan_points !== 'number' ||
    typeof data.semester_start !== 'string' ||
    typeof data.semester_end !== 'string'
  ) {
    return false;
  }
  return true;
}

function createUser(data, callback) {
  if (!validateUser(data)) {
    return callback(new Error('Invalid user data'));
  }
  addUser(data, callback);
}

function fetchUserById(id, callback) {
  getUserById(id, callback);
}

module.exports = {
  createUser,
  fetchUserById,
}; 