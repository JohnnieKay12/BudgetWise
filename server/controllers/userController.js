const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const {
      fullName,
      email,
      currency,
      avatar
    } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        fullName,
        email,
        currency,
        avatar
      },
      {
        new: true,
        runValidators: true
      }
    );

    res.json(user);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

exports.getSettings = async (
  req,
  res
) => {
  try {
    const user =
      await User.findById(
        req.user.id
      );

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    res.json({
      currency: user.currency,
      settings: user.settings,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { currency, settings } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    if (currency) {
      user.currency = currency;
    }

    if (settings) {
      user.settings = {
        ...user.settings,
        ...settings,
      };
    }

    await user.save();

    res.json({
      currency: user.currency,
      settings: user.settings,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.changePassword =
  async (
    req,
    res
  ) => {
    try {
      const {
        currentPassword,
        newPassword,
      } = req.body;
      
      const user =
        await User.findById(
          req.user.id
        ).select(
          '+password'
        );
        
        if (!user) {
          return res.status(404).json({
            message: 'User not found',
          });
        }
        
        const isMatch =
        await user.comparePassword(
          currentPassword
        );

        if (!isMatch) {
          return res
            .status(400)
            .json({
              message:
              'Current password is incorrect',
            });
        }

        user.password =
        newPassword;

        await user.save();

        res.json({
          message:
            'Password updated successfully',
        });
      } catch (error) {
        res.status(400).json({
          message:
          error.message,
        });
      }
};
