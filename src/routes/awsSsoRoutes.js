const express = require('express');
const { redirectToAwsSso, handleAwsSsoCallback } = require('../controllers/awsSsoController');
const router = express.Router();

router.get('/login', redirectToAwsSso);
router.get('/callback', handleAwsSsoCallback);

module.exports = router;