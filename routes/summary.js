const express = require('express');
const router = express.Router();
const summaryService = require('../services/summaryService');

// GET /summary/:user_id - get summary info for a user
router.get('/:user_id', (req, res) => {
  const user_id = parseInt(req.params.user_id, 10);
  summaryService.calculateSummary(user_id, (err, summary) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json(summary);
  });
});

module.exports = router; 