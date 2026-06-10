const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'budgetwise_secret_key',
    {
      expiresIn: process.env.JWT_EXPIRE || '24h',
    }
  );
};

// @desc Register new user
// @route POST /api/auth/register
// @access Public
exports.register = async (req, res) => {
  try {
    let { fullName, email, password } = req.body;

    email = email.toLowerCase().trim();

    const user = await User.create({
      fullName,
      email,
      password,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc Login user
// @route POST /api/auth/login
// @access Public
exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = String(email).toLowerCase().trim();
    password = String(password).trim();

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    // Update last login
    await User.findByIdAndUpdate(
      user._id,
      {
        lastLogin: new Date(),
      }
    );

    const token = generateToken(user._id);

    const userResponse = user.toObject();

    delete userResponse.password;

    userResponse.lastLogin = new Date();

    res.json({
      success: true,
      token,
      user: userResponse,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc Get current user
// @route GET /api/auth/me
// @access Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.json(user);
  } catch (error) {
    console.error('GET ME ERROR:', error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc Logout user
// @route POST /api/auth/logout
// @access Private
exports.logout = async (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully.',
  });
};

// @desc Forgot password
// @route POST /api/auth/forgot-password
// @access Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        message: 'No account found with that email.',
      });
    }

    res.json({
      success: true,
      message: 'Password reset link sent.',
    });
  } catch (error) {
    console.error('FORGOT PASSWORD ERROR:', error);

    res.status(500).json({
      message: error.message,
    });
  }
};