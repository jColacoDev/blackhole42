const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  daily_hours: { type: Number, default: 0 },
  weekly_days: { type: Number, default: 0 },
  myProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MyProject' }] // Reference to MyProject
});

module.exports = mongoose.model('User', userSchema);
