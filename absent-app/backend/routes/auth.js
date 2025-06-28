const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();
const auth = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register user

// Register a new user 
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phoneNumber,
      profilePicture,
      bio,
      role
    } = req.body;

    // Check if email or phone number already exists
    const existingUser = await User.findOne({ 
      $or: [
        { email },
        { phoneNumber }
      ]
    });
    if (existingUser) return res.status(400).json({ error: 'User with this email or phone number already exists' });

    // // Hash the password
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    // Save user with all fields
    const user = new User({
      name,
      email,
      password: password,
      phoneNumber,
      profilePicture,
      bio,
      role
    });

    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// @route   POST /api/auth/login
// @desc    Login user

// POST /api/auth/login
// Login user and return JWT
// In your auth/login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    // bcrypt.compare matches plain vs hashed; no extra hashing needed

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    // Issue JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route PATCH /api/auth/update-password
// @desc  Update user password (requires current password)
router.patch(
  '/update-password',
  auth, // assuming you have an auth middleware to protect this route
  async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id; // assuming auth middleware sets req.user

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Both current and new password are required' });
      }

      // Find user
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: 'User not found' });

      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(401).json({ error: 'Current password is incorrect' });

      // Set new password and save
      user.password = newPassword;
      await user.save(); // pre‑hook hashes it

      res.json({ message: 'Password updated successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);


module.exports = router;
