const express = require('express');
const router = express.Router();
const foodpointService = require('../services/foodpointService');

// POST /foodpoints - log a transaction
router.post('/', (req, res) => {
  const data = req.body;
  foodpointService.createFoodpoint(data, (err, id) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.status(201).json({ message: 'Foodpoint transaction added', id });
  });
});

// GET /foodpoints/:user_id - get all transactions for a user
router.get('/:user_id', (req, res) => {
  const user_id = parseInt(req.params.user_id, 10);
  foodpointService.fetchAllFoodpoints(user_id, (err, transactions) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve transactions' });
    }
    res.json(transactions);
  });
});

module.exports = router; 