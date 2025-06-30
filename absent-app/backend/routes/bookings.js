const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const auth = require('../middleware/auth'); // ✅ Import middleware

// PATCH /api/bookings/:id — update booking fields (auth required)
router.patch('/:id', auth, async (req, res) => {
  try {
    const bookingId = req.params.id;
    const updates = req.body;

    // Optionally: restrict which fields may be updated
    const allowedFields = [
      'venue', 'title', 'description', 'category',
      'timeInterval', 'maxParticipants', 'price',
      'tags', 'photos', 'status'
    ];
    const invalidFields = Object.keys(updates).filter(f => !allowedFields.includes(f));
    if (invalidFields.length) {
      return res.status(400).json({ error: `Invalid fields: ${invalidFields.join(', ')}` });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    // Optionally: ensure only the owner or admin can update
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Preserve timeInterval if not provided in the update payload
    if (!updates.hasOwnProperty('timeInterval')) {
      updates.timeInterval = booking.timeInterval;
      console.log('booking.timeInterval: ', booking.timeInterval);
      console.log('updates.timeInterval: ', updates.timeInterval);
    }

    // Apply updates
    Object.keys(updates).forEach(field => {
      booking[field] = updates[field];
    });
    await booking.save();

    const populated = await Booking.findById(bookingId)
      .populate('user')
      .populate('venue');

    res.json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/bookings — Create a new booking (auth required)
router.post('/', auth, async (req, res) => {
  try {
    const {
      venue,
      title,
      description = '',
      category,
      timeInterval,      // must be an array with 1 {start, end}
      maxParticipants = 1,
      price = 0,
      tags = [],
      photos = [],
      status = 'pending'
    } = req.body;

    // Create booking document
    const booking = new Booking({
      user: req.user.id,
      venue,
      title,
      description,
      category,
      timeInterval,      // use new schema field
      maxParticipants,
      price,
      tags,
      photos,
      status
    });

    await booking.save();

    const populated = await Booking
      .findById(booking._id)
      .populate('user')
      .populate('venue');

    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET all bookings (protected if desired)
// GET /api/bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', '-password') // Exclude password field
      .populate('venue');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
