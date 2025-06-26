const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();

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

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user with all fields
    const user = new User({
      name,
      email,
      password: hashedPassword,
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
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    // Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
