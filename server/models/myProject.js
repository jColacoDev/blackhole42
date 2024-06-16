const mongoose = require('mongoose');

const myProjectSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  email: { type: String, required: true },
  grade: { type: Number },
  start_date: Date,
  end_date: Date,
});

myProjectSchema.index({ email: 1, id: 1 }, { unique: true });

module.exports = mongoose.model('MyProject', myProjectSchema);
