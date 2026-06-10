const Notification = require('../models/Notification');

// @desc    Get all notifications
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user.id,
    })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(notifications);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc    Get unread notification count
// @route   GET /api/notifications/unread-count
// @access  Private
exports.getUnreadCount = async (req, res) => {
  try {
    const count =
      await Notification.countDocuments({
        user: req.user.id,
        isRead: false,
      });

    res.json({ count });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc    Mark single notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const notification =
      await Notification.findOneAndUpdate(
        {
          _id: req.params.id,
          user: req.user.id,
        },
        {
          isRead: true,
        },
        {
          new: true,
        }
      );

    if (!notification) {
      return res.status(404).json({
        message:
          'Notification not found.',
      });
    }

    res.json(notification);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllAsRead = async (
  req,
  res
) => {
  try {
    await Notification.updateMany(
      {
        user: req.user.id,
        isRead: false,
      },
      {
        isRead: true,
      }
    );

    res.json({
      success: true,
      message:
        'All notifications marked as read.',
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc    Create notification (internal use)
// @access  Internal
exports.createNotification = async (
  userId,
  title,
  message,
  type = 'info'
) => {
  try {
    await Notification.create({
      user: userId,
      title,
      message,
      type,
      isRead: false,
    });
  } catch (error) {
    console.error(
      'Create notification error:',
      error
    );
  }
};