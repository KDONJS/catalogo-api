const express = require('express');
const { getPods } = require('../controllers/kubernetesController');
const router = express.Router();

router.get('/pods', getPods);

module.exports = router;