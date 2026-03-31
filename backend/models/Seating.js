const mongoose = require('mongoose');

const seatingSchema = new mongoose.Schema({
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  hallId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hall', required: true },
  examType: { type: String, enum: ['IAT', 'Semester'], default: 'IAT' },
  invigilator: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  seatingArrangement: [{
    seatNumber: String,
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    present: { type: Boolean, default: true }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Seating', seatingSchema);
