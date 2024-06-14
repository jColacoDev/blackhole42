const mongoose = require('mongoose');

const projectUserSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  start_date: { type: Date, default: null },
  finish_date: { type: Date, default: null },
  gained_bh_days: { type: Number, default: 0 },
  gained_xp: { type: Number, default: 0 },
  score: { type: Number, default: 0 },
});

module.exports = mongoose.model('ProjectUser', projectUserSchema);
