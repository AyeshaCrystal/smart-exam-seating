const express = require('express');
const router = express.Router();
const { getHalls, addHall, deleteHall } = require('../controllers/hallController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getHalls)
  .post(protect, addHall);

router.route('/:id').delete(protect, deleteHall);

module.exports = router;
