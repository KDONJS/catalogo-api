const express = require('express');
const { checkSetupStatus, setupAdmin } = require('../controllers/setupController');
const router = express.Router();

router.get('/status', checkSetupStatus);
router.post('/init', setupAdmin);

module.exports = router;