const express = require('express');
const router = express.Router();
const blockedDayService = require('../services/blockedDayService');

// POST /blocked-days - add a blocked day
router.post('/', (req, res) => {
  const data = req.body;
  blockedDayService.createBlockedDay(data, (err, id) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.status(201).json({ message: 'Blocked day added', id });
  });
});

// DELETE /blocked-days/:id - remove a blocked day
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  blockedDayService.deleteBlockedDay(id, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ message: 'Blocked day removed' });
  });
});

// GET /blocked-days/:user_id - get all blocked days for a user
router.get('/:user_id', (req, res) => {
  const user_id = parseInt(req.params.user_id, 10);
  blockedDayService.fetchBlockedDays(user_id, (err, days) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve blocked days' });
    }
    res.json(days);
  });
});

module.exports = router; 