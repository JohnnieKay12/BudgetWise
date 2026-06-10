const express = require('express');
const router = express.Router();
const { getBudgets, createBudget, updateBudget } = require('../controllers/budgetController');
const { auth, checkSubscription } = require('../middleware/auth');

router.use(auth, checkSubscription);
router.get('/', getBudgets);
router.post('/', createBudget);
router.put('/:id', updateBudget);

module.exports = router;
