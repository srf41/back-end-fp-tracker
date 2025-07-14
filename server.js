const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory storage (we'll add SQLite later)
const foodPlans = new Map();
const spending = new Map();
const daysOff = new Map();

// Utility functions
function calculateDaysBetween(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function calculateRemainingDaysOnCampus(userId, startDate, endDate, currentDate) {
  const userDaysOff = daysOff.get(userId) || [];
  const daysOffInRange = userDaysOff.filter(date => date >= currentDate && date <= endDate).length;
  const totalDaysRemaining = calculateDaysBetween(currentDate, endDate);
  return Math.max(0, totalDaysRemaining - daysOffInRange);
}

function calculateDailyBudget(userId) {
  const plan = foodPlans.get(userId);
  if (!plan) {
    throw new Error('No food plan found for user');
  }

  const currentDate = new Date().toISOString().split('T')[0];
  const userSpending = spending.get(userId) || [];
  const totalSpent = userSpending.reduce((sum, record) => sum + record.amount, 0);
  const remainingPoints = plan.totalPoints - totalSpent;
  const remainingDays = calculateRemainingDaysOnCampus(userId, plan.semesterStart, plan.semesterEnd, currentDate);
  
  return {
    dailyBudget: remainingDays > 0 ? Math.round((remainingPoints / remainingDays) * 100) / 100 : 0,
    remainingPoints: Math.round(remainingPoints * 100) / 100,
    remainingDays,
    totalSpent: Math.round(totalSpent * 100) / 100
  };
}

function calculateTodayRemaining(userId) {
  const today = new Date().toISOString().split('T')[0];
  const budgetInfo = calculateDailyBudget(userId);
  const userSpending = spending.get(userId) || [];
  const todaySpending = userSpending.filter(record => record.date === today);
  const todayTotal = todaySpending.reduce((sum, record) => sum + record.amount, 0);
  const remainingToday = Math.max(0, budgetInfo.dailyBudget - todayTotal);

  return {
    ...budgetInfo,
    todaySpent: Math.round(todayTotal * 100) / 100,
    remainingToday: Math.round(remainingToday * 100) / 100,
    today
  };
}

// Routes

// Health check
app.get('/', (req, res) => {
  res.json({
    message: 'Food Points Tracker API',
    version: '1.0.0',
    status: 'running'
  });
});

// Food Plans
app.post('/food-plans', (req, res) => {
  try {
    const { userId, totalPoints, semesterStart, semesterEnd } = req.body;
    
    if (!userId || !totalPoints || !semesterStart || !semesterEnd) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    if (totalPoints <= 0) {
      return res.status(400).json({ error: 'Total points must be positive' });
    }
    
    foodPlans.set(userId, { totalPoints, semesterStart, semesterEnd });
    
    res.status(201).json({
      message: 'Food plan created successfully',
      plan: { userId, totalPoints, semesterStart, semesterEnd }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/food-plans/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const plan = foodPlans.get(userId);
    
    if (!plan) {
      return res.status(404).json({ error: 'Food plan not found' });
    }
    
    res.json({ userId, ...plan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Spending
app.post('/spending', (req, res) => {
  try {
    const { userId, amount, date } = req.body;
    
    if (!userId || !amount || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be positive' });
    }
    
    const userSpending = spending.get(userId) || [];
    const newRecord = { id: Date.now(), userId, amount, date, timestamp: new Date().toISOString() };
    userSpending.push(newRecord);
    spending.set(userId, userSpending);
    
    const budgetInfo = calculateTodayRemaining(userId);
    
    res.status(201).json({
      message: 'Spending recorded successfully',
      spending: newRecord,
      budget: budgetInfo
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/spending/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const userSpending = spending.get(userId) || [];
    res.json(userSpending);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/spending/:userId/budget', (req, res) => {
  try {
    const { userId } = req.params;
    const budgetInfo = calculateTodayRemaining(userId);
    res.json(budgetInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Days Off
app.post('/days-off', (req, res) => {
  try {
    const { userId, date, reason } = req.body;
    
    if (!userId || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const userDaysOff = daysOff.get(userId) || [];
    if (!userDaysOff.includes(date)) {
      userDaysOff.push(date);
      daysOff.set(userId, userDaysOff);
    }
    
    res.status(201).json({
      message: 'Day off added successfully',
      dayOff: { userId, date, reason }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/days-off/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const userDaysOff = daysOff.get(userId) || [];
    res.json(userDaysOff.map(date => ({ userId, date })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/days-off/:userId/:date', (req, res) => {
  try {
    const { userId, date } = req.params;
    const userDaysOff = daysOff.get(userId) || [];
    const filteredDaysOff = userDaysOff.filter(d => d !== date);
    daysOff.set(userId, filteredDaysOff);
    
    res.json({
      message: 'Day off removed successfully',
      userId,
      date
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Food Points Tracker API server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/`);
  console.log(`\nAvailable endpoints:`);
  console.log(`POST /food-plans - Create food plan`);
  console.log(`GET /food-plans/:userId - Get food plan`);
  console.log(`POST /spending - Record spending`);
  console.log(`GET /spending/:userId - Get spending history`);
  console.log(`GET /spending/:userId/budget - Get current budget`);
  console.log(`POST /days-off - Add day off`);
  console.log(`GET /days-off/:userId - Get days off`);
  console.log(`DELETE /days-off/:userId/:date - Remove day off`);
}); 