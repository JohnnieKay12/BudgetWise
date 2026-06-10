const express = require('express');
const router = express.Router();
const { initializePayment, verifyPayment, renewSubscription, getPaymentHistory } = require('../controllers/paymentController');
const { auth } = require('../middleware/auth');

// PUBLIC ROUTE
router.post('/verify/:reference', verifyPayment);

// PROTECTED ROUTES
router.use(auth);

router.post('/initialize', initializePayment);
router.post('/renew', renewSubscription);
router.get('/history', getPaymentHistory);

module.exports = router;
