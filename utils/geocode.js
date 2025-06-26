const axios = require('axios');
const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY; // Store your API key in .env

async function geocodeAddress(address) {
  try {
    const response = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
      params: {
        key: OPENCAGE_API_KEY,
        q: address,
        limit: 1
      }
    });

    const data = response.data;
    if (data.results.length === 0) {
      throw new Error('No results found for address');
    }

    const { lat, lng } = data.results[0].geometry;
    return { lat, lng };

  } catch (error) {
    console.error('Geocoding error:', error.message);
    return null;
  }
}

module.exports = geocodeAddress;
