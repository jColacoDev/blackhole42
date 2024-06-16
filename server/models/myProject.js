const mongoose = require('mongoose');

const myProjectSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  rank: { type: Number, required: true },
  xp: { type: Number, required: true },
  maxGrade: { type: Number, required: true },
});

module.exports = mongoose.model('MyProject', myProjectSchema);
