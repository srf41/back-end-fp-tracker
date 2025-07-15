const { addFoodpoint, getAllFoodpoints, getFoodpointsByDate } = require('../models/foodpoint');

function validateFoodpoint(data) {
  if (
    typeof data.user_id !== 'number' ||
    typeof data.amount !== 'number' ||
    typeof data.timestamp !== 'string'
  ) {
    return false;
  }
  return true;
}

function createFoodpoint(data, callback) {
  if (!validateFoodpoint(data)) {
    return callback(new Error('Invalid foodpoint data'));
  }
  addFoodpoint(data, callback);
}

function fetchAllFoodpoints(user_id, callback) {
  getAllFoodpoints(user_id, callback);
}

function fetchFoodpointsByDate(user_id, date, callback) {
  getFoodpointsByDate(user_id, date, callback);
}

module.exports = {
  createFoodpoint,
  fetchAllFoodpoints,
  fetchFoodpointsByDate,
};