const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rank: { type: Number, required: true },
  xp: { type: Number, required: true },
  maxGrade: { type: Number, required: true },
});

module.exports = mongoose.model('Project', projectSchema);
