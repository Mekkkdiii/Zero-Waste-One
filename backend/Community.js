const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  days: { type: [String], required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to admin
});

const Community = mongoose.model('Community', communitySchema);

module.exports = mongoose.model('Community', communitySchema);