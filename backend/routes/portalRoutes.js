const express = require('express');
const router = express.Router();
const { protectUser } = require('../middleware/authMiddleware');
const Seating = require('../models/Seating');
const Complaint = require('../models/Complaint');

// Student endpoints
router.get('/student/admit-card', protectUser, async (req, res) => {
  try {
    if (req.user.role !== 'student') return res.status(403).json({ message: 'Forbidden' });

    // Find seating where student is part of the arrangement
    const seatings = await Seating.find({ 'seatingArrangement.studentId': req.user._id })
      .populate('examId')
      .populate('hallId');

    const admitCards = seatings.map(seating => {
      const mySeat = seating.seatingArrangement.find(s => s.studentId.toString() === req.user._id.toString());
      return {
        exam: seating.examId,
        hall: seating.hallId,
        seatNumber: mySeat ? mySeat.seatNumber : 'TBD'
      };
    });

    res.json(admitCards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/student/complaints', protectUser, async (req, res) => {
  try {
    if (req.user.role !== 'student') return res.status(403).json({ message: 'Forbidden' });
    const complaints = await Complaint.find({ studentId: req.user._id }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/student/complaints', protectUser, async (req, res) => {
  try {
    if (req.user.role !== 'student') return res.status(403).json({ message: 'Forbidden' });
    const { message } = req.body;
    const complaint = await Complaint.create({ studentId: req.user._id, message });
    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Faculty endpoints
router.get('/faculty/duties', protectUser, async (req, res) => {
  try {
    if (req.user.role !== 'staff') return res.status(403).json({ message: 'Forbidden' });
    
    const duties = await Seating.find({ invigilator: req.user._id })
      .populate('examId')
      .populate('hallId');
    res.json(duties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/faculty/duties/:seatingId', protectUser, async (req, res) => {
  try {
    if (req.user.role !== 'staff') return res.status(403).json({ message: 'Forbidden' });
    const duty = await Seating.findOne({ _id: req.params.seatingId, invigilator: req.user._id })
      .populate('examId')
      .populate('hallId')
      .populate('seatingArrangement.studentId');
    if (!duty) return res.status(404).json({ message: 'Not found' });
    res.json(duty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/faculty/duties/:seatingId/attendance', protectUser, async (req, res) => {
  try {
    if (req.user.role !== 'staff') return res.status(403).json({ message: 'Forbidden' });
    const { studentId, present } = req.body;
    
    const seating = await Seating.findOne({ _id: req.params.seatingId, invigilator: req.user._id });
    if (!seating) return res.status(404).json({ message: 'Seating not found' });

    const studentRecord = seating.seatingArrangement.find(s => s.studentId.toString() === studentId);
    if (!studentRecord) return res.status(404).json({ message: 'Student not in this hall' });

    studentRecord.present = present;
    await seating.save();
    res.json({ message: 'Attendance updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/faculty/complaints', protectUser, async (req, res) => {
  try {
    if (req.user.role !== 'staff') return res.status(403).json({ message: 'Forbidden' });
    const complaints = await Complaint.find({ staffId: req.user._id }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/faculty/complaints', protectUser, async (req, res) => {
  try {
    if (req.user.role !== 'staff') return res.status(403).json({ message: 'Forbidden' });
    const { message } = req.body;
    const complaint = await Complaint.create({ staffId: req.user._id, message });
    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
