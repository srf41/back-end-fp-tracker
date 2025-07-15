const { getUserById } = require('../models/user');
const { getAllFoodpoints, getFoodpointsByDate } = require('../models/foodpoint');
const { getBlockedDays } = require('../models/blockedDay');

function getTodayISO() {
  return new Date().toISOString().slice(0, 10);
}

function calculateSummary(user_id, callback) {
  getUserById(user_id, (err, user) => {
    if (err || !user) return callback(new Error('User not found'));
    getAllFoodpoints(user_id, (err, transactions) => {
      if (err) return callback(err);
      getBlockedDays(user_id, (err, blockedDays) => {
        if (err) return callback(err);
        // Calculate remaining points
        const spent = transactions.reduce((sum, t) => sum + t.amount, 0);
        const remainingPoints = user.food_plan_points - spent;
        // Calculate remaining usable days
        const today = getTodayISO();
        const semesterEnd = user.semester_end.slice(0, 10);
        let daysLeft = 0;
        let current = new Date(today);
        const end = new Date(semesterEnd);
        while (current <= end) {
          daysLeft++;
          current.setDate(current.getDate() + 1);
        }
        // Remove blocked days in the future (including today)
        const blockedSet = new Set(blockedDays.map(b => b.date));
        let usableDays = 0;
        current = new Date(today);
        while (current <= end) {
          const iso = current.toISOString().slice(0, 10);
          if (!blockedSet.has(iso)) usableDays++;
          current.setDate(current.getDate() + 1);
        }
        // Calculate daily allowance
        const dailyAllowance = usableDays > 0 ? remainingPoints / usableDays : 0;
        // Calculate spent today
        getFoodpointsByDate(user_id, today, (err, todaysTransactions) => {
          if (err) return callback(err);
          const spentToday = todaysTransactions.reduce((sum, t) => sum + t.amount, 0);
          const remainingToday = dailyAllowance - spentToday;
          callback(null, {
            remainingPoints,
            usableDays,
            dailyAllowance,
            spentToday,
            remainingToday,
            semesterEnd: user.semester_end,
            blockedDays: blockedDays.map(b => b.date),
          });
        });
      });
    });
  });
}

module.exports = {
  calculateSummary,
}; 