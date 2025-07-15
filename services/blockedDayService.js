const { addBlockedDay, removeBlockedDay, getBlockedDays } = require('../models/blockedDay');

function validateBlockedDay(data) {
  if (
    typeof data.user_id !== 'number' ||
    typeof data.date !== 'string'
  ) {
    return false;
  }
  return true;
}

function createBlockedDay(data, callback) {
  if (!validateBlockedDay(data)) {
    return callback(new Error('Invalid blocked day data'));
  }
  addBlockedDay(data, callback);
}

function deleteBlockedDay(id, callback) {
  removeBlockedDay(id, callback);
}

function fetchBlockedDays(user_id, callback) {
  getBlockedDays(user_id, callback);
}

module.exports = {
  createBlockedDay,
  deleteBlockedDay,
  fetchBlockedDays,
}; 