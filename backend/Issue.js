const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  type: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  comments: { type: String },
  status: { type: String, default: 'NEW' },
  photo: { type: String } // If you want to store the photo path
}, { timestamps: true });

const Issue = mongoose.model('Issue', issueSchema);

module.exports = Issue;