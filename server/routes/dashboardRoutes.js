const express = require('express');
const router = express.Router();
const { getStats, getInsights, getSoftLifeScore, getChallenges } = require('../controllers/dashboardController');
const { auth, checkSubscription } = require('../middleware/auth');

router.use(auth, checkSubscription);
router.get('/stats', getStats);
router.get('/insights', getInsights);
router.get('/soft-life-score', getSoftLifeScore);
router.get('/challenges', getChallenges);

module.exports = router;
