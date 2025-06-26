const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue' },
  date: Date,
});

module.exports = mongoose.model('Booking', bookingSchema);
