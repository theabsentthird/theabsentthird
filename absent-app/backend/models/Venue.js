// models/Venue.js
const mongoose = require('mongoose');

const bookingRangeSchema = new mongoose.Schema({
  start: { type: Date, required: true },
  end:   { type: Date, required: true }
}, { _id: false });

const venueSchema = new mongoose.Schema({
  name: String,
  location: String,
  description: String,
  pricePerNight: Number,
  company: String,
  latitude: Number,
  longitude: Number,
  bookedTimes: [bookingRangeSchema]  // New embedded bookings
});

module.exports = mongoose.model('Venue', venueSchema);
