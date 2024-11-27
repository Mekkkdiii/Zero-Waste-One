const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },  // for both admin and user
  email: { type: String, unique: true, required: true },
  phone: { type: String, required: true },
  address: { type: String }, // Optional for admin, but required for normal users
  role: { type: String, enum: ['admin', 'community-user'], required: true },
  password: { type: String, required: true },
  community: { type: mongoose.Schema.Types.ObjectId, ref: 'Community' },  // Optional for admin, required for community-user
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Only for community-user, to reference the admin
});

// Add extra logic or methods if needed
// For example, a method to check if the user is an admin
userSchema.methods.isAdmin = function() {
  return this.role === 'admin';
};

const User = mongoose.model('User', userSchema);
module.exports = User;
