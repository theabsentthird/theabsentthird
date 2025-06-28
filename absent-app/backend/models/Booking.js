const mongoose = require('mongoose');

const TAGS = ['Live Music', 'Exhibition', 'Workshop', 'Conference', 'Networking', 'Charity', 'Family Friendly', 'Outdoor']

const timeRangeSchema = new mongoose.Schema({
  start: { type: Date, required: true },
  end:   { type: Date, required: true }
}, { _id: false });

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue' },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, enum: ['Music', 'Art', 'Sports', 'Food', 'Business', 'Technology', 'Education', 'Health']}, // User role
  timeInterval: {
    type: [timeRangeSchema],
    validate: {
      validator: function (val) {
        return val.length === 1;
      },
      message: props => `\`${props.path}\` must contain exactly 1 item, got ${props.value.length}`
    },  // New embedded bookings
  },
  maxParticipants: { type: Number, default: 1 },
  price: { type: Number, required: true, default: 0 },
  tags: {
    type: [String],
    enum: TAGS,  // Only these values are allowed
    default: []
  },
  photos: [String],  // Array of photo URLs
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

bookingSchema.post('save', async function(doc, next) {
  try {
    const venueId = doc.venue;
    const { start, end } = doc.timeInterval[0];  // We know it's exactly 1 item

    // Push the booking time to the associated venue
    await this.model('Venue').findByIdAndUpdate(
      venueId,
      { $push: { bookedTimes: { start, end } } }
    );

    next();
  } catch (err) {
    next(err);
  }
});


module.exports = mongoose.model('Booking', bookingSchema);
