const mongoose = require('mongoose');
 
const broadcastSchema = new mongoose.Schema({
  message: { type: String, required: true },
  notifType: { type: String, required: true }, // 'pickup' or 'announcement'
  sent_Date: { type: Date, default: Date.now },
  sent_Time: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the admin who sent the broadcast
  communityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Community', required: true } // Reference to the community
});
 
module.exports = mongoose.model('Broadcast', broadcastSchema);