const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  type: { type: String, required: true }, //eg.Missed Pickup, Illegal Dumping, Overflowing Bin, Others
  location: { type: String, required: true },
  description: { type: String, required: true },
  comments: { type: String },
  reportedAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, default: 'NEW', enum: ['NEW', 'IN PROGRESS', 'RESOLVED'] }
});

const Issue = mongoose.model('Issue', issueSchema);
module.exports = mongoose.model('Issue', issueSchema);