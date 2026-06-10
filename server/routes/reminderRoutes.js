const express = require('express');
const router = express.Router();
const { getReminders, createReminder, updateReminder, deleteReminder } = require('../controllers/reminderController');
const { auth, checkSubscription } = require('../middleware/auth');

router.use(auth, checkSubscription);
router.get('/', getReminders);
router.post('/', createReminder);
router.put('/:id', updateReminder);
router.delete('/:id', deleteReminder);

module.exports = router;
