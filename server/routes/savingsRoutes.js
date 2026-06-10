const express = require('express');
const router = express.Router();
const { getSavingsGoals, createSavingsGoal, updateSavingsGoal, deleteSavingsGoal } = require('../controllers/savingsController');
const { auth, checkSubscription } = require('../middleware/auth');

router.use(auth, checkSubscription);
router.get('/', getSavingsGoals);
router.post('/', createSavingsGoal);
router.put('/:id', updateSavingsGoal);
router.delete('/:id', deleteSavingsGoal);

module.exports = router;
