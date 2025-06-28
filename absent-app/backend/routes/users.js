const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth'); // ✅ Import middleware


// PATCH /api/users/:id - update user fields (auth required)
router.patch('/:id', auth, async (req, res) => {
  try {
    const userId = req.params.id;

    // Ensure only self or admin can update
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Restrict updatable fields
    const allowedFields = ['name', 'email', 'phoneNumber', 'profilePicture', 'bio', 'role'];
    const updates = Object.keys(req.body);
    const isValid = updates.every(field => allowedFields.includes(field));

    if (!isValid) {
      return res.status(400).json({ error: 'Invalid fields in update' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Apply updates
    updates.forEach(field => {
      user[field] = req.body[field];
    });

    await user.save();

    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;


module.exports = router;
