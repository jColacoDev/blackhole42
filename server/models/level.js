const mongoose = require('mongoose');

const levelSchema = new mongoose.Schema({
  level: { type: Number, required: true },
  xp_total: { type: Number, required: true },
  days: { type: Number, required: true },
});

module.exports = mongoose.model('Level', levelSchema);
