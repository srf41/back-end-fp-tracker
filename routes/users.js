const express = require('express');
const router = express.Router();
const userService = require('../services/userService');

// POST /users - create a new user
router.post('/', (req, res) => {
  const data = req.body;
  userService.createUser(data, (err, id) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.status(201).json({ message: 'User created', id });
  });
});

// GET /users/:id - get user info
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  userService.fetchUserById(id, (err, user) => {
    if (err || !user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  });
});

module.exports = router; 