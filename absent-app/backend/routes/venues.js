const express = require('express');
const router = express.Router();
const Venue = require('../models/Venue');
const geocodeAddress = require('../utils/geocode'); // Utility function to geocode address

router.post('/', async (req, res) => {
  try {
    const { name, location, description, pricePerNight, company, availableDates } = req.body;
    console.log('Received venue data:', req.body);
    // Get latitude and longitude from address
    const coords = await geocodeAddress(location);
    if (!coords) {
      return res.status(400).json({ error: 'Unable to geocode address' });
    }
    console.log('Geocoded coordinates:', coords); // Debugging line

    // Create and save venue with coordinates
    const venue = new Venue({
      name,
      location,
      description,
      pricePerNight,
      company,
      availableDates,
      latitude: coords.lat,
      longitude: coords.lng
    });

    await venue.save();
    console.log('New venue created:', venue); // Debugging line
    res.status(201).json(venue);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  const venues = await Venue.find();
  res.json(venues);
});

module.exports = router;
