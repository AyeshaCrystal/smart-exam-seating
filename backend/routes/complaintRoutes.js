const express = require('express');
const router = express.Router();
const { getComplaints, updateComplaintStatus, createComplaint } = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getComplaints).post(createComplaint);
router.route('/:id').put(protect, updateComplaintStatus);

module.exports = router;
