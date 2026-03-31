const Complaint = require('../models/Complaint');

const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({}).populate('studentId', 'name registerNumber');
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateComplaintStatus = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    
    complaint.status = req.body.status || 'resolved';
    const updatedComplaint = await complaint.save();
    res.json(updatedComplaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createComplaint = async (req, res) => {
  const { studentId, message } = req.body;
  try {
    const complaint = await Complaint.create({ studentId, message });
    res.status(201).json(complaint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getComplaints, updateComplaintStatus, createComplaint };
