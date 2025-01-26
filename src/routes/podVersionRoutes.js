const express = require('express');
const { getPodVersions, savePodVersion } = require('../controllers/podVersionController');
const router = express.Router();

router.get('/', getPodVersions);
router.post('/save', savePodVersion);

module.exports = router;