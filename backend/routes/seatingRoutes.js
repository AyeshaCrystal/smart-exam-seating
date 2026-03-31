const express = require('express');
const router = express.Router();
const { generateSeating, getSeating } = require('../controllers/seatingController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate', protect, generateSeating);
router.get('/:examId', protect, getSeating);

module.exports = router;
