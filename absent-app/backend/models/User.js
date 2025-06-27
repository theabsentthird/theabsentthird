const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, // Hashed password
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  phoneNumber: { type: String, unique: true, sparse: true }, // Optional phone number
  profilePicture: { type: String, default: '' }, // URL to profile picture
  bio : { type: String, default: '' }, // User bio
  role: { type: String, enum: ['user', 'admin', 'business'], default: 'user' }, // User role

});

// In models/User.js, above module.exports:
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
