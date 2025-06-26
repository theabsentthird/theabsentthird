const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
  name: String,
  location: String,
  description: String,
  pricePerNight: Number,
  company: String,
  availableDates: [Date],
  latitude: Number,
  longitude: Number,
});

module.exports = mongoose.model('Venue', venueSchema);
