const mongoose = require('mongoose');

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

module.exports = mongoose.model('User', userSchema);
