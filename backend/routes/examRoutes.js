const express = require('express');
const router = express.Router();
const { getExams, addExam, deleteExam } = require('../controllers/examController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getExams)
  .post(protect, addExam);

router.route('/:id').delete(protect, deleteExam);

module.exports = router;
