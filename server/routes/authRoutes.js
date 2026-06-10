const express = require('express');
const router = express.Router();
const { register, login, getMe, logout, forgotPassword } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', auth, logout);
router.get('/me', auth, getMe);
router.post('/forgot-password', forgotPassword);

module.exports = router;
