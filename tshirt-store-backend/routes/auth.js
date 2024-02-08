const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Registration endpoint - Exclude from authMiddleware
router.post('/register', async (req, res) => {
  try {
    const { username, password, role,email,profileImage } = req.body;

    // Check if the role is specified and is valid
    if (!role || (role !== 'user' && role !== 'admin')) {
      return res.status(400).json({ error: 'Invalid role specified' });
    }

    // Check if the username is unique
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username is already taken' });
    }

    // Create a new user
    const newUser = new User({
      username,
      password,
      role,
      email,
      profileImage
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    console.log('User:', user);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials - User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    console.log('Password Valid:', isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials - Password mismatch' });
    }

    // Generate a token with the user's ID and role
    const tokenPayload = { userId: user._id, role: user.role };
    console.log('Token Payload:', tokenPayload); // Add this line

    const secretKey = process.env.SECRET_KEY;
    console.log('Secret Key:', secretKey); // Add this line

    const expiresIn = 60 * 60 * 24 * 30 * 3; // Token expiry for 3 months (in seconds)

    const token = jwt.sign(tokenPayload, secretKey, { expiresIn });
    console.log('Generated Token:', token); // Add this line

    res.json({ token, role: user.role }); // Include the user role in the response
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Example protected endpoint for admin role
router.get('/admin/dashboard', authMiddleware, adminMiddleware, (req, res) => {
  // Only allow access if the user has an 'admin' role
  res.json({ message: 'Welcome to the admin dashboard' });
});

// Additional endpoint to get user list for admin
router.get('/admin/users', authMiddleware, adminMiddleware, async (req, res) => {
  // Only allow access if the user has an 'admin' role
  // ... (unchanged)
});




module.exports = router;

