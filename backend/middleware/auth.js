const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      console.error(' No token provided');
      return res.status(401).json({ data: null, error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      console.error(' User not found for token');
      return res.status(401).json({ data: null, error: 'User not found' });
    }

    // Provide both user and userId for backward compatibility
    req.user = user;
    req.userId = user._id ? user._id.toString() : undefined;
    next();
  } catch (error) {
    console.error(' Auth middleware error:', error.message);
    res.status(401).json({ data: null, error: 'Invalid token' });
  }
};

const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    next();
  };
};

module.exports = { authMiddleware, roleMiddleware };

