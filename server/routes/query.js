// routes/queries.js
const express = require('express');
const router = express.Router();
const Query = require('../models/query')


// POST /api/queries
router.post('/', async (req, res) => {
  const { query } = req.body;
  try {
    const newQuery = new Query({ query });
    await newQuery.save();
    res.status(201).json(newQuery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/queries
router.get('/', async (req, res) => {
  try {
    const queries = await Query.find().sort({ createdAt: -1 });
    res.json(queries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
