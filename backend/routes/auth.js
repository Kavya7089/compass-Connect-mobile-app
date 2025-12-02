const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Sign up
router.post('/signup', async (req, res) => {
  try {
    const { email, password, role, name, department } = req.body;

    console.log('📝 Signup request:', { email, role, name });

    if (!email || !password) {
      const errorMsg = 'Email and password are required';
      console.error('❌ Validation error:', errorMsg);
      return res.status(400).json({ data: null, error: errorMsg });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      const errorMsg = 'Invalid email format';
      console.error('❌ Email validation error:', errorMsg);
      return res.status(400).json({ data: null, error: errorMsg });
    }

    if (password.length < 6) {
      const errorMsg = 'Password must be at least 6 characters';
      console.error('❌ Password validation error:', errorMsg);
      return res.status(400).json({ data: null, error: errorMsg });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const errorMsg = 'User already exists';
      console.error('❌ Duplicate user error:', errorMsg);
      return res.status(400).json({ data: null, error: errorMsg });
    }

    const user = new User({
      email,
      password,
      role: role || 'student',
      name: name || '',
      department: department || '',
    });

    await user.save();
    console.log('✅ User created:', user._id);

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          name: user.name,
        },
        token,
      },
      error: null,
    });
  } catch (error) {
    console.error('❌ Signup error:', error);
    res.status(500).json({ data: null, error: error.message || 'Internal server error' });
  }
});

// Sign in
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('📝 SignIn request:', { email });

    if (!email || !password) {
      const errorMsg = 'Email and password are required';
      console.error('❌ Validation error:', errorMsg);
      return res.status(400).json({ data: null, error: errorMsg });
    }

    const user = await User.findOne({ email });
    if (!user) {
      const errorMsg = 'Invalid credentials';
      console.error('❌ User not found:', email);
      return res.status(401).json({ data: null, error: errorMsg });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const errorMsg = 'Invalid credentials';
      console.error('❌ Password mismatch for:', email);
      return res.status(401).json({ data: null, error: errorMsg });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    console.log('✅ User signed in:', user._id);

    res.json({
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          name: user.name,
          department: user.department,
        },
        token,
      },
      error: null,
    });
  } catch (error) {
    console.error('❌ SignIn error:', error);
    res.status(500).json({ data: null, error: error.message || 'Internal server error' });
  }
});

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    console.log('📝 Get current user:', req.user._id);
    res.json({
      data: {
        id: req.user._id,
        email: req.user.email,
        role: req.user.role,
        name: req.user.name,
        department: req.user.department,
      },
      error: null,
    });
  } catch (error) {
    console.error('❌ Get current user error:', error);
    res.status(500).json({ data: null, error: error.message || 'Internal server error' });
  }
});

module.exports = router;

