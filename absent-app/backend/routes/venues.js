const express = require('express');
const router = express.Router();
const Venue = require('../models/Venue');
const geocodeAddress = require('../utils/geocode'); // Utility function to geocode address
const auth = require('../middleware/auth');
const authorizeRole = require('../middleware/authRole');

// POST /venues — Create a new venue
router.post('/', async (req, res) => {
  try {
    const {
      name,
      address,
      description,
      capacity,
      price,
      pricingType = 'daily',
      amenities = [],
      photos = [],
      bookedTimes = []
    } = req.body;

    // Geocode the address
    const coords = await geocodeAddress(address);
    if (!coords) return res.status(400).json({ error: 'Unable to geocode address' });

    // Build the new Venue object
    const venue = new Venue({
      name,
      address,
      description,
      capacity,
      price,
      pricingType,
      amenities,
      photos,
      latitude: coords.lat,
      longitude: coords.lng,
      bookedTimes
    });

    // Save and return
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


// PATCH /venues/:id/bookings — permissioned booking updates
// change booking times for a venue (admin/business only)
router.patch(
  '/:id/bookings',
  auth,
  authorizeRole(['admin', 'business']),   // Only admin/business allowed
  async (req, res) => {
    try {
      const { start, end } = req.body;
      const newStart = new Date(start), newEnd = new Date(end);
      if (newStart >= newEnd) return res.status(400).json({ error: 'Invalid time range' });

      const venue = await Venue.findById(req.params.id);
      if (!venue) return res.status(404).json({ error: 'Venue not found' });

      const conflict = venue.bookedTimes.some(bt => {
        return newStart <= bt.end && bt.start <= newEnd;
      });
      if (conflict) return res.status(409).json({ error: 'Booking time conflicts with existing booking' });

      venue.bookedTimes.push({ start: newStart, end: newEnd });
      await venue.save();
      res.json(venue);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

// PATCH /api/venues/:id — update venue details (admin/business only)
router.patch(
  '/:id',
  auth,
  authorizeRole(['admin', 'business']),
  async (req, res) => {
    try {
      const updates = req.body;
      const allowedFields = ['name','description','address','capacity','price','pricingType','amenities','photos'];
      const invalid = Object.keys(updates).filter(f => !allowedFields.includes(f));
      if (invalid.length) return res.status(400).json({ error: `Invalid fields: ${invalid.join(', ')}` });

      const venue = await Venue.findById(req.params.id);
      if (!venue) return res.status(404).json({ error: 'Venue not found' });

      Object.assign(venue, updates);
      await venue.save();
      res.json(venue);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

module.exports = router;
