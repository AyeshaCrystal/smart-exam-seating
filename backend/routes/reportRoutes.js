const express = require('express');
const router = express.Router();
const { generateSeatingReport } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

router.get('/seating/:examId', protect, generateSeatingReport);

module.exports = router;
