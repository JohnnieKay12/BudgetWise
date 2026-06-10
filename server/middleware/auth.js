const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'budgetwise_secret_key');
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User not found. Token may be invalid.' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please login again.' });
    }
    res.status(500).json({ message: 'Server error during authentication.' });
  }
};

const checkSubscription = async (
  req,
  res,
  next
) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: 'Authentication required.',
      });
    }

    // CHECK DATE FIRST
    if (
      user.subscriptionEndDate &&
      new Date() >
        new Date(
          user.subscriptionEndDate
        )
    ) {
      user.subscriptionStatus =
        'expired';

      await user.save();

      return res.status(403).json({
        message:
          'Your subscription has expired.',
        subscriptionStatus:
          'expired',
        subscriptionEndDate:
          user.subscriptionEndDate,
      });
    }

    // THEN CHECK STATUS
    if (
      user.subscriptionStatus !==
      'active'
    ) {
      return res.status(403).json({
        message:
          'Your subscription has expired.',
        subscriptionStatus:
          user.subscriptionStatus,
        subscriptionEndDate:
          user.subscriptionEndDate,
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      message:
        'Server error during subscription check.',
    });
  }
};
module.exports = { auth, checkSubscription };
