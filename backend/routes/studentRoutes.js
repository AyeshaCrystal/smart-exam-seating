const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getStudents, addStudent, uploadStudents, deleteStudent, deleteAllStudents } = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');

const upload = multer({ storage: multer.memoryStorage() });

router.route('/')
  .get(protect, getStudents)
  .post(protect, addStudent)
  .delete(protect, deleteAllStudents);

router.post('/upload', protect, upload.single('file'), uploadStudents);
router.route('/:id').delete(protect, deleteStudent);

module.exports = router;
