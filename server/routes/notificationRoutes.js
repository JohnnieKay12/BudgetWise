const express = require('express');

const router = express.Router();

const {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
} = require('../controllers/notificationController');

const {
    auth,
    checkSubscription,
} = require('../middleware/auth');

router.use(auth, checkSubscription);

// Get all notifications
router.get('/', getNotifications);

// Get unread count
router.get(
    '/unread-count',
    getUnreadCount
);

// Mark one as read
router.put(
    '/:id/read',
    markAsRead
);

// Mark all as read
router.put(
    '/read-all',
    markAllAsRead
);

module.exports = router;