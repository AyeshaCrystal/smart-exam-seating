const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  staffId: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  email: { type: String, required: true },
  available: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Staff', staffSchema);
