const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  seatingType: { type: String, enum: ['internal', 'semester'], default: 'internal' },
  mixDepartments: { type: Boolean, default: true },
  avoidSameDeptAdjacent: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
