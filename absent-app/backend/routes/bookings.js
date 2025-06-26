const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const auth = require('../middleware/auth'); // ✅ Import middleware

// Create a booking (auth required)
router.post('/', auth, async (req, res) => {
  try {
    const booking = new Booking({
      user: req.user.id, // ✅ Comes from decoded JWT in middleware
      venue: req.body.venue,
      date: req.body.date,
    });

    await booking.save();

    const populated = await Booking.findById(booking._id).populate('user venue');
    console.log('New booking created:', populated); // Debugging line
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all bookings (optional: you could protect this too)
router.get('/', async (req, res) => {
  const bookings = await Booking.find().populate('user venue');
  res.json(bookings);
});

module.exports = router;
