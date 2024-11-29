const mongoose = require('mongoose');
 
const pickupSchema = new mongoose.Schema({
  communityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Community', required: true }, //Community user who booked this time slot
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pickupType: { type: String, required: true}, //eg. Recyclable, Hazardous, Household
  pickupDate: { type: Date, required: true }, // Date for the pickup
  pickupTime: { type: String, required: true }, // Time as string
  pickupStatus: { type: String, required: true }, //eg. NEW, PENDING, COMPLETED
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Admin who created the schedule
});
 
const Pickup = mongoose.model('Pickup', pickupSchema);
module.exports = mongoose.model('Pickup', pickupSchema);