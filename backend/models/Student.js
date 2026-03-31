const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  registerNumber: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  section: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
