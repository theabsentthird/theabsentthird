// models/Venue.js
const mongoose = require('mongoose');

const AMENITIES = ['WiFi', 'Parking', 'Wheelchair Access', 'Catering', 'Projector', 'Sound System', 'Stage', 'Outdoor Space'];

const bookingRangeSchema = new mongoose.Schema({
  start: { type: Date, required: true },
  end:   { type: Date, required: true }
}, { _id: false });

const venueSchema = new mongoose.Schema({
  name: String,
  description: String,
  address: String,
  latitude: Number,
  longitude: Number,
  capacity: Number,
  price: Number,
  pricingType: { type: String, enum: ['hourly', 'daily', 'weekly', 'monthly'], default: 'daily' },
  amenities: {
    type: [String],
    enum: AMENITIES,  // Only these values are allowed
    default: []
  },
  photos: [String],  // Array of photo URLs
  bookedTimes: [bookingRangeSchema]  // New embedded bookings

});

module.exports = mongoose.model('Venue', venueSchema);
