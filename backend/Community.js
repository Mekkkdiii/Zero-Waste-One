const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
  name: String,
  address: String,
  days: [String],  // Pickup days (array of strings)
  startTime: String, // Pickup start time (e.g., "08:00 AM")
  endTime: String,   // Pickup end time (e.g., "05:00 PM")
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the User (admin)
});

const Community = mongoose.model('Community', communitySchema);
module.exports = Community;