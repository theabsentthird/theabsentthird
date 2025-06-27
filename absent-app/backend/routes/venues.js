const express = require('express');
const router = express.Router();
const Venue = require('../models/Venue');
const geocodeAddress = require('../utils/geocode'); // Utility function to geocode address

// routes/venue.js - POST /
router.post('/', async (req, res) => {
  try {
    const {
      name,
      location,
      description,
      pricePerNight,
      company,  
      bookedTimes = []
    } = req.body;

    const coords = await geocodeAddress(location);
    if (!coords) return res.status(400).json({ error: 'Unable to geocode address' });

    const venue = new Venue({
      name,
      location,
      description,
      pricePerNight,
      company,
      latitude: coords.lat,
      longitude: coords.lng,
      bookedTimes
    });

    await venue.save();
    res.status(201).json(venue);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.get('/', async (req, res) => {
  const venues = await Venue.find();
  res.json(venues);
});

// routes/venue.js - PATCH /:id/bookings
router.patch('/:id/bookings', async (req, res) => {
  try {
    const { start, end } = req.body;
    const newStart = new Date(start), newEnd = new Date(end);

    if (newStart >= newEnd) {
      return res.status(400).json({ error: 'Invalid time range' });
    }

    const venue = await Venue.findById(req.params.id);
    if (!venue) return res.status(404).json({ error: 'Venue not found' });

    const conflict = venue.bookedTimes.some(bt => {
      const existingStart = new Date(bt.start);
      const existingEnd = new Date(bt.end);
      console.log(`Checking conflict: ${existingStart} - ${existingEnd} with ${newStart} - ${newEnd}`);
      return (newStart <= existingEnd && existingStart <= newEnd);
    });

    if (conflict) {
      return res.status(409).json({ error: 'Booking time conflicts with existing booking' });
    }

    venue.bookedTimes.push({ start: newStart, end: newEnd });
    await venue.save();

    res.json(venue);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



module.exports = router;
