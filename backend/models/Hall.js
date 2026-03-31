const mongoose = require('mongoose');

const hallSchema = new mongoose.Schema({
  hallId: { type: String, required: true, unique: true },
  numberOfBenches: { type: Number, required: true },
  benchType: { type: String, enum: ['long', 'short'], required: true },
}, { timestamps: true });

module.exports = mongoose.model('Hall', hallSchema);
