// models/Project.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LanguageSchema = new Schema({
  id: Number,
  name: String,
  identifier: String,
  created_at: Date,
  updated_at: Date
});

const CampusSchema = new Schema({
  id: Number,
  name: String,
  users_count: Number,
  city: String,
  country: String,
  public: Boolean,
  active: Boolean
});

const CursusSchema = new Schema({
  id: Number,
  name: String,
  slug: String,
  kind: String
});

const ProjectSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  slug: { type: String, required: true },
  attachments: { type: Array, default: [] },
  campus: { type: [CampusSchema], default: [] },
  children: { type: Array, default: [] },
  created_at: Date,
  cursus: { type: [CursusSchema], default: [] },
  difficulty: Number,
  exam: Boolean,
  git_id: Number,
  repository: String,
  updated_at: Date
});

const Project = mongoose.model('Project', ProjectSchema);
module.exports = Project;
