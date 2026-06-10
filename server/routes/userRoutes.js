const express = require('express');
const router = express.Router();
const { 
    getProfile, 
    updateProfile, 
    getSettings,
    updateSettings,
    changePassword, 
} = require('../controllers/userController');
const { auth, checkSubscription } = require('../middleware/auth');

router.use(auth, checkSubscription);

// Profile
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Settings
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

// Password
router.put(
  '/change-password',
  changePassword
);

module.exports = router;
