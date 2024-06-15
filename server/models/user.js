const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  level: { type: Number, default: 0 },
  level_percentage: { type: Number, default: 0 },
  kickoff_date: { type: Date },
  daily_hours: { type: Number, default: 0 },
  weekly_days: { type: Number, default: 0 },
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProjectUser', default: [] }],
});

module.exports = mongoose.model('User', userSchema);
