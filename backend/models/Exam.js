const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  subjectName: { type: String, required: true },
  subjectCode: { type: String, required: true },
  date: { type: Date, required: true },
  session: { type: String, enum: ['FN', 'AN'], required: true },
}, { timestamps: true });

module.exports = mongoose.model('Exam', examSchema);
