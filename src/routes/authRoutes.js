const express = require('express');
const { register, login, session } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/session', session);

module.exports = router;