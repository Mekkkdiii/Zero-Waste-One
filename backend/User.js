const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], required: true }, // Role of the user
  communityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Community' }, // Optional, only for users
});

module.exports = mongoose.model('User', userSchema);