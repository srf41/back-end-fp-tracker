const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/users');
const foodpointRoutes = require('./routes/foodpoints');
const blockedDayRoutes = require('./routes/blockedDays');
const summaryRoutes = require('./routes/summary');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/users', userRoutes);
app.use('/foodpoints', foodpointRoutes);
app.use('/blocked-days', blockedDayRoutes);
app.use('/summary', summaryRoutes);

module.exports = app;